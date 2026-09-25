package com.cargoshare.dto.response;

import com.cargoshare.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String id;
    private String threadId;
    private String bookingId;
    private String containerId;
    private String senderId;
    private String senderName;
    private String recipientId;
    private String content;
    private LocalDateTime timestamp;
    @Builder.Default
    private boolean isRead = true;

    public static ChatMessageResponse fromEntity(Message m) {
        Long lower = Math.min(m.getSender().getId(), m.getReceiver().getId());
        Long higher = Math.max(m.getSender().getId(), m.getReceiver().getId());
        String thread = lower + "_" + higher;

        return ChatMessageResponse.builder()
                .id("msg-" + m.getId())
                .threadId(thread)
                .bookingId(m.getBookingId() != null ? "BKG-" + m.getBookingId() : null)
                .containerId(m.getContainerId() != null ? "CNT-" + m.getContainerId() : null)
                .senderId("usr-" + m.getSender().getId())
                .senderName(m.getSender().getName())
                .recipientId("usr-" + m.getReceiver().getId())
                .content(m.getMessage())
                .timestamp(m.getSentAt())
                .isRead(true)
                .build();
    }
}
