package com.cargoshare.repository;

import com.cargoshare.entity.Booking;
import com.cargoshare.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.id = :id")
    Optional<Booking> findByIdForUpdate(@Param("id") Long id);

    List<Booking> findByTraderIdOrderByCreatedAtDesc(Long traderId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.container c JOIN FETCH c.provider p WHERE p.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findByProviderUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.container c JOIN FETCH c.provider p WHERE p.id = :providerId ORDER BY b.createdAt DESC")
    List<Booking> findByProviderId(@Param("providerId") Long providerId);

    Optional<Booking> findByBookingNumber(String bookingNumber);

    List<Booking> findByBookingStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.spaceBooked), 0) FROM Booking b WHERE b.container.id = :containerId AND b.bookingStatus <> com.cargoshare.entity.enums.BookingStatus.CANCELLED")
    java.math.BigDecimal reservedSpace(@Param("containerId") Long containerId);

    long countByBookingStatus(BookingStatus status);
}
