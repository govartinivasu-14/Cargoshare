package com.cargoshare.repository;

import com.cargoshare.entity.Container;
import com.cargoshare.entity.enums.ContainerStatus;
import com.cargoshare.entity.enums.TransportMode;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContainerRepository extends JpaRepository<Container, Long> {

    /**
     * Rule 7: Pessimistic write lock on container row during booking check-and-decrement transaction.
     * Guarantees concurrent bookings are sequenced and space check is authoritative.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Container c WHERE c.id = :id")
    Optional<Container> findByIdForUpdate(@Param("id") Long id);

    /**
     * Rule 3: Only APPROVED providers' containers are visible in search.
     */
    @Query("SELECT c FROM Container c " +
           "JOIN FETCH c.provider p " +
           "WHERE p.status = com.cargoshare.entity.enums.ProviderStatus.APPROVED " +
           "AND c.status = com.cargoshare.entity.enums.ContainerStatus.AVAILABLE " +
           "AND c.availableCapacity > 0 AND c.departureDate > CURRENT_TIMESTAMP AND (c.cutoffDate IS NULL OR c.cutoffDate > CURRENT_TIMESTAMP) " +
           "AND (:origin IS NULL OR LOWER(c.origin) LIKE LOWER(CONCAT('%', :origin, '%'))) " +
           "AND (:destination IS NULL OR LOWER(c.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) " +
           "AND (:mode IS NULL OR c.transportMode = :mode) " +
           "AND (:minSpace IS NULL OR c.availableCapacity >= :minSpace) " +
           "AND (:departureDate IS NULL OR c.departureDate >= :departureDate) " +
           "ORDER BY c.matchScore DESC, c.departureDate ASC")
    List<Container> searchContainers(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("mode") TransportMode mode,
            @Param("minSpace") BigDecimal minSpace,
            @Param("departureDate") LocalDateTime departureDate
    );

    List<Container> findByProviderId(Long providerId);

    List<Container> findByStatus(ContainerStatus status);

    boolean existsByContainerNumber(String containerNumber);
}
