package com.cargoshare.controller;

import com.cargoshare.dto.request.LoginRequest;
import com.cargoshare.dto.request.ProviderRegisterRequest;
import com.cargoshare.dto.request.TraderRegisterRequest;
import com.cargoshare.dto.response.AuthResponse;
import com.cargoshare.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/trader")
    public ResponseEntity<AuthResponse> registerTrader(@Valid @RequestBody TraderRegisterRequest req) {
        return ResponseEntity.ok(authService.registerTrader(req));
    }

    @PostMapping("/register/provider")
    public ResponseEntity<AuthResponse> registerProvider(@Valid @RequestBody ProviderRegisterRequest req) {
        return ResponseEntity.ok(authService.registerProvider(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
