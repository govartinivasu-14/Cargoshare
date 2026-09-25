package com.cargoshare.service;

import com.cargoshare.dto.request.InspectProviderRequest;
import com.cargoshare.dto.response.AdminDashboardResponse;
import com.cargoshare.dto.response.ProviderResponse;
import com.cargoshare.entity.Provider;
import com.cargoshare.entity.User;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.Role;
import com.cargoshare.exception.ResourceNotFoundException;
import com.cargoshare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final ContainerRepository containerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        long totalTraders = userRepository.countByRole(Role.TRADER);
        long totalProviders = userRepository.countByRole(Role.PROVIDER);
        long totalContainers = containerRepository.count();
        long totalBookings = bookingRepository.count();
        BigDecimal totalPaymentsAmount = paymentRepository.sumTotalSuccessfulPayments();

        long pending = providerRepository.countByStatus(ProviderStatus.PENDING);
        long approved = providerRepository.countByStatus(ProviderStatus.APPROVED);
        long rejected = providerRepository.countByStatus(ProviderStatus.REJECTED);

        return AdminDashboardResponse.builder()
                .stats(AdminDashboardResponse.Stats.builder()
                        .totalTraders(totalTraders)
                        .totalProviders(totalProviders)
                        .totalContainers(totalContainers)
                        .totalBookings(totalBookings)
                        .totalPaymentsAmount(totalPaymentsAmount != null ? totalPaymentsAmount : BigDecimal.ZERO)
                        .build())
                .providerApplications(AdminDashboardResponse.ProviderApplicationsSummary.builder()
                        .pending(pending)
                        .approved(approved)
                        .rejected(rejected)
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ProviderResponse> getProviders(ProviderStatus status) {
        List<Provider> providers = status != null
                ? providerRepository.findByStatus(status)
                : providerRepository.findAll();

        return providers.stream()
                .map(ProviderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Rule 9: Only ADMIN can approve/reject providers.
     */
    @Transactional
    public ProviderResponse inspectProvider(Long providerId, Long adminId, InspectProviderRequest req) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider application not found with ID: " + providerId));

        if (Boolean.TRUE.equals(req.getApprove()) && (!req.isInspectionCompleted() || !req.isDataQualityVerified())) {
            throw new com.cargoshare.exception.BadRequestException("Approval requires a completed inspection and verified data quality");
        }
        provider.setInspectionCompleted(req.isInspectionCompleted());
        provider.setDataQualityVerified(req.isDataQualityVerified());
        provider.setStatus(Boolean.TRUE.equals(req.getApprove()) ? ProviderStatus.APPROVED : ProviderStatus.REJECTED);
        provider.setInspectionNotes(req.getNotes());
        provider.setInspectedByAdminId(adminId);
        provider.setInspectedAt(LocalDateTime.now());

        provider = providerRepository.save(provider);
        return ProviderResponse.fromEntity(provider);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
