package com.cargoshare.dto.response;

import com.cargoshare.entity.Booking;
import com.cargoshare.entity.Container;
import com.cargoshare.entity.Payment;
import com.cargoshare.entity.enums.BookingStatus;
import com.cargoshare.entity.enums.PaymentStatus;
import com.cargoshare.entity.enums.TransportMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id; // BKG-xxx
    private String containerId;
    private String containerNumber;
    private String traderId;
    private String traderName;
    private String traderEmail;
    private String traderPhone;
    private String providerId;
    private String providerName;
        private String providerContactName;
    private TransportMode mode;
    private String origin;
    private String destination;
    private BigDecimal spaceRequired;
    private BigDecimal pricePerCbm;
    private BigDecimal totalAmount;
    @Builder.Default
    private String currency = "USD";
    private String cargoDescription;
    private BigDecimal weightKg;
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private LocalDateTime createdAt;
    private String trackingNumber;
    @Builder.Default
    private List<TimelineItem> timeline = new ArrayList<>();

    public static BookingResponse fromEntity(Booking b, Payment p) {
        Container c = b.getContainer();
        List<TimelineItem> timelineItems = new ArrayList<>();

        int currentStep = switch (b.getBookingStatus()) {
            case PENDING_PAYMENT -> 0;
            case PAYMENT_SUCCESSFUL -> 1;
            case CONFIRMED -> 2;
            case IN_TRANSIT -> 3;
            case DELIVERED -> 4;
            case CANCELLED -> -1;
        };

        timelineItems.add(TimelineItem.builder()
                .step("PENDING_PAYMENT")
                .title("Booking Initiated")
                .timestamp(b.getCreatedAt())
                .completed(currentStep >= 0)
                .build());

        timelineItems.add(TimelineItem.builder()
                .step("PAYMENT_SUCCESSFUL")
                .title("Demo Payment Successful")
                .timestamp(p != null && p.getPaymentDate() != null ? p.getPaymentDate() : null)
                .completed(currentStep >= 1)
                .build());

        timelineItems.add(TimelineItem.builder()
                .step("CONFIRMED")
                .title("Space Confirmed by Carrier")
                .timestamp(currentStep >= 2 ? b.getUpdatedAt() : null)
                .completed(currentStep >= 2)
                .build());

        timelineItems.add(TimelineItem.builder()
                .step("IN_TRANSIT")
                .title("Voyage Departed in Transit")
                .timestamp(currentStep >= 3 ? b.getUpdatedAt() : null)
                .completed(currentStep >= 3)
                .build());

        timelineItems.add(TimelineItem.builder()
                .step("DELIVERED")
                .title("Customs Handover Completed")
                .timestamp(currentStep >= 4 ? b.getUpdatedAt() : null)
                .completed(currentStep >= 4)
                .build());

        return BookingResponse.builder()
                .id("BKG-" + b.getId())
                .containerId("CNT-" + (c != null ? c.getId() : ""))
                .containerNumber(c != null ? c.getContainerNumber() : "")
                .traderId("usr-t" + (b.getTrader() != null ? b.getTrader().getId() : ""))
                .traderName(b.getTrader() != null ? b.getTrader().getName() : "")
                .traderEmail(b.getTrader() != null ? b.getTrader().getEmail() : "")
                .traderPhone(b.getTrader() != null ? b.getTrader().getPhone() : "")
                .providerId("usr-p" + (c != null && c.getProvider() != null ? c.getProvider().getUser().getId() : ""))
                .providerName(c != null && c.getProvider() != null ? c.getProvider().getCompanyName() : "")
                .providerContactName(c != null && c.getProvider() != null
                        ? c.getProvider().getUser() != null
                                ? c.getProvider().getUser().getName()
                                : c.getProvider().getContactPerson()
                        : "")
                .mode(c != null ? c.getTransportMode() : TransportMode.SEA)
                .origin(c != null ? c.getOrigin() : "")
                .destination(c != null ? c.getDestination() : "")
                .spaceRequired(b.getSpaceBooked())
                .pricePerCbm(c != null ? c.getPricePerCbm() : BigDecimal.ZERO)
                .totalAmount(b.getAmount())
                .currency("USD")
                .cargoDescription(b.getCargoDescription())
                .weightKg(b.getWeightKg())
                .departureDate(c != null ? c.getDepartureDate() : null)
                .arrivalDate(c != null ? c.getArrivalDate() : null)
                .status(b.getBookingStatus())
                .paymentStatus(p != null ? p.getPaymentStatus() : PaymentStatus.CREATED)
                .razorpayOrderId(p != null ? p.getRazorpayOrderId() : null)
                .razorpayPaymentId(p != null ? p.getRazorpayPaymentId() : null)
                .createdAt(b.getCreatedAt())
                .trackingNumber("CS-TRK-" + b.getId() + "-" + (c != null ? c.getId() : "0"))
                .timeline(timelineItems)
                .build();
    }
}
