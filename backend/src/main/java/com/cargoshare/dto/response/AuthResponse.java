package com.cargoshare.dto.response;

import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private ProviderStatus providerStatus;
}
