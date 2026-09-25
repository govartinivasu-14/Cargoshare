package com.cargoshare.service;

import com.cargoshare.dto.request.ChatMessagePayload;
import com.cargoshare.dto.response.ChatMessageResponse;
import com.cargoshare.entity.Message;
import com.cargoshare.entity.User;
import com.cargoshare.exception.ResourceNotFoundException;
import com.cargoshare.repository.MessageRepository;
import com.cargoshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final com.cargoshare.repository.BookingRepository bookings;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Rule 8: Scoped by the authenticated user's ID.
     */
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getHistory(Long authUserId, Long withUserId, Long bookingId) {
        List<Message> messages;
        if (bookingId != null) {
            messages = messageRepository.findByBookingIdAndUser(bookingId, authUserId);
        } else if (withUserId != null) {
            messages = messageRepository.findChatHistoryBetweenUsers(authUserId, withUserId);
        } else {
            messages = List.of();
        }

        return messages.stream()
                .map(ChatMessageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Section 6b: Real-time chat dispatch over STOMP
     */
    @Transactional
    public ChatMessageResponse sendMessage(Long senderUserId, ChatMessagePayload payload) {
        final Long receiverId = payload.getResolvedReceiverId() != null
                ? payload.getResolvedReceiverId()
                : payload.getReceiverId();

        if (receiverId == null) throw new com.cargoshare.exception.BadRequestException("Recipient is required");
        if (payload.getBookingId() != null) {
            var b=bookings.findById(payload.getBookingId()).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            var trader=b.getTrader().getId(); var provider=b.getContainer().getProvider().getUser().getId();
            if (!(senderUserId.equals(trader) && receiverId.equals(provider) || senderUserId.equals(provider) && receiverId.equals(trader)))
                throw new com.cargoshare.exception.ForbiddenException("Conversation does not belong to this booking");
        }
        User sender = userRepository.findById(senderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender user not found with ID: " + senderUserId));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver user not found with ID: " + receiverId));

        final String text = payload.getResolvedMessage() != null && !payload.getResolvedMessage().isBlank()
                ? payload.getResolvedMessage()
                : payload.getMessage();

        if (text == null || text.isBlank() || text.length() > 4000) throw new com.cargoshare.exception.BadRequestException("Message must contain 1–4000 characters");
        if (sender.getRole() == receiver.getRole() || sender.getRole() == com.cargoshare.entity.enums.Role.ADMIN || receiver.getRole() == com.cargoshare.entity.enums.Role.ADMIN)
            throw new com.cargoshare.exception.BadRequestException("Chat connects traders and providers");
        Message msg = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .bookingId(payload.getBookingId())
                .containerId(payload.getContainerId())
                .message(text)
                .sentAt(LocalDateTime.now())
                .build();

        msg = messageRepository.save(msg);

        ChatMessageResponse response = ChatMessageResponse.fromEntity(msg);

        // Publish to deterministic per-pair channel /topic/chat/{lowerId}_{higherId}
        Long lower = Math.min(sender.getId(), receiver.getId());
        Long higher = Math.max(sender.getId(), receiver.getId());
        String channel = "/topic/chat/" + lower + "_" + higher;
        String userAUserBChannel = "/topic/chat/usr-" + lower + "_usr-" + higher;
        String reversedChannel = "/topic/chat/" + higher + "_" + lower;

        log.info("[Chat STOMP] Broadcasting chat message to STOMP topic: '{}' (also '{}')", channel, userAUserBChannel);

        org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(new org.springframework.transaction.support.TransactionSynchronization() {
            @Override public void afterCommit() { messagingTemplate.convertAndSend(channel, response); }
        });

        return response;
    }
}
