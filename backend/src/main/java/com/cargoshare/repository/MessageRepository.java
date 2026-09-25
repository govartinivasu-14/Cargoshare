package com.cargoshare.repository;

import com.cargoshare.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m " +
           "JOIN FETCH m.sender s " +
           "JOIN FETCH m.receiver r " +
           "WHERE (s.id = :userA AND r.id = :userB) OR (s.id = :userB AND r.id = :userA) " +
           "ORDER BY m.sentAt ASC")
    List<Message> findChatHistoryBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("SELECT m FROM Message m " +
           "JOIN FETCH m.sender s " +
           "JOIN FETCH m.receiver r " +
           "WHERE m.bookingId = :bookingId AND (s.id = :authUserId OR r.id = :authUserId) " +
           "ORDER BY m.sentAt ASC")
    List<Message> findByBookingIdAndUser(@Param("bookingId") Long bookingId, @Param("authUserId") Long authUserId);
}
