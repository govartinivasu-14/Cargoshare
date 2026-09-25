package com.cargoshare.service;

import com.cargoshare.dto.request.LoginRequest;
import com.cargoshare.dto.request.ProviderRegisterRequest;
import com.cargoshare.dto.request.TraderRegisterRequest;
import com.cargoshare.dto.response.AuthResponse;
import com.cargoshare.entity.Provider;
import com.cargoshare.entity.User;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.Role;
import com.cargoshare.exception.BadRequestException;
import com.cargoshare.repository.ProviderRepository;
import com.cargoshare.repository.UserRepository;
import com.cargoshare.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registerTrader(TraderRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("An account with email " + req.getEmail() + " already exists.");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.TRADER)
                .traderType(req.getTraderType())
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .providerStatus(null)
                .build();
    }

    @Transactional
    public AuthResponse registerProvider(ProviderRegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("An account with email " + req.getEmail() + " already exists.");
        }

        User user = User.builder()
                .name(req.getContactPerson())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.PROVIDER)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        Provider provider = Provider.builder()
                .user(user)
                .companyName(req.getCompanyName())
                .contactPerson(req.getContactPerson())
                .serviceType(req.getServiceType())
                .operatingLocations(req.getOperatingLocations())
                .routes(req.getRoutes())
                .companyDetails(req.getCompanyDetails())
                .supportingInfo(req.getSupportingInfo())
                .status(ProviderStatus.PENDING) // Locked until admin review
                .build();

        providerRepository.save(provider);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .providerStatus(ProviderStatus.PENDING)
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        ProviderStatus providerStatus = null;
        if (user.getRole() == Role.PROVIDER) {
            Optional<Provider> p = providerRepository.findByUserId(user.getId());
            if (p.isPresent()) {
                providerStatus = p.get().getStatus();
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .providerStatus(providerStatus)
                .build();
    }
}
