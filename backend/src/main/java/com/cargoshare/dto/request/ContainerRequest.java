package com.cargoshare.dto.request;

import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.entity.enums.TransportMode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ContainerRequest {
    private String containerNumber;

    @NotNull(message = "Transport mode is required")
    private TransportMode mode;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    private String vesselFlightTrain;

    @NotNull(message = "Total capacity is required")
    @DecimalMin(value = "0.1", message = "Total capacity must be greater than 0")
    private BigDecimal totalCapacity;

    private BigDecimal availableCapacity;

    @NotNull(message = "Price per CBM is required")
    @DecimalMin(value = "1.0", message = "Price per CBM must be at least 1.0")
    private BigDecimal pricePerCbm;

    @NotNull(message = "Departure date is required")
    private LocalDateTime departureDate;

    @NotNull(message = "Arrival date is required")
    private LocalDateTime arrivalDate;

    private LocalDateTime cutoffDate;
    private String cargoRestrictions;
    private boolean temperatureControlled;
    private ContainerStatus status;
}
