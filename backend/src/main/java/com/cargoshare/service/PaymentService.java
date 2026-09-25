package com.cargoshare.service;

import com.cargoshare.dto.request.PaymentOrderRequest;
import com.cargoshare.dto.response.BookingResponse;
import com.cargoshare.entity.*;
import com.cargoshare.entity.enums.*;
import com.cargoshare.exception.*;
import com.cargoshare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

/** Local simulation only: no external payment provider or money transfer. */
@Service @RequiredArgsConstructor
public class PaymentService {
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public Map<String, Object> createOrder(PaymentOrderRequest req) {
        Booking booking = bookingRepository.findByIdForUpdate(req.getBookingId())
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (booking.getBookingStatus() != BookingStatus.PENDING_PAYMENT)
            throw new BadRequestException("Only unpaid bookings can start demo checkout");
        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElseGet(() ->
            Payment.builder().booking(booking).amount(booking.getAmount()).build());
        if (payment.getRazorpayOrderId() == null || !payment.getRazorpayOrderId().startsWith("DEMO-"))
            payment.setRazorpayOrderId("DEMO-" + UUID.randomUUID());
        payment.setPaymentStatus(PaymentStatus.CREATED);
        paymentRepository.save(payment);
        return Map.of("orderId", payment.getRazorpayOrderId(), "amount", booking.getAmount(), "currency", "USD",
            "demo", true, "qrPayload", "CargoShare DEMO PAYMENT | No money transferred | Booking BKG-" + booking.getId()
            + " | USD " + booking.getAmount() + " | " + payment.getRazorpayOrderId());
    }

    @Transactional
    public BookingResponse completeDemo(Long bookingId, String orderId) {
        Booking booking = bookingRepository.findByIdForUpdate(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Payment payment = paymentRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new BadRequestException("Generate the demo QR code first"));
        if (orderId == null || !orderId.startsWith("DEMO-") || !orderId.equals(payment.getRazorpayOrderId()))
            throw new BadRequestException("Demo order does not belong to this booking");
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) return BookingResponse.fromEntity(booking, payment);
        if (booking.getBookingStatus() != BookingStatus.PENDING_PAYMENT)
            throw new BadRequestException("This booking cannot be paid");
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId("DEMO-PAY-" + UUID.randomUUID());
        payment.setTransactionId("DEMO-QR-NO-MONEY");
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        return BookingResponse.fromEntity(booking, payment);
    }
}
