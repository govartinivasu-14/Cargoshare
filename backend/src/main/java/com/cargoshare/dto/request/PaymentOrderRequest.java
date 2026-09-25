package com.cargoshare.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentOrderRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
}
