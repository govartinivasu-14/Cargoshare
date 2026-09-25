package com.cargoshare.controller;

import com.cargoshare.dto.request.BookingRequest;
import com.cargoshare.dto.response.BookingResponse;
import com.cargoshare.security.UserPrincipal;
import com.cargoshare.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final com.cargoshare.service.BookingAccess access;

    @PostMapping
    @PreAuthorize("hasRole('TRADER')")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest req) {

        return ResponseEntity.ok(bookingService.createBooking(principal.getId(), req));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TRADER')")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getMyBookings(principal.getId()));
    }

    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getProviderBookings(principal.getId()));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable String id, @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody java.util.Map<String, com.cargoshare.entity.enums.BookingStatus> body) {
        return ResponseEntity.ok(bookingService.updateShipment(parseBookingId(id), principal.getId(), body.get("status")));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable String id, @AuthenticationPrincipal UserPrincipal principal) {
        Long numericId = parseBookingId(id); access.check(numericId, principal, true);
        return ResponseEntity.ok(bookingService.cancel(numericId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String id, @AuthenticationPrincipal UserPrincipal principal) {
        Long numericId = parseBookingId(id);
        access.check(numericId, principal, false);
        return ResponseEntity.ok(bookingService.getBookingById(numericId));
    }

    private Long parseBookingId(String id) {
        if (id.startsWith("BKG-")) {
            return Long.parseLong(id.substring(4));
        }
        return Long.parseLong(id);
    }
}
