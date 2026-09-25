package com.cargoshare.controller;

import com.cargoshare.dto.request.PaymentOrderRequest;
import com.cargoshare.dto.request.PaymentVerifyRequest;
import com.cargoshare.dto.response.BookingResponse;
import com.cargoshare.dto.response.PaymentOrderResponse;
import com.cargoshare.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final com.cargoshare.service.BookingAccess access;

    @PostMapping("/create-order")
    public ResponseEntity<java.util.Map<String, Object>> createOrder(@Valid @RequestBody PaymentOrderRequest req, @org.springframework.security.core.annotation.AuthenticationPrincipal com.cargoshare.security.UserPrincipal principal) {
        access.check(req.getBookingId(), principal, true);
        return ResponseEntity.ok(paymentService.createOrder(req));
    }

    public record DemoPaymentRequest(@jakarta.validation.constraints.NotNull Long bookingId,
                                    @jakarta.validation.constraints.NotBlank String orderId) {}

    @PostMapping("/demo-complete")
    public ResponseEntity<BookingResponse> completeDemo(@Valid @RequestBody DemoPaymentRequest req,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.cargoshare.security.UserPrincipal principal) {
        access.check(req.bookingId(), principal, true);
        return ResponseEntity.ok(paymentService.completeDemo(req.bookingId(), req.orderId()));
    }
}
