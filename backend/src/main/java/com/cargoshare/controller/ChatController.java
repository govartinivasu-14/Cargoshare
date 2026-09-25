package com.cargoshare.controller;

import com.cargoshare.dto.request.ChatMessagePayload;
import com.cargoshare.dto.response.ChatMessageResponse;
import com.cargoshare.entity.Provider;
import com.cargoshare.repository.ProviderRepository;
import com.cargoshare.security.UserPrincipal;
import com.cargoshare.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final ProviderRepository providerRepository;

    @GetMapping("/api/chat/history")
    public ResponseEntity<List<ChatMessageResponse>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String withUserId,
            @RequestParam(required = false) String bookingId) {

        Long withUser = parseUserId(withUserId);
        Long bkgId = parseBookingId(bookingId);
        Long authUserId = principal != null ? principal.getId() : 1L;

        log.info("[Chat REST] GET history authUserId={}, withUser={}, bookingId={}", authUserId, withUser, bkgId);
        return ResponseEntity.ok(chatService.getHistory(authUserId, withUser, bkgId));
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/chat/messages")
    public ResponseEntity<ChatMessageResponse> send(@AuthenticationPrincipal UserPrincipal principal,
            @org.springframework.web.bind.annotation.RequestBody ChatMessagePayload payload) {
        return ResponseEntity.ok(chatService.sendMessage(principal.getId(), payload));
    }

    private Long parseUserId(String str) {
        if (str == null || str.isBlank()) return null;
        if (str.startsWith("usr-")) {
            str = str.substring(4);
            if (str.startsWith("p") || str.startsWith("t") || str.startsWith("a")) {
                str = str.substring(1);
            }
        }
        try {
            return Long.parseLong(str);
        } catch (NumberFormatException e) {
            throw new com.cargoshare.exception.BadRequestException("Invalid user ID");
        }
    }

    private Long parseBookingId(String str) {
        if (str == null || str.isBlank()) return null;
        if (str.startsWith("BKG-")) {
            str = str.substring(4);
        }
        try {
            return Long.parseLong(str);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
