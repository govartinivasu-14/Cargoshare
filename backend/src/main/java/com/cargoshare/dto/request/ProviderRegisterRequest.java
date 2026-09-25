package com.cargoshare.dto.request;

import com.cargoshare.entity.enums.TransportMode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProviderRegisterRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Contact person is required")
    private String contactPerson;

    @NotBlank(message = "Corporate email is required")
    @Email(message = "Valid corporate email required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Service type is required")
    private TransportMode serviceType;

    @NotBlank(message = "Operating locations are required")
    private String operatingLocations;

    @NotBlank(message = "Routes are required")
    private String routes;

    private String companyDetails;
    private String supportingInfo;
}
