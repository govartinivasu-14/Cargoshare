import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { toArray } from '../../services/response';
import {
  IconTruckDelivery,
  IconCheck,
  IconX,
  IconMessage2,
  IconFileInvoice
} from '@tabler/icons-react';

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // 'IN_TRANSIT', 'DELIVERED', 'CANCEL'
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/provider');
      setBookings(toArray(res.data));
    } catch (err) {
      console.warn('Failed to fetch provider bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const triggerAction = (booking, action) => {
    setSelectedBooking(booking);
    setPendingAction(action);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !pendingAction) return;
    try {
      const { data } = await api.post(`/bookings/${selectedBooking.id}/status`, { status: pendingAction });
      setBookings(prev => prev.map(b => b.id === data.id ? data : b));
      setConfirmOpen(false);
    } catch(e) { window.alert(e.response?.data?.message || 'Unable to update shipment'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Carrier Inbound Reservations
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Consignment Bookings Received
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Manage cargo verification, dispatch containers in transit, and confirm deliveries
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Querying received cargo consignments...
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Received Yet"
            description="Your published containers have not received any fractional space reservations from traders yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Manifest ID</th>
                  <th className="px-4 py-3">Trader / Consignor</th>
                  <th className="px-4 py-3">Container Unit</th>
                  <th className="px-4 py-3">Space</th>
                  <th className="px-4 py-3">Settlement</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Carrier Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark text-sm">{b.id}</div>
                      <div className="text-[10px] text-port-grayLight">{new Date(b.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark">{b.traderName}</div>
                      <div className="text-[10px] text-port-gray">{b.traderEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark">{b.containerNumber}</div>
                      <div className="text-[10px] text-port-gray truncate max-w-[150px]">{b.origin} → {b.destination}</div>
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-port-dark text-sm tabular-nums">
                      {b.spaceRequired} <span className="text-[10px] font-normal font-mono">CBM</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark">${b.totalAmount.toFixed(2)}</div>
                      <div className="text-[10px] text-port-teal">{b.paymentStatus}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If CONFIRMED, provider can mark IN_TRANSIT */}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => triggerAction(b, 'IN_TRANSIT')}
                            className="px-2.5 py-1 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-[10px] uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1"
                          >
                            <IconTruckDelivery size={12} />
                            <span>Mark In Transit</span>
                          </button>
                        )}

                        {/* If IN_TRANSIT, provider can mark DELIVERED */}
                        {b.status === 'IN_TRANSIT' && (
                          <button
                            onClick={() => triggerAction(b, 'DELIVERED')}
                            className="px-2.5 py-1 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-[10px] uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1"
                          >
                            <IconCheck size={12} />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                        <Link
                          to="/provider/chat"
                          className="p-1 border border-port-gray/30 rounded-[2px] hover:bg-[#E7E2D6] text-port-dark"
                          title="Chat with Trader"
                        >
                          <IconMessage2 size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title={
          pendingAction === 'IN_TRANSIT'
            ? 'Confirm Cargo Transit Dispatch'
            : pendingAction === 'DELIVERED'
            ? 'Confirm Destination Port Delivery'
            : 'Void Cargo Reservation'
        }
        message={
          pendingAction === 'IN_TRANSIT'
            ? `Are you sure you want to mark manifest ${selectedBooking?.id} as IN TRANSIT? This confirms that the cargo has passed the terminal gate-in and the voyage has departed.`
            : pendingAction === 'DELIVERED'
            ? `Confirm that container ${selectedBooking?.containerNumber} has arrived at destination and goods have cleared customs handover.`
            : `Voiding this reservation will cancel manifest ${selectedBooking?.id} and return ${selectedBooking?.spaceRequired} CBM back to available inventory.`
        }
        confirmLabel={
          pendingAction === 'IN_TRANSIT'
            ? 'Confirm Transit Dispatch'
            : pendingAction === 'DELIVERED'
            ? 'Confirm Terminal Delivery'
            : 'Void Reservation'
        }
        confirmVariant={pendingAction === 'CANCEL' ? 'rust' : 'teal'}
        requiresReason={pendingAction === 'CANCEL'}
        reasonPlaceholder="Specify operational reason for voiding reservation..."
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
