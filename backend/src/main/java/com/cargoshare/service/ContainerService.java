package com.cargoshare.service;

import com.cargoshare.dto.request.ContainerRequest;
import com.cargoshare.dto.response.ContainerResponse;
import com.cargoshare.entity.Container;
import com.cargoshare.entity.Provider;
import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.TransportMode;
import com.cargoshare.exception.ForbiddenException;
import com.cargoshare.exception.ResourceNotFoundException;
import com.cargoshare.repository.ContainerRepository;
import com.cargoshare.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContainerService {

    private final ContainerRepository containerRepository;
    private final ProviderRepository providerRepository;
    private final com.cargoshare.repository.BookingRepository bookingRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Rule 3: Only APPROVED providers' containers are visible in search.
     */
    @Transactional(readOnly = true)
    public List<ContainerResponse> searchContainers(
            String origin,
            String destination,
            TransportMode mode,
            BigDecimal minSpace,
            LocalDateTime departureDate) {

        List<Container> containers = containerRepository.searchContainers(
                origin, destination, mode, minSpace, departureDate);

        return containers.stream()
                .map(ContainerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ContainerResponse getContainerById(Long id) {
        Container container = containerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Container not found with ID: " + id));
        return ContainerResponse.fromEntity(container);
    }

    /**
     * Rule 2: A provider must be APPROVED before publishing containers.
     */
    @Transactional
    public ContainerResponse addContainer(Long providerUserId, ContainerRequest req) {
        Provider provider = providerRepository.findByUserId(providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider record not found for user ID: " + providerUserId));

        if (provider.getStatus() != ProviderStatus.APPROVED) {
            throw new ForbiddenException("Cannot publish container space: Your carrier application is currently in "
                    + provider.getStatus() + " status and must be APPROVED by port admin.");
        }

        String containerNumber = req.getContainerNumber();
        if (containerNumber == null || containerNumber.trim().isEmpty()) {
            containerNumber = "CSU-" + Math.abs(UUID.randomUUID().getMostSignificantBits() % 900000 + 100000) + "-1";
        }

        BigDecimal avail = req.getAvailableCapacity() != null ? req.getAvailableCapacity() : req.getTotalCapacity();

        if (avail.signum() < 0 || avail.compareTo(req.getTotalCapacity()) > 0 || !req.getArrivalDate().isAfter(req.getDepartureDate()) || req.getDepartureDate().isBefore(LocalDateTime.now()))
            throw new com.cargoshare.exception.BadRequestException("Invalid capacity or schedule");
        Container container = Container.builder()
                .containerNumber(containerNumber)
                .provider(provider)
                .transportMode(req.getMode())
                .origin(req.getOrigin())
                .destination(req.getDestination())
                .vesselFlightTrain(req.getVesselFlightTrain() != null ? req.getVesselFlightTrain() : "Service " + req.getMode())
                .totalCapacity(req.getTotalCapacity())
                .occupiedCapacity(req.getTotalCapacity().subtract(avail))
                .availableCapacity(avail)
                .pricePerCbm(req.getPricePerCbm())
                .departureDate(req.getDepartureDate())
                .arrivalDate(req.getArrivalDate())
                .cutoffDate(req.getCutoffDate())
                .cargoRestrictions(req.getCargoRestrictions())
                .temperatureControlled(req.isTemperatureControlled())
                .status(req.getStatus() != null ? req.getStatus() : ContainerStatus.AVAILABLE)
                .matchScore(92)
                .build();

        container = containerRepository.save(container);
        var created = ContainerResponse.fromEntity(container);
        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(new org.springframework.transaction.support.TransactionSynchronization() {
            @Override public void afterCommit() { messagingTemplate.convertAndSend("/topic/containers/all", created); }
        });
        return created;
    }

    @Transactional
    public ContainerResponse updateContainer(Long providerUserId, Long containerId, ContainerRequest req) {
        Provider provider = providerRepository.findByUserId(providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        Container container = containerRepository.findByIdForUpdate(containerId)
                .orElseThrow(() -> new ResourceNotFoundException("Container not found with ID: " + containerId));

        if (!container.getProvider().getId().equals(provider.getId())) {
            throw new ForbiddenException("You do not have permission to update containers owned by other carriers.");
        }

        if (provider.getStatus() != ProviderStatus.APPROVED) throw new ForbiddenException("Provider must be approved");
        if (req.getPricePerCbm() != null && req.getPricePerCbm().signum() <= 0) throw new com.cargoshare.exception.BadRequestException("Price must be positive");
        if (req.getAvailableCapacity() != null && (req.getAvailableCapacity().signum() < 0 || req.getAvailableCapacity().compareTo(container.getTotalCapacity().subtract(bookingRepository.reservedSpace(containerId))) > 0))
            throw new com.cargoshare.exception.BadRequestException("Available capacity must be nonnegative and leave room for existing reservations");
        if (req.getAvailableCapacity() != null) {
            container.setAvailableCapacity(req.getAvailableCapacity());
            container.setOccupiedCapacity(container.getTotalCapacity().subtract(req.getAvailableCapacity()));
        }
        if (req.getPricePerCbm() != null) {
            container.setPricePerCbm(req.getPricePerCbm());
        }
        if (req.getStatus() != null) {
            container.setStatus(req.getStatus());
        }

        container = containerRepository.save(container);

        // Broadcast availability update over WebSocket
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

        return ContainerResponse.fromEntity(container);
    }
}
