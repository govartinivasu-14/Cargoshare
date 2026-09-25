package com.cargoshare.controller;

import com.cargoshare.dto.request.InspectProviderRequest;
import com.cargoshare.dto.response.*;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.repository.BookingRepository;
import com.cargoshare.repository.ContainerRepository;
import com.cargoshare.repository.PaymentRepository;
import com.cargoshare.security.UserPrincipal;
import com.cargoshare.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ContainerRepository containerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/providers")
    public ResponseEntity<List<ProviderResponse>> getProviders(
            @RequestParam(required = false) ProviderStatus status) {
        return ResponseEntity.ok(adminService.getProviders(status));
    }

    @PostMapping("/providers/{id}/inspect")
    public ResponseEntity<ProviderResponse> inspectProvider(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id,
            @Valid @RequestBody InspectProviderRequest req) {

        Long providerId = parseProviderId(id);
        return ResponseEntity.ok(adminService.inspectProvider(providerId, principal.getId(), req));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/containers")
    public ResponseEntity<List<ContainerResponse>> getAllContainers() {
        List<ContainerResponse> list = containerRepository.findAll().stream()
                .map(ContainerResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> list = bookingRepository.findAll().stream()
                .map(b -> {
                    var p = paymentRepository.findByBookingId(b.getId()).orElse(null);
                    return BookingResponse.fromEntity(b, p);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> list = paymentRepository.findAll().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private Long parseProviderId(String id) {
        if (id.startsWith("usr-p")) {
            return Long.parseLong(id.substring(5));
        }
        return Long.parseLong(id);
    }
}
