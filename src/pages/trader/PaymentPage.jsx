import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import api from '../../services/api';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [order, setOrder] = useState(null);
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api.get(`/bookings/${bookingId}`).then(r => setBooking(r.data))
      .catch(e => setError(e.response?.data?.message || e.message));
  }, [bookingId]);
  const pay = async () => {
    setBusy(true); setError('');
    try {
      const { data } = await api.post('/payments/create-order', { bookingId });
      const image = await QRCode.toDataURL(data.qrPayload, { width: 260, margin: 2, errorCorrectionLevel: 'M' });
      setOrder(data); setQr(image);
    } catch(e) { setError(e.response?.data?.message || 'Unable to generate QR code. Please retry.'); }
    finally { setBusy(false); }
  };
  const complete = async () => {
    setBusy(true); setError('');
    try {
      const { data } = await api.post('/payments/demo-complete', { bookingId, orderId: order.orderId });
      setBooking(data); setOrder(null); setQr('');
    } catch(e) { setError(e.response?.data?.message || 'Payment could not be completed. Please retry.'); }
    finally { setBusy(false); }
  };
  const cancel = async () => {
    setBusy(true); setError('');
    try { const { data } = await api.post(`/bookings/${bookingId}/cancel`); setBooking(data); setOrder(null); setQr(''); }
    catch(e) { setError(e.response?.data?.message || e.message); }
    finally { setBusy(false); }
  };
  const success = booking?.paymentStatus === 'SUCCESS';
  return <div className="max-w-xl mx-auto p-6 sm:p-8 space-y-5 bg-white my-8 border border-port-gray/30 shadow-sm">
    <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase">Payment gateway</span>
    <h1 className="text-2xl font-bold text-port-dark">{success ? 'Payment successful!' : 'Pay for container space'}</h1>
    <p className="text-sm text-port-gray">Review your booking and complete the payment below.</p>
    {error && <p role="alert" className="p-3 bg-red-50 text-red-800">{error}</p>}
    {booking ? <>
      <div className="p-4 bg-port-light space-y-2">
        <p className="font-semibold">{booking.origin} → {booking.destination}</p>
        <p>{bookingId} · {booking.spaceRequired} CBM</p>
        <p className="text-2xl font-bold">{booking.currency} {Number(booking.totalAmount).toFixed(2)}</p>
      </div>
      {success ? <div role="status" className="p-5 bg-teal-50 border border-teal-200 text-teal-900 space-y-2">
        <p className="font-bold">✓ Payment completed</p>
        <p>Your container space is confirmed.</p>
        <p className="text-xs break-all">Reference: {booking.razorpayPaymentId?.replace(/^DEMO-/, '')}</p>
      </div> : booking.status === 'PENDING_PAYMENT' ? <>
        {qr ? <div className="text-center space-y-4 border p-5">
          <h2 className="font-bold">Your payment QR code</h2>
          <img src={qr} width="260" height="260" alt="Payment QR code" className="mx-auto" />
          <p className="text-sm text-port-gray">Scan to view your payment reference, then select Complete payment to continue.</p>
          <button disabled={busy} onClick={complete} className="w-full bg-port-teal text-white p-3 font-bold disabled:opacity-50">{busy ? 'Processing payment…' : 'Complete payment'}</button>
        </div> : <button disabled={busy} onClick={pay} className="w-full bg-port-orange text-white p-3 font-bold disabled:opacity-50">{busy ? 'Generating QR…' : 'Pay — generate QR'}</button>}
        <button disabled={busy} onClick={cancel} className="underline text-sm text-port-gray">Cancel unpaid reservation</button>
      </> : <p>Status: {booking.status}</p>}
      <Link className="block underline font-semibold text-port-teal" to={`/trader/bookings/${bookingId}`}>View booking</Link>
    </> : !error && <p>Loading booking…</p>}
  </div>;
}
