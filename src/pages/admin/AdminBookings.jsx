import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { toArray } from '../../services/response';
import { IconFileInvoice, IconFilter } from '@tabler/icons-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/bookings');
        setBookings(toArray(res.data));
      } catch (err) {
        console.warn('Failed to load platform bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = statusFilter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Cargo Allocation Audit
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Platform Booking Oversight
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Audit space allocation records, carrier fulfillments, and delivery milestones
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase text-port-gray mr-2 flex items-center gap-1">
          <IconFilter size={14} /> Filter Status:
        </span>
        {['ALL', 'CONFIRMED', 'IN_TRANSIT', 'PENDING_PAYMENT', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
              statusFilter === s
                ? 'bg-port-dark text-white'
                : 'bg-white text-port-gray hover:bg-[#FAF8F5] border border-port-gray/30'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Bookings Ledger */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Auditing platform-wide cargo reservations...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Bookings Found"
            description={`No cargo space bookings found with status ${statusFilter}.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Manifest ID</th>
                  <th className="px-4 py-3">Consignor Trader</th>
                  <th className="px-4 py-3">Carrier / Unit</th>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3">Space CBM</th>
                  <th className="px-4 py-3">Escrow Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-port-dark block">{b.id}</span>
                      <span className="text-[10px] text-port-grayLight">{new Date(b.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark">{b.traderName}</div>
                      <div className="text-[10px] text-port-gray">{b.traderEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark">{b.containerNumber}</div>
                      <div className="text-[10px] text-port-gray truncate max-w-[140px]">{b.providerName}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark">{b.origin}</div>
                      <div className="text-[10px] text-port-gray">→ {b.destination}</div>
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-port-dark text-sm tabular-nums">
                      {b.spaceRequired} <span className="text-[10px] font-normal font-mono">CBM</span>
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-port-dark text-sm tabular-nums">
                      ${b.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.paymentStatus || 'CREATED'} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
