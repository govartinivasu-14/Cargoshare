import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import {
  IconSearch,
  IconFilter,
  IconArrowRight,
  IconCreditCard,
  IconMessage2
} from '@tabler/icons-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bookings/my');
        setBookings(res.data || []);
      } catch (err) {
        console.warn('Failed to load trader bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statuses = [
    'ALL',
    'CONFIRMED',
    'IN_TRANSIT',
    'PENDING_PAYMENT',
    'DELIVERED',
    'CANCELLED'
  ];

  const filteredBookings = selectedStatus === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === selectedStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Cargo Manifest Archive
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            My Container Space Bookings
          </h1>
        </div>

        <Link
          to="/trader/search"
          className="px-4 py-2 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors self-start"
        >
          <IconSearch size={15} />
          <span>New Space Reservation</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2">
        <span className="text-xs font-mono uppercase text-port-gray mr-2 flex items-center gap-1">
          <IconFilter size={14} /> Filter Status:
        </span>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
              selectedStatus === status
                ? 'bg-port-dark text-white'
                : 'bg-white text-port-gray hover:bg-[#FAF8F5] border border-port-gray/30'
            }`}
          >
            {status.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Bookings Table / List */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Accessing carrier booking records...
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings Matching Status"
            description={`You currently have no reservations in status ${selectedStatus}.`}
            actionText="Search Container Space"
            actionLink="/trader/search"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Manifest ID</th>
                  <th className="px-4 py-3">Carrier / Unit</th>
                  <th className="px-4 py-3">Route Lane</th>
                  <th className="px-4 py-3">Space</th>
                  <th className="px-4 py-3">Total Cost</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-port-dark text-sm block">{b.id}</span>
                      <span className="text-[10px] text-port-grayLight">
                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark">{b.containerNumber}</div>
                      <div className="text-[10px] text-port-gray truncate max-w-[170px]">{b.providerName}</div>
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
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'PENDING_PAYMENT' && (
                          <Link
                            to={`/trader/payment/${b.id}`}
                            className="px-2.5 py-1 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-[10px] uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1"
                          >
                            <IconCreditCard size={12} /> Pay
                          </Link>
                        )}
                        <Link
                          to={`/trader/bookings/${b.id}`}
                          className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#E7E2D6] text-port-dark border border-port-gray/40 font-heading font-semibold text-[10px] uppercase tracking-wider rounded-[2px] transition-colors"
                        >
                          Details
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
    </div>
  );
}
