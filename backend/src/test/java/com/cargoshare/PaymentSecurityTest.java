package com.cargoshare;
import com.cargoshare.service.PaymentService;
import com.cargoshare.repository.*;
import com.cargoshare.entity.*;
import com.cargoshare.entity.enums.*;
import com.cargoshare.exception.BadRequestException;
import org.junit.jupiter.api.Test;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
class PaymentSecurityTest {
 @Test void demoPaymentValidatesOrderAndIsIdempotent() {
  var bookings=mock(BookingRepository.class); var payments=mock(PaymentRepository.class);
  var service=new PaymentService(bookings,payments);
  var booking=Booking.builder().id(99L).bookingStatus(BookingStatus.PENDING_PAYMENT).build();
  var payment=Payment.builder().booking(booking).razorpayOrderId("DEMO-order").paymentStatus(PaymentStatus.CREATED).build();
  when(bookings.findByIdForUpdate(99L)).thenReturn(Optional.of(booking));
  when(payments.findByBookingId(99L)).thenReturn(Optional.of(payment));
  assertThrows(BadRequestException.class,()->service.completeDemo(99L,"DEMO-wrong"));
  service.completeDemo(99L,"DEMO-order");
  assertEquals(BookingStatus.CONFIRMED,booking.getBookingStatus());
  assertEquals(PaymentStatus.SUCCESS,payment.getPaymentStatus());
  String reference=payment.getRazorpayPaymentId();
  service.completeDemo(99L,"DEMO-order");
  assertEquals(reference,payment.getRazorpayPaymentId());
  verify(payments,times(1)).save(payment);
 }
}
