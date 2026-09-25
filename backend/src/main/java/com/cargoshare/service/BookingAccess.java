package com.cargoshare.service;
import com.cargoshare.repository.BookingRepository;
import com.cargoshare.security.UserPrincipal;
import com.cargoshare.entity.enums.Role;
import com.cargoshare.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class BookingAccess {
 private final BookingRepository bookings;
 @Transactional(readOnly=true)
 public void check(Long id, UserPrincipal user, boolean payment) {
  var b=bookings.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
  boolean owner=b.getTrader().getId().equals(user.getId());
  if (payment ? !owner : !(owner || user.getRole()==Role.ADMIN || b.getContainer().getProvider().getUser().getId().equals(user.getId())))
    throw new ForbiddenException("You cannot access this booking");
 }
}
