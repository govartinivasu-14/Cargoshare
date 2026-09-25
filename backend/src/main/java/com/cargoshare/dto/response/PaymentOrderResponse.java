package com.cargoshare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {
    private String razorpayOrderId;
    private String razorpayKeyId;
    private BigDecimal amount;
    @Builder.Default
    private String currency = "USD";
}
