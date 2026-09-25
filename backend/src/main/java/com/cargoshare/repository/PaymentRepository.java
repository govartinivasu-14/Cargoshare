package com.cargoshare.repository;

import com.cargoshare.entity.Payment;
import com.cargoshare.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    List<Payment> findByPaymentStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = com.cargoshare.entity.enums.PaymentStatus.SUCCESS")
    BigDecimal sumTotalSuccessfulPayments();
}
