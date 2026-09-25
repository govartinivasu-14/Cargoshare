package com.cargoshare.service;

import com.cargoshare.dto.request.BookingRequest;
import com.cargoshare.dto.response.BookingResponse;
import com.cargoshare.entity.Booking;
import com.cargoshare.entity.Container;
import com.cargoshare.entity.Payment;
import com.cargoshare.entity.User;
import com.cargoshare.entity.enums.BookingStatus;
import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.exception.InsufficientSpaceException;
import com.cargoshare.exception.ResourceNotFoundException;
import com.cargoshare.repository.BookingRepository;
import com.cargoshare.repository.ContainerRepository;
import com.cargoshare.repository.PaymentRepository;
import com.cargoshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ContainerRepository containerRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Rule 7 & Rule 4 & Rule 5:
     * Pessimistic row lock (SELECT ... FOR UPDATE) ensures race conditions cannot overbook container.
     * Decrements available space under the transaction and broadcasts live to /topic/containers/{id}.
     */
    @Transactional
    public BookingResponse createBooking(Long traderId, BookingRequest req) {
        User trader = userRepository.findById(traderId)
                .orElseThrow(() -> new ResourceNotFoundException("Trader account not found"));

        // Pessimistic write lock on container row
        Container container = containerRepository.findByIdForUpdate(req.getContainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Container not found with ID: " + req.getContainerId()));

        BigDecimal spaceRequired = req.getSpaceRequired();
        if (spaceRequired == null || spaceRequired.signum() <= 0) throw new com.cargoshare.exception.BadRequestException("Space must be positive");
        if (container.getProvider().getStatus() != com.cargoshare.entity.enums.ProviderStatus.APPROVED
                || container.getStatus() == ContainerStatus.CLOSED
                || container.getDepartureDate().isBefore(java.time.LocalDateTime.now())
                || (container.getCutoffDate() != null && container.getCutoffDate().isBefore(java.time.LocalDateTime.now()))) {
            throw new com.cargoshare.exception.BadRequestException("Container is not open for booking");
        }

        // Rule 4: Authoritative server check
        if (spaceRequired.compareTo(container.getAvailableCapacity()) > 0) {
            throw new InsufficientSpaceException(container.getAvailableCapacity());
        }

        // Rule 5: Immediately decrement space
        container.setAvailableCapacity(container.getAvailableCapacity().subtract(spaceRequired));
        container.setOccupiedCapacity(container.getOccupiedCapacity().add(spaceRequired));
        if (container.getAvailableCapacity().compareTo(BigDecimal.ZERO) == 0) {
            container.setStatus(ContainerStatus.FULL);
        }
        containerRepository.save(container);

        BigDecimal amount = spaceRequired.multiply(container.getPricePerCbm()).setScale(2, java.math.RoundingMode.HALF_UP);
        String bookingNumber = "BKG-" + UUID.randomUUID();

        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .trader(trader)
                .container(container)
                .spaceBooked(spaceRequired)
                .amount(amount)
                .cargoDescription(req.getCargoDescription() != null ? req.getCargoDescription() : "Standard commercial cargo")
                .weightKg(req.getWeightKg() != null ? req.getWeightKg() : spaceRequired.multiply(BigDecimal.valueOf(300)))
                .bookingStatus(BookingStatus.PENDING_PAYMENT)
                .build();

        booking = bookingRepository.save(booking);

        // Broadcast the new availability over WebSocket
        Map<String, Object> updatePayload = new HashMap<>();
        updatePayload.put("id", "CNT-" + container.getId());
        updatePayload.put("availableCapacity", container.getAvailableCapacity());
        updatePayload.put("occupiedCapacity", container.getOccupiedCapacity());
        updatePayload.put("status", container.getStatus());

        final Long updatedId = container.getId();
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(new org.springframework.transaction.support.TransactionSynchronization() {
            @Override public void afterCommit() {
                messagingTemplate.convertAndSend("/topic/containers/CNT-" + updatedId, updatePayload);
                messagingTemplate.convertAndSend("/topic/containers/all", updatePayload);
            }
        });

        return BookingResponse.fromEntity(booking, null);
    }

    @Transactional
    public BookingResponse updateShipment(Long id, Long providerUserId, BookingStatus status) {
        Booking b = bookingRepository.findByIdForUpdate(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!b.getContainer().getProvider().getUser().getId().equals(providerUserId)) throw new com.cargoshare.exception.ForbiddenException("Not your shipment");
        if (!(b.getBookingStatus() == BookingStatus.CONFIRMED && status == BookingStatus.IN_TRANSIT
                || b.getBookingStatus() == BookingStatus.IN_TRANSIT && status == BookingStatus.DELIVERED))
            throw new com.cargoshare.exception.BadRequestException("Invalid shipment status transition");
        b.setBookingStatus(status);
        return BookingResponse.fromEntity(b, paymentRepository.findByBookingId(id).orElse(null));
    }

    @Transactional
    public BookingResponse cancel(Long id) {
        Booking b = bookingRepository.findByIdForUpdate(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (b.getBookingStatus() != BookingStatus.PENDING_PAYMENT) throw new com.cargoshare.exception.BadRequestException("Only unpaid bookings can be cancelled");
        if (paymentRepository.findByBookingId(id).filter(p -> !p.getRazorpayOrderId().startsWith("DEMO-")).isPresent()) throw new com.cargoshare.exception.BadRequestException("Checkout has started. Contact support before releasing this reservation");
        Container c = containerRepository.findByIdForUpdate(b.getContainer().getId()).orElseThrow();
        c.setAvailableCapacity(c.getAvailableCapacity().add(b.getSpaceBooked()));
        c.setOccupiedCapacity(c.getOccupiedCapacity().subtract(b.getSpaceBooked()));
        if (c.getStatus() == ContainerStatus.FULL) c.setStatus(ContainerStatus.AVAILABLE);
        b.setBookingStatus(BookingStatus.CANCELLED);
        var update = com.cargoshare.dto.response.ContainerResponse.fromEntity(c);
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(new org.springframework.transaction.support.TransactionSynchronization() {
            @Override public void afterCommit() {
                messagingTemplate.convertAndSend("/topic/containers/" + update.getId(), update);
                messagingTemplate.convertAndSend("/topic/containers/all", update);
            }
        });
        return BookingResponse.fromEntity(b, null);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long traderId) {
        List<Booking> list = bookingRepository.findByTraderIdOrderByCreatedAtDesc(traderId);
        return list.stream()
                .map(b -> {
                    Payment p = paymentRepository.findByBookingId(b.getId()).orElse(null);
                    return BookingResponse.fromEntity(b, p);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getProviderBookings(Long providerUserId) {
        List<Booking> list = bookingRepository.findByProviderUserId(providerUserId);
        return list.stream()
                .map(b -> {
                    Payment p = paymentRepository.findByBookingId(b.getId()).orElse(null);
                    return BookingResponse.fromEntity(b, p);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        Payment p = paymentRepository.findByBookingId(booking.getId()).orElse(null);
        return BookingResponse.fromEntity(booking, p);
    }
}
