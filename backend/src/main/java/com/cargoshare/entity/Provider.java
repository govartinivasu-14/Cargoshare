package com.cargoshare.entity;

import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.TransportMode;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "contact_person", nullable = false)
    private String contactPerson;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private TransportMode serviceType;

    @Column(name = "operating_locations", columnDefinition = "TEXT")
    private String operatingLocations;

    @Column(columnDefinition = "TEXT")
    private String routes;

    @Column(name = "company_details", columnDefinition = "TEXT")
    private String companyDetails;

    @Column(name = "supporting_info", columnDefinition = "TEXT")
    private String supportingInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProviderStatus status = ProviderStatus.PENDING;

    @Column(name = "inspection_notes", columnDefinition = "TEXT")
    private String inspectionNotes;
    private boolean inspectionCompleted;
    private boolean dataQualityVerified;

    @Column(name = "inspected_by_admin_id")
    private Long inspectedByAdminId;

    @Column(name = "inspected_at")
    private LocalDateTime inspectedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
