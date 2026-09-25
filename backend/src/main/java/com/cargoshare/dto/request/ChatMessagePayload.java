package com.cargoshare.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatMessagePayload {

    private Long receiverId;

    @JsonAlias({"recipientId", "toUserId", "partnerId"})
    private String recipientId;

    @JsonAlias({"content", "text"})
    private String message;

    private String content;

    private Long senderId;

    @JsonAlias({"senderId"})
    private String senderIdStr;

    private Object bookingId;
    private Object containerId;

    public Long getBookingId() {
        if (bookingId == null) return null;
        if (bookingId instanceof Number n) return n.longValue();
        return parseIdHelper(bookingId.toString());
    }

    public Long getContainerId() {
        if (containerId == null) return null;
        if (containerId instanceof Number n) return n.longValue();
        return parseIdHelper(containerId.toString());
    }

    public Long getResolvedReceiverId() {
        if (receiverId != null) return receiverId;
        if (recipientId != null && !recipientId.isBlank()) {
            return parseIdHelper(recipientId);
        }
        return null;
    }

    public String getResolvedMessage() {
        if (message != null && !message.isBlank()) return message;
        if (content != null && !content.isBlank()) return content;
        return "";
    }

    public Long getResolvedSenderId() {
        if (senderId != null) return senderId;
        if (senderIdStr != null && !senderIdStr.isBlank()) {
            return parseIdHelper(senderIdStr);
        }
        return null;
    }

    private Long parseIdHelper(String str) {
        if (str == null || str.isBlank()) return null;
        String digits = str.replaceAll("\\D+", "");
        if (digits.isEmpty()) return null;
        try {
            return Long.parseLong(digits);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
