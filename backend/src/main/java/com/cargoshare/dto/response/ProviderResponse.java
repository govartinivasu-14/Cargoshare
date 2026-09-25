package com.cargoshare.dto.response;

import com.cargoshare.entity.Provider;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.TransportMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderResponse {
    private String id;
    private Long userId;
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private TransportMode serviceType;
    private String operatingLocations;
    private String routes;
    private String companyDetails;
    private String supportingInfo;
    private ProviderStatus providerStatus;
    private String adminNotes;
    private boolean inspectionCompleted;
    private boolean dataQualityVerified;
    private Long inspectedByAdminId;
    private LocalDateTime inspectedAt;
    private LocalDateTime registeredAt;

    public static ProviderResponse fromEntity(Provider p) {
        return ProviderResponse.builder()
                .id("usr-p" + p.getId())
                .userId(p.getUser().getId())
                .companyName(p.getCompanyName())
                .contactPerson(p.getContactPerson())
                .email(p.getUser().getEmail())
                .phone(p.getUser().getPhone())
                .serviceType(p.getServiceType())
                .operatingLocations(p.getOperatingLocations())
                .routes(p.getRoutes())
                .companyDetails(p.getCompanyDetails())
                .supportingInfo(p.getSupportingInfo())
                .providerStatus(p.getStatus())
                .adminNotes(p.getInspectionNotes())
                .inspectionCompleted(p.isInspectionCompleted())
                .dataQualityVerified(p.isDataQualityVerified())
                .inspectedByAdminId(p.getInspectedByAdminId())
                .inspectedAt(p.getInspectedAt())
                .registeredAt(p.getCreatedAt())
                .build();
    }
}
