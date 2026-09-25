package com.cargoshare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Stats stats;
    private ProviderApplicationsSummary providerApplications;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stats {
        private long totalTraders;
        private long totalProviders;
        private long totalContainers;
        private long totalBookings;
        private BigDecimal totalPaymentsAmount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProviderApplicationsSummary {
        private long pending;
        private long approved;
        private long rejected;
    }
}
