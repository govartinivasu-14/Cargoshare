package com.cargoshare.controller;

import com.cargoshare.dto.response.BookingResponse;
import com.cargoshare.dto.response.ContainerResponse;
import com.cargoshare.entity.Container;
import com.cargoshare.entity.Provider;
import com.cargoshare.repository.ContainerRepository;
import com.cargoshare.repository.ProviderRepository;
import com.cargoshare.security.UserPrincipal;
import com.cargoshare.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('PROVIDER')")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderRepository providerRepository;
    private final ContainerRepository containerRepository;
    private final BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getProviderDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        Provider provider = providerRepository.findByUserId(principal.getId()).orElse(null);

        List<Container> containers = provider != null
                ? containerRepository.findByProviderId(provider.getId())
                : List.of();

        List<BookingResponse> bookings = bookingService.getProviderBookings(principal.getId());

        long totalContainers = containers.size();
        BigDecimal totalAvailableSpace = containers.stream()
                .map(Container::getAvailableCapacity)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeBookings = bookings.stream()
                .filter(b -> List.of("CONFIRMED", "IN_TRANSIT").contains(b.getStatus().name()))
                .count();

        long pendingRequests = bookings.stream()
                .filter(b -> "PENDING_PAYMENT".equals(b.getStatus().name()))
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("totalContainers", totalContainers);
        result.put("totalAvailableSpace", totalAvailableSpace);
        result.put("activeBookings", activeBookings);
        result.put("pendingRequests", pendingRequests);
        result.put("containers", containers.stream().map(ContainerResponse::fromEntity).collect(Collectors.toList()));
        result.put("providerStatus", provider != null ? provider.getStatus() : null);

        return ResponseEntity.ok(result);
    }
}
