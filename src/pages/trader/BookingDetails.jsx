import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import BookingStatusTimeline from '../../components/BookingStatusTimeline';
import StatusBadge from '../../components/StatusBadge';
import {
  IconArrowLeft,
  IconMessage2,
  IconCreditCard,
  IconReceipt,
  IconTruckDelivery,
  IconBuildingStore,
  IconPrinter
} from '@tabler/icons-react';

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        setError('Could not retrieve booking manifest.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-port-gray">
        Retrieving official Bill of Lading manifest for {id}...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-left">
        <div className="bg-red-50 border border-port-rust/30 p-4 rounded-[2px] text-xs font-mono text-port-rust">
          {error || 'Booking not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header & Nav */}
      <div className="border-b border-[#D8D1C3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-port-gray mb-1">
            <Link to="/trader/bookings" className="hover:underline flex items-center gap-1">
              <IconArrowLeft size={13} /> Back to My Bookings
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
              Manifest Dossier: {booking.id}
            </h1>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'PENDING_PAYMENT' && (
            <Link
              to={`/trader/payment/${booking.id}`}
              className="px-4 py-2 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <IconCreditCard size={15} />
              <span>Complete Payment</span>
            </Link>
          )}
          <Link
            to="/trader/chat"
            className="px-4 py-2 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <IconMessage2 size={15} />
            <span>Chat With Carrier</span>
          </Link>
        </div>
      </div>

      {/* Manifest Milestone Timeline */}
      <div className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm">
        <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark mb-2">
          Carrier Transit & Settlement Timeline
        </h2>
        <BookingStatusTimeline
          timeline={booking.timeline}
          currentStatus={booking.status}
        />
      </div>

      {/* Manifest Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Container & Route Specs */}
        <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] shadow-sm space-y-3 font-mono text-xs">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark pb-2 border-b border-[#E7E2D6] flex items-center gap-1.5">
            <IconTruckDelivery size={16} className="text-port-teal" />
            <span>Voyage & Cargo Particulars</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-port-gray">Container ID:</span>
              <span className="font-bold text-port-dark">{booking.containerNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Transport Mode:</span>
              <span className="font-bold text-port-dark">{booking.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Origin Port:</span>
              <span className="font-bold text-port-dark">{booking.origin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Destination Port:</span>
              <span className="font-bold text-port-dark">{booking.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Departure ETD:</span>
              <span className="font-bold text-port-dark">{new Date(booking.departureDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Arrival ETA:</span>
              <span className="font-bold text-port-dark">{new Date(booking.arrivalDate).toLocaleDateString()}</span>
            </div>
            <div className="border-t border-port-gray/20 pt-2 flex justify-between">
              <span className="text-port-gray">Cargo Spec:</span>
              <span className="font-bold text-port-dark text-right">{booking.cargoDescription}</span>
            </div>
          </div>
        </div>

        {/* Carrier & Financial Breakdown */}
        <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] shadow-sm space-y-3 font-mono text-xs">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark pb-2 border-b border-[#E7E2D6] flex items-center gap-1.5">
            <IconReceipt size={16} className="text-port-orange" />
            <span>Billing & Carrier Details</span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-port-gray">Carrier Operator:</span>
              <span className="font-bold text-port-dark">{booking.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Allocated Space:</span>
              <span className="font-bold text-port-dark">{booking.spaceRequired} CBM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Rate per CBM:</span>
              <span className="font-bold text-port-dark">${booking.pricePerCbm.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Payment Method:</span>
              <span className="font-bold text-port-teal">{booking.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Payment order:</span>
              <span className="font-bold text-port-dark">{booking.razorpayOrderId?.replace(/^DEMO-/, '') || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-port-gray">Payment ID:</span>
              <span className="font-bold text-port-dark">{booking.razorpayPaymentId?.replace(/^DEMO-/, '') || 'Awaiting'}</span>
            </div>
            <div className="border-t border-port-gray/20 pt-2 flex justify-between text-sm font-bold">
              <span className="text-port-dark">Gross Amount Paid:</span>
              <span className="text-port-dark">${booking.totalAmount.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
