package com.cargoshare;

import com.cargoshare.dto.request.BookingRequest;
import com.cargoshare.dto.response.BookingResponse;
import com.cargoshare.entity.Container;
import com.cargoshare.entity.Provider;
import com.cargoshare.entity.User;
import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.entity.enums.ProviderStatus;
import com.cargoshare.entity.enums.Role;
import com.cargoshare.entity.enums.TransportMode;
import com.cargoshare.exception.InsufficientSpaceException;
import com.cargoshare.repository.ContainerRepository;
import com.cargoshare.repository.ProviderRepository;
import com.cargoshare.repository.UserRepository;
import com.cargoshare.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:concurrency;MODE=MySQL;DB_CLOSE_DELAY=-1")
public class BookingConcurrencyTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

    private Long testContainerId;
    private Long trader1Id;
    private Long trader2Id;

    @BeforeEach
    void setUp() {
        // Create 2 test traders
        User t1 = userRepository.save(User.builder()
                .name("Concurrent Trader 1")
                .email("c_trader1_" + System.currentTimeMillis() + "@test.com")
                .password("password")
                .role(Role.TRADER)
                .enabled(true)
                .build());
        trader1Id = t1.getId();

        User t2 = userRepository.save(User.builder()
                .name("Concurrent Trader 2")
                .email("c_trader2_" + System.currentTimeMillis() + "@test.com")
                .password("password")
                .role(Role.TRADER)
                .enabled(true)
                .build());
        trader2Id = t2.getId();

        // Create provider and container with 5.0 CBM available
        User pUser = userRepository.save(User.builder()
                .name("Carrier Provider")
                .email("c_prov_" + System.currentTimeMillis() + "@test.com")
                .password("password")
                .role(Role.PROVIDER)
                .enabled(true)
                .build());

        Provider prov = providerRepository.save(Provider.builder()
                .user(pUser)
                .companyName("Concurrent Freight Lines")
                .contactPerson("Agent")
                .serviceType(TransportMode.SEA)
                .status(ProviderStatus.APPROVED)
                .build());

        Container c = containerRepository.save(Container.builder()
                .containerNumber("CONC-" + System.currentTimeMillis())
                .provider(prov)
                .transportMode(TransportMode.SEA)
                .origin("Hamburg")
                .destination("Dubai")
                .totalCapacity(new BigDecimal("10.0"))
                .occupiedCapacity(new BigDecimal("5.0"))
                .availableCapacity(new BigDecimal("5.0")) // 5.0 CBM available
                .pricePerCbm(new BigDecimal("100.00"))
                .departureDate(LocalDateTime.now().plusDays(10))
                .arrivalDate(LocalDateTime.now().plusDays(20))
                .status(ContainerStatus.AVAILABLE)
                .build());

        testContainerId = c.getId();
    }

    @Test
    @DisplayName("Pessimistic Locking Test: Two concurrent booking calls for 4.0 CBM against 5.0 CBM available - exactly 1 must succeed and 1 must fail")
    void testConcurrentBookingPessimisticLock() throws InterruptedException {
        int threads = 2;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        // Trader 1 task: Book 4.0 CBM
        executor.submit(() -> {
            try {
                startLatch.await();
                BookingRequest req = new BookingRequest();
                req.setContainerId(testContainerId);
                req.setSpaceRequired(new BigDecimal("4.0"));
                req.setCargoDescription("Thread 1 Cargo");

                BookingResponse res = bookingService.createBooking(trader1Id, req);
                if (res != null) {
                    successCount.incrementAndGet();
                }
            } catch (InsufficientSpaceException e) {
                failureCount.incrementAndGet();
            } catch (Exception e) {
                // If optimistic lock conflict or other lock timeout
                failureCount.incrementAndGet();
            } finally {
                finishLatch.countDown();
            }
        });

        // Trader 2 task: Book 4.0 CBM
        executor.submit(() -> {
            try {
                startLatch.await();
                BookingRequest req = new BookingRequest();
                req.setContainerId(testContainerId);
                req.setSpaceRequired(new BigDecimal("4.0"));
                req.setCargoDescription("Thread 2 Cargo");

                BookingResponse res = bookingService.createBooking(trader2Id, req);
                if (res != null) {
                    successCount.incrementAndGet();
                }
            } catch (InsufficientSpaceException e) {
                failureCount.incrementAndGet();
            } catch (Exception e) {
                failureCount.incrementAndGet();
            } finally {
                finishLatch.countDown();
            }
        });

        // Release latch to start both threads simultaneously
        startLatch.countDown();
        finishLatch.await();
        executor.shutdown();

        // Exactly 1 must succeed, 1 must fail
        assertEquals(1, successCount.get(), "Exactly one booking must succeed under pessimistic write lock");
        assertEquals(1, failureCount.get(), "The second simultaneous booking must fail with InsufficientSpace");

        // Verify remaining available space is exactly 1.0 CBM (5.0 - 4.0)
        Container updated = containerRepository.findById(testContainerId).orElseThrow();
        assertEquals(0, new BigDecimal("1.0").compareTo(updated.getAvailableCapacity()), "Final available capacity must be exactly 1.0 CBM");
    }
}
