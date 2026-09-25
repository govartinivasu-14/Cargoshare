package com.cargoshare.controller;

import com.cargoshare.dto.response.BookingResponse;
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

@RestController
@RequestMapping("/api/trader")
@PreAuthorize("hasRole('TRADER')")
@RequiredArgsConstructor
public class TraderController {

    private final BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getTraderDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        List<BookingResponse> bookings = bookingService.getMyBookings(principal.getId());

        long totalBookings = bookings.size();
        long activeBookings = bookings.stream()
                .filter(b -> List.of("CONFIRMED", "IN_TRANSIT", "PENDING_PAYMENT").contains(b.getStatus().name()))
                .count();
        long delivered = bookings.stream()
                .filter(b -> "DELIVERED".equals(b.getStatus().name()))
                .count();
        BigDecimal totalCbm = bookings.stream()
                .map(BookingResponse::getSpaceRequired)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new HashMap<>();
        result.put("totalBookings", totalBookings);
        result.put("activeBookings", activeBookings);
        result.put("completedBookings", delivered);
        result.put("totalCbmBooked", totalCbm);
        result.put("recentBookings", bookings.stream().limit(5).toList());

        return ResponseEntity.ok(result);
    }
}
