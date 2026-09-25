package com.cargoshare.dto.request;

import com.cargoshare.entity.enums.TraderType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TraderRegisterRequest {
    @NotBlank(message = "Trader name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email required")
    private String email;

    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private TraderType traderType;
}
