import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardStatCard from '../../components/DashboardStatCard';
import StatusBadge from '../../components/StatusBadge';
import {
  IconUsers,
  IconBuildingStore,
  IconShip,
  IconFileCheck,
  IconCreditCard,
  IconArrowRight,
  IconAlertTriangle,
  IconShieldCheck
} from '@tabler/icons-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.warn('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center font-mono text-xs text-port-gray">
        Synchronizing platform administration overview telemetry...
      </div>
    );
  }

  const { stats, providerApplications } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            System Administration Terminal
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Port Authority Platform Oversight
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Real-time ecosystem metrics, provider license vetting, and financial escrow telemetry
          </p>
        </div>
      </div>

      {/* Primary Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardStatCard
          title="Active Traders"
          value={stats.totalTraders}
          unit="Users"
          icon={IconUsers}
          subtext="Exporters & Importers"
        />
        <DashboardStatCard
          title="Carriers"
          value={stats.totalProviders}
          unit="Firms"
          icon={IconBuildingStore}
          subtext="Vetted logistics operators"
        />
        <DashboardStatCard
          title="Containers"
          value={stats.totalContainers}
          unit="Units"
          variant="teal"
          icon={IconShip}
          subtext="Multimodal fleet active"
        />
        <DashboardStatCard
          title="Total Bookings"
          value={stats.totalBookings}
          unit="Manifests"
          variant="orange"
          icon={IconFileCheck}
          subtext="Space allocations"
        />
        <DashboardStatCard
          title="Gross Payments"
          value={`$${stats.totalPaymentsAmount.toLocaleString()}`}
          unit="USD"
          variant="teal"
          icon={IconCreditCard}
          subtext="Escrow cleared volume"
        />
      </div>

      {/* Provider Applications Summary Widget */}
      <div className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E2D6]">
          <div>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark flex items-center gap-2">
              <IconShieldCheck size={18} className="text-port-teal" />
              <span>Carrier Compliance & Vetting Queue Summary</span>
            </h2>
            <span className="text-[10px] font-mono text-port-gray">
              Mandatory inspection before container publishing rights are granted
            </span>
          </div>

          <Link
            to="/admin/applications"
            className="px-3 py-1.5 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1"
          >
            <span>Inspect Applications</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-amber-50 border border-port-amber/40 rounded-[2px] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-port-amber font-bold">
                Pending Vetting Audit
              </div>
              <div className="font-heading font-black text-2xl text-port-dark tabular-nums mt-1">
                {providerApplications.pending}
              </div>
              <span className="text-[10px] font-mono text-port-gray">Awaiting license review</span>
            </div>
            <StatusBadge status="PENDING" />
          </div>

          <div className="p-4 bg-teal-50 border border-port-teal/40 rounded-[2px] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-port-teal font-bold">
                Approved Carriers
              </div>
              <div className="font-heading font-black text-2xl text-port-dark tabular-nums mt-1">
                {providerApplications.approved}
              </div>
              <span className="text-[10px] font-mono text-port-gray">Active publishing enabled</span>
            </div>
            <StatusBadge status="APPROVED" />
          </div>

          <div className="p-4 bg-red-50 border border-port-rust/40 rounded-[2px] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-port-rust font-bold">
                Rejected / Ineligible
              </div>
              <div className="font-heading font-black text-2xl text-port-dark tabular-nums mt-1">
                {providerApplications.rejected}
              </div>
              <span className="text-[10px] font-mono text-port-gray">Declined credentials</span>
            </div>
            <StatusBadge status="REJECTED" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="p-4 bg-white border border-[#D8D1C3] hover:border-port-dark rounded-[2px] shadow-sm transition-all"
        >
          <div className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark mb-1">
            Manage Users
          </div>
          <div className="text-[11px] font-mono text-port-gray">
            Directory of all registered traders and logistics operators
          </div>
        </Link>

        <Link
          to="/admin/containers"
          className="p-4 bg-white border border-[#D8D1C3] hover:border-port-dark rounded-[2px] shadow-sm transition-all"
        >
          <div className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark mb-1">
            Fleet Oversight
          </div>
          <div className="text-[11px] font-mono text-port-gray">
            Monitor all active containers across global maritime lanes
          </div>
        </Link>

        <Link
          to="/admin/bookings"
          className="p-4 bg-white border border-[#D8D1C3] hover:border-port-dark rounded-[2px] shadow-sm transition-all"
        >
          <div className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark mb-1">
            Booking Oversight
          </div>
          <div className="text-[11px] font-mono text-port-gray">
            Audit space allocations and operational transit updates
          </div>
        </Link>

        <Link
          to="/admin/payments"
          className="p-4 bg-white border border-[#D8D1C3] hover:border-port-dark rounded-[2px] shadow-sm transition-all"
        >
          <div className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark mb-1">
            Payment Audits
          </div>
          <div className="text-[11px] font-mono text-port-gray">
            Inspect transaction orders and settlement verification logs
          </div>
        </Link>
      </div>
    </div>
  );
}
