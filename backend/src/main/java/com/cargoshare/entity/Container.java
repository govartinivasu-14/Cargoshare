package com.cargoshare.entity;

import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.entity.enums.TransportMode;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "containers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Container {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "container_number", nullable = false, unique = true)
    private String containerNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @Enumerated(EnumType.STRING)
    @Column(name = "transport_mode", nullable = false)
    private TransportMode transportMode;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(name = "vessel_flight_train")
    private String vesselFlightTrain;

    @Column(name = "total_capacity", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCapacity;

    @Column(name = "occupied_capacity", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal occupiedCapacity = BigDecimal.ZERO;

    @Column(name = "available_capacity", nullable = false, precision = 10, scale = 2)
    private BigDecimal availableCapacity;

    @Column(name = "price_per_cbm", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerCbm;

    @Column(name = "departure_date", nullable = false)
    private LocalDateTime departureDate;

    @Column(name = "arrival_date", nullable = false)
    private LocalDateTime arrivalDate;

    @Column(name = "cutoff_date")
    private LocalDateTime cutoffDate;

    @Column(name = "cargo_restrictions", columnDefinition = "TEXT")
    private String cargoRestrictions;

    @Column(name = "temperature_controlled")
    @Builder.Default
    private boolean temperatureControlled = false;

    @Column(name = "match_score")
    @Builder.Default
    private Integer matchScore = 85;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ContainerStatus status = ContainerStatus.AVAILABLE;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (availableCapacity == null) {
            availableCapacity = totalCapacity;
        }
        if (occupiedCapacity == null) {
            occupiedCapacity = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
