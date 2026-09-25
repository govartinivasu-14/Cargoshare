import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardStatCard from '../../components/DashboardStatCard';
import StatusBadge from '../../components/StatusBadge';
import CapacityBar from '../../components/CapacityBar';
import EmptyState from '../../components/EmptyState';
import {
  IconShip,
  IconPlus,
  IconBoxSeam,
  IconReceipt2,
  IconClock,
  IconAlertTriangle,
  IconArrowRight,
  IconEdit,
  IconLayersLinked
} from '@tabler/icons-react';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [containers, setContainers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [providerStatus, setProviderStatus] = useState(user?.providerStatus);
  const isApproved = providerStatus === 'APPROVED';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cRes, bRes] = await Promise.all([
          api.get('/provider/dashboard').then(r => { setProviderStatus(r.data.providerStatus); return { data: r.data.containers }; }),
          api.get('/bookings/provider')
        ]);
        setContainers(cRes.data || []);
        setBookings(bRes.data || []);
      } catch (err) {
        console.warn('Failed to load provider metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  const totalContainers = containers.length;
  const totalAvailableSpace = containers.reduce((acc, c) => acc + (Number(c.availableCapacity) || 0), 0);
  const activeBookings = bookings.filter((b) => ['CONFIRMED', 'IN_TRANSIT'].includes(b.status)).length;
  const pendingRequests = bookings.filter((b) => b.status === 'PENDING_PAYMENT').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Top Banner */}
      <div className="pb-4 border-b border-[#D8D1C3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray">
              Fleet Operations Desk
            </span>
            <StatusBadge status={providerStatus || 'PENDING'} />
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            {user?.name || 'Logistics Carrier Terminal'}
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Fractional Space Fleet Management & Booking Confirmations
          </p>
        </div>

        <div>
          {isApproved ? (
            <Link
              to="/provider/containers/new"
              className="px-4 py-2 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-2 transition-colors"
            >
              <IconPlus size={16} />
              <span>List New Container</span>
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-200 text-port-gray font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] cursor-not-allowed flex items-center gap-2"
              title="Vetting approval required before publishing"
            >
              <IconPlus size={16} />
              <span>Publishing Disabled (Vetting)</span>
            </button>
          )}
        </div>
      </div>

      {/* If unapproved (PENDING or REJECTED), show verification status instead of full dashboard */}
      {!isApproved ? (
        <div className="bg-white border border-[#D8D1C3] p-6 sm:p-8 rounded-[2px] shadow-sm space-y-6">
          <div className="p-4 bg-amber-50 border-2 border-port-amber/60 rounded-[2px] text-xs font-mono text-port-dark flex items-start gap-3">
            <IconAlertTriangle size={24} className="text-port-amber shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark">
                Carrier Verification Status: {user?.providerStatus || 'PENDING'}
              </div>
              <p className="text-port-gray text-xs leading-relaxed font-mono">
                {user?.providerStatus === 'REJECTED'
                  ? 'Your carrier registration application was reviewed by port administration and was rejected. Please review your compliance documents or contact port dispatch for clarification.'
                  : 'Your carrier registration application has been received and is currently undergoing maritime compliance vetting. Fractional container capacity publishing and booking operations will unlock once approved by Port Administration.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D6] rounded-[2px]">
              <div className="text-[10px] text-port-gray uppercase tracking-wider mb-1">Company Account</div>
              <div className="font-heading font-bold text-port-dark text-sm">{user?.name || 'Carrier Account'}</div>
              <div className="text-port-gray text-[11px] mt-1">{user?.email}</div>
            </div>
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D6] rounded-[2px]">
              <div className="text-[10px] text-port-gray uppercase tracking-wider mb-1">Current Review Phase</div>
              <div className="font-heading font-bold text-port-amber text-sm uppercase">Compliance & Licensing Vetting</div>
              <div className="text-port-gray text-[11px] mt-1">Queue SLA: ~24 Business Hours</div>
            </div>
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D6] rounded-[2px]">
              <div className="text-[10px] text-port-gray uppercase tracking-wider mb-1">Support Contact</div>
              <div className="font-heading font-bold text-port-teal text-sm">dispatch@cargoshare.com</div>
              <div className="text-port-gray text-[11px] mt-1">Port Vetting Office: +1 800 555 0199</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
              title="Total Containers"
              value={totalContainers}
              unit="Units"
              icon={IconShip}
              subtext="Active fleet allocations"
            />
            <DashboardStatCard
              title="Available Space"
              value={totalAvailableSpace.toFixed(1)}
              unit="CBM"
              variant="teal"
              icon={IconBoxSeam}
              subtext="Unsold fractional volume"
            />
            <DashboardStatCard
              title="Active Bookings"
              value={activeBookings}
              unit="Manifests"
              variant="teal"
              icon={IconLayersLinked}
              subtext="Confirmed / In Transit"
            />
            <DashboardStatCard
              title="Pending Requests"
              value={pendingRequests}
              unit="Awaiting"
              variant="amber"
              icon={IconClock}
              subtext="Unsettled reservations"
            />
          </div>

          {/* Quick Container Inventory Table */}
          <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E7E2D6] flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark">
                  Active Container Capacity Fleet
                </h2>
                <span className="text-[10px] font-mono text-port-gray">
                  Live capacity telemetry and rate monitoring
                </span>
              </div>
              <Link
                to="/provider/containers"
                className="text-xs font-heading font-bold text-port-teal hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                <span>Manage All Containers</span>
                <IconArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-port-gray">
                Querying carrier fleet containers...
              </div>
            ) : containers.length === 0 ? (
              <EmptyState
                title="No Container Units Published"
                description="You have not published any fractional container space to the marketplace yet."
                actionText={isApproved ? "Add Your First Container" : ""}
                actionLink={isApproved ? "/provider/containers/new" : ""}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                    <tr>
                      <th className="px-4 py-3">Container ID</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Corridor Route</th>
                      <th className="px-4 py-3 w-64">Capacity Bar</th>
                      <th className="px-4 py-3">Rate / CBM</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D6] font-mono">
                    {containers.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-port-dark">{c.containerNumber}</div>
                          <div className="text-[10px] text-port-grayLight">{c.id}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-port-dark font-sans">{c.mode}</span>
                        </td>
                        <td className="px-4 py-3 font-sans">
                          <div className="font-medium text-port-dark">{c.origin}</div>
                          <div className="text-[10px] text-port-gray">→ {c.destination}</div>
                        </td>
                        <td className="px-4 py-3">
                          <CapacityBar
                            total={c.totalCapacity}
                            available={c.availableCapacity}
                            height="h-2.5"
                          />
                        </td>
                        <td className="px-4 py-3 font-heading font-bold text-port-dark text-sm tabular-nums">
                          ${c.pricePerCbm.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to="/provider/containers"
                            className="px-2.5 py-1 border border-port-gray/40 text-port-dark font-heading font-semibold text-[10px] uppercase tracking-wider rounded-[2px] hover:bg-[#E7E2D6] transition-colors"
                          >
                            Adjust Space
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
