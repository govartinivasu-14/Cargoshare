package com.cargoshare.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookingRequest {
    @NotNull(message = "Container ID is required")
    private Long containerId;

    @NotNull(message = "Space required is mandatory")
    @DecimalMin(value = "0.1", message = "Requested space must be at least 0.1 CBM")
    @jakarta.validation.constraints.Digits(integer=6, fraction=2)
    private BigDecimal spaceRequired;

    private String cargoDescription;
    @jakarta.validation.constraints.DecimalMin("0.01")
    private BigDecimal weightKg;
}
