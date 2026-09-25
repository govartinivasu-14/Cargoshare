package com.cargoshare.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InspectProviderRequest {
    @NotNull(message = "Approval decision is required")
    private Boolean approve;

    @jakarta.validation.constraints.NotBlank
    private String notes;
    private boolean inspectionCompleted;
    private boolean dataQualityVerified;
}
