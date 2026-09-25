package com.cargoshare.config;

import com.cargoshare.entity.*;
import com.cargoshare.entity.enums.*;
import com.cargoshare.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name="app.seed-demo", havingValue="true", matchIfMissing=true)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final ContainerRepository containerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        log.info("[CargoShare] Seeding initial database records...");

        // 1. Admin
        User admin = User.builder()
                .name("Port Commander")
                .email("admin@cargoshare.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // 2. Trader
        User trader = User.builder()
                .name("Elena Rostova")
                .email("trader@cargoshare.com")
                .phone("+49 170 8291039")
                .password(passwordEncoder.encode("password123"))
                .role(Role.TRADER)
                .traderType(TraderType.EXPORTER)
                .enabled(true)
                .build();
        trader = userRepository.save(trader);

        // 3. Approved Provider
        User providerUser = User.builder()
                .name("Marcus Vance")
                .email("provider@cargoshare.com")
                .phone("+31 10 492 8812")
                .password(passwordEncoder.encode("password123"))
                .role(Role.PROVIDER)
                .enabled(true)
                .build();
        providerUser = userRepository.save(providerUser);

        Provider approvedProvider = Provider.builder()
                .user(providerUser)
                .companyName("Apex Oceanic Freight Co.")
                .contactPerson("Marcus Vance")
                .serviceType(TransportMode.SEA)
                .operatingLocations("Rotterdam, Antwerp, Hamburg, Dubai, Singapore")
                .routes("North Europe — Middle East, Trans-Pacific")
                .companyDetails("Licensed NVOCC & vessel space consolidation specialist since 2012.")
                .supportingInfo("IMO registration #94812, FMC License #028919.")
                .status(ProviderStatus.APPROVED)
                .build();
        approvedProvider = providerRepository.save(approvedProvider);

        // 4. Pending Provider
        User pendingProviderUser = User.builder()
                .name("Deepak Merchant")
                .email("vanguard@applicant.com")
                .phone("+65 6834 9910")
                .password(passwordEncoder.encode("password123"))
                .role(Role.PROVIDER)
                .enabled(true)
                .build();
        pendingProviderUser = userRepository.save(pendingProviderUser);

        Provider pendingProvider = Provider.builder()
                .user(pendingProviderUser)
                .companyName("Vanguard Maritime Global")
                .contactPerson("Deepak Merchant")
                .serviceType(TransportMode.SEA)
                .operatingLocations("Singapore, Port Klang, Nhava Sheva")
                .routes("Southeast Asia to Indian Subcontinent Feeders")
                .companyDetails("Regional feeder slot charterer consolidating SME container lots.")
                .supportingInfo("PSA Singapore Registered Shipper #SG-PSA-44102.")
                .status(ProviderStatus.PENDING)
                .build();
        providerRepository.save(pendingProvider);

        // 5. Initial Containers
        Container c1 = Container.builder()
                .containerNumber("MSKU-948210-4")
                .provider(approvedProvider)
                .transportMode(TransportMode.SEA)
                .origin("Rotterdam Port (NLRTM)")
                .destination("Jebel Ali Port, Dubai (AEJEA)")
                .vesselFlightTrain("Vessel: CMA CGM Jacques Saadé (Voyage 241E)")
                .totalCapacity(new BigDecimal("68.0"))
                .occupiedCapacity(new BigDecimal("43.5"))
                .availableCapacity(new BigDecimal("24.5"))
                .pricePerCbm(new BigDecimal("145.00"))
                .departureDate(LocalDateTime.now().plusDays(16))
                .arrivalDate(LocalDateTime.now().plusDays(32))
                .cutoffDate(LocalDateTime.now().plusDays(13))
                .cargoRestrictions("Dry goods, electronics, non-hazardous crated machinery")
                .temperatureControlled(false)
                .status(ContainerStatus.AVAILABLE)
                .matchScore(98)
                .build();
        c1 = containerRepository.save(c1);

        Container c2 = Container.builder()
                .containerNumber("COSU-621894-0")
                .provider(approvedProvider)
                .transportMode(TransportMode.SEA)
                .origin("Shanghai Port (CNSHA)")
                .destination("Hamburg Port (DEHAM)")
                .vesselFlightTrain("Vessel: COSCO Shipping Nebula (Voyage 88B)")
                .totalCapacity(new BigDecimal("76.0"))
                .occupiedCapacity(new BigDecimal("64.0"))
                .availableCapacity(new BigDecimal("12.0"))
                .pricePerCbm(new BigDecimal("180.00"))
                .departureDate(LocalDateTime.now().plusDays(20))
                .arrivalDate(LocalDateTime.now().plusDays(47))
                .cutoffDate(LocalDateTime.now().plusDays(18))
                .cargoRestrictions("FMCG, textile bails, packaged consumer retail")
                .temperatureControlled(false)
                .status(ContainerStatus.AVAILABLE)
                .matchScore(94)
                .build();
        containerRepository.save(c2);

        Container c3 = Container.builder()
                .containerNumber("DBCA-309112-7")
                .provider(approvedProvider)
                .transportMode(TransportMode.RAIL)
                .origin("Duisburg Intermodal Terminal (DEDUI)")
                .destination("Almaty Logistic Central (KZALA)")
                .vesselFlightTrain("Express Block Train #409-WestEast")
                .totalCapacity(new BigDecimal("58.0"))
                .occupiedCapacity(new BigDecimal("27.0"))
                .availableCapacity(new BigDecimal("31.0"))
                .pricePerCbm(new BigDecimal("210.00"))
                .departureDate(LocalDateTime.now().plusDays(10))
                .arrivalDate(LocalDateTime.now().plusDays(19))
                .cutoffDate(LocalDateTime.now().plusDays(8))
                .cargoRestrictions("Industrial spare parts, automotive modules")
                .temperatureControlled(true)
                .status(ContainerStatus.AVAILABLE)
                .matchScore(89)
                .build();
        containerRepository.save(c3);

        for (TransportMode mode : new TransportMode[]{TransportMode.ROAD, TransportMode.AIR}) {
            containerRepository.save(Container.builder().containerNumber("DEMO-" + mode)
                .provider(approvedProvider).transportMode(mode).origin("Mumbai Cargo Hub")
                .destination(mode == TransportMode.AIR ? "Dubai Cargo Terminal" : "Chennai Freight Terminal")
                .totalCapacity(new BigDecimal("30")).occupiedCapacity(new BigDecimal("10"))
                .availableCapacity(new BigDecimal("20")).pricePerCbm(new BigDecimal("120"))
                .departureDate(LocalDateTime.now().plusDays(7)).arrivalDate(LocalDateTime.now().plusDays(9))
                .cutoffDate(LocalDateTime.now().plusDays(6)).status(ContainerStatus.AVAILABLE).build());
        }

        // 6. Initial Booking
        Booking booking = Booking.builder()
                .bookingNumber("BKG-10941")
                .trader(trader)
                .container(c1)
                .spaceBooked(new BigDecimal("5.5"))
                .amount(new BigDecimal("797.50"))
                .cargoDescription("12 Crates of Laboratory Glassware & Precision Optics")
                .weightKg(new BigDecimal("1420"))
                .bookingStatus(BookingStatus.CONFIRMED)
                .build();
        booking = bookingRepository.save(booking);

        // 7. Initial Payment
        Payment payment = Payment.builder()
                .booking(booking)
                .razorpayOrderId("order_CS_882910941")
                .razorpayPaymentId("pay_CS_live_9921")
                .razorpaySignature("sig_valid_test_sha256")
                .amount(new BigDecimal("797.50"))
                .paymentStatus(PaymentStatus.SUCCESS)
                .transactionId("TXN-RZP-9921")
                .paymentDate(LocalDateTime.now().minusDays(3))
                .build();
        paymentRepository.save(payment);

        log.info("[CargoShare] Initial seed data created successfully.");
    }
}
