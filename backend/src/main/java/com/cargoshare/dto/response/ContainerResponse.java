package com.cargoshare.dto.response;

import com.cargoshare.entity.Container;
import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.TransportMode;
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
public class ContainerResponse {
    private String id; // CNT-xxx string or numeric
    private String containerNumber;
    private String providerId;
    private String providerName;
    private ProviderStatus providerStatus;
    private TransportMode mode;
    private String origin;
    private String destination;
    private String vesselFlightTrain;
    private BigDecimal totalCapacity;
    private BigDecimal availableCapacity;
    private BigDecimal bookedCapacity;
    private BigDecimal pricePerCbm;
    @Builder.Default
    private String currency = "USD";
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;
    private LocalDateTime cutoffDate;
    private String cargoRestrictions;
    private boolean temperatureControlled;
    private ContainerStatus status;
    private Integer matchScore;

    public static ContainerResponse fromEntity(Container c) {
        return ContainerResponse.builder()
                .id("CNT-" + c.getId())
                .containerNumber(c.getContainerNumber())
                .providerId("usr-p" + (c.getProvider() != null ? c.getProvider().getUser().getId() : ""))
                .providerName(c.getProvider() != null ? c.getProvider().getCompanyName() : "Carrier")
                .providerStatus(c.getProvider() != null ? c.getProvider().getStatus() : ProviderStatus.APPROVED)
                .mode(c.getTransportMode())
                .origin(c.getOrigin())
                .destination(c.getDestination())
                .vesselFlightTrain(c.getVesselFlightTrain() != null ? c.getVesselFlightTrain() : "Carrier Scheduled Line")
                .totalCapacity(c.getTotalCapacity())
                .availableCapacity(c.getAvailableCapacity())
                .bookedCapacity(c.getOccupiedCapacity())
                .pricePerCbm(c.getPricePerCbm())
                .currency("USD")
                .departureDate(c.getDepartureDate())
                .arrivalDate(c.getArrivalDate())
                .cutoffDate(c.getCutoffDate())
                .cargoRestrictions(c.getCargoRestrictions())
                .temperatureControlled(c.isTemperatureControlled())
                .status(c.getStatus())
                .matchScore(c.getMatchScore() != null ? c.getMatchScore() : 88)
                .build();
    }
}
