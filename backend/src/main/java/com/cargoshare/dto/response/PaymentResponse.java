package com.cargoshare.dto.response;

import com.cargoshare.entity.Payment;
import com.cargoshare.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String id;
    private String bookingId;
    private String traderId;
    private String traderName;
    private String providerId;
    private BigDecimal amount;
    @Builder.Default
    private String currency = "USD";
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private PaymentStatus status;
    private String method;
    private LocalDateTime createdAt;
    private String notes;

    public static PaymentResponse fromEntity(Payment p) {
        return PaymentResponse.builder()
                .id("pay-" + p.getId())
                .bookingId("BKG-" + (p.getBooking() != null ? p.getBooking().getId() : ""))
                .traderId("usr-t" + (p.getBooking() != null && p.getBooking().getTrader() != null ? p.getBooking().getTrader().getId() : ""))
                .traderName(p.getBooking() != null && p.getBooking().getTrader() != null ? p.getBooking().getTrader().getName() : "")
                .providerId("usr-p" + (p.getBooking() != null && p.getBooking().getContainer() != null && p.getBooking().getContainer().getProvider() != null ? p.getBooking().getContainer().getProvider().getId() : ""))
                .amount(p.getAmount())
                .currency("USD")
                .razorpayOrderId(p.getRazorpayOrderId())
                .razorpayPaymentId(p.getRazorpayPaymentId())
                .status(p.getPaymentStatus())
                .method(p.getTransactionId() != null ? p.getTransactionId() : "Demo QR payment")
                .createdAt(p.getCreatedAt())
                .notes("Simulated payment — no money transferred")
                .build();
    }
}
