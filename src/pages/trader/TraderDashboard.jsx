import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardStatCard from '../../components/DashboardStatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import {
  IconBoxSeam,
  IconClock,
  IconCheck,
  IconSearch,
  IconArrowRight,
  IconTruckDelivery,
  IconMessage2
} from '@tabler/icons-react';

export default function TraderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
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

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((b) => ['CONFIRMED', 'IN_TRANSIT', 'PENDING_PAYMENT'].includes(b.status)).length;
  const completedBookings = bookings.filter((b) => b.status === 'DELIVERED').length;
  const totalCbmBooked = bookings.reduce((sum, b) => sum + (Number(b.spaceRequired) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Top Banner: Ops screen style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D8D1C3] gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Manifest Overview
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Trader Operations Control — {user?.name || 'Trader Terminal'}
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Fractional Cargo Allocations • Live Voyage Manifests
          </p>
        </div>

        <div>
          <Link
            to="/trader/search"
            className="px-4 py-2 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-2 transition-colors"
          >
            <IconSearch size={16} />
            <span>Search Container Space</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total Bookings"
          value={totalBookings}
          unit="Manifests"
          icon={IconBoxSeam}
          subtext="Lifetime reservations"
        />
        <DashboardStatCard
          title="Active Allocations"
          value={activeBookings}
          unit="In Motion"
          variant="teal"
          icon={IconTruckDelivery}
          subtext="Confirmed or transit"
        />
        <DashboardStatCard
          title="Delivered Freight"
          value={completedBookings}
          unit="Completed"
          variant="teal"
          icon={IconCheck}
          subtext="Terminal delivered"
        />
        <DashboardStatCard
          title="Total Space Booked"
          value={totalCbmBooked.toFixed(1)}
          unit="CBM"
          variant="orange"
          icon={IconBoxSeam}
          subtext="Volume moved"
        />
      </div>

      {/* Recent Bookings Ledger */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E7E2D6] flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark">
              Recent Cargo Manifest Bookings
            </h2>
            <span className="text-[10px] font-mono text-port-gray">
              Real-time settlement status & container slot references
            </span>
          </div>
          <Link
            to="/trader/bookings"
            className="text-xs font-heading font-bold text-port-teal hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>All Bookings</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-port-gray">
            Querying active booking records...
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Active Cargo Bookings Found"
            description="You have not reserved fractional space in any container voyages yet."
            actionText="Search Available Containers"
            actionLink="/trader/search"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Container</th>
                  <th className="px-4 py-3">Route Lane</th>
                  <th className="px-4 py-3">Space</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3 font-bold text-port-dark">
                      {b.id}
                      <span className="block text-[10px] font-normal text-port-grayLight">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-port-dark font-medium">
                      {b.containerNumber}
                      <span className="block text-[10px] text-port-gray truncate max-w-[150px]">
                        {b.providerName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-port-dark">
                      <div className="text-xs font-sans font-medium">{b.origin}</div>
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
                      <div className="flex items-center justify-end gap-2">
                        {b.status === 'PENDING_PAYMENT' && (
                          <Link
                            to={`/trader/payment/${b.id}`}
                            className="px-2.5 py-1 bg-port-orange text-white font-heading font-bold text-[10px] uppercase tracking-wider rounded-[2px] hover:bg-port-orangeHover transition-colors"
                          >
                            Pay Now
                          </Link>
                        )}
                        <Link
                          to={`/trader/bookings/${b.id}`}
                          className="px-2.5 py-1 border border-port-gray/40 text-port-dark font-heading font-semibold text-[10px] uppercase tracking-wider rounded-[2px] hover:bg-[#FAF8F5] transition-colors"
                        >
                          Manifest
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
