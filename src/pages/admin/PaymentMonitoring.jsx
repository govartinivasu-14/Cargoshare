import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DashboardStatCard from '../../components/DashboardStatCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { toArray } from '../../services/response';
import {
  IconCreditCard,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconFilter
} from '@tabler/icons-react';

export default function PaymentMonitoring() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/payments');
        setPayments(toArray(res.data));
      } catch (err) {
        console.warn('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalSettled = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const successfulCount = payments.filter((p) => p.status === 'SUCCESS').length;
  const createdCount = payments.filter((p) => p.status === 'CREATED').length;

  const filtered = statusFilter === 'ALL'
    ? payments
    : payments.filter((p) => p.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Financial Escrow Auditing
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Payment & Settlement Monitoring
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Payment history and booking transaction records
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardStatCard
          title="Total Volume Cleared"
          value={`$${totalSettled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          unit="USD"
          variant="teal"
          icon={IconCreditCard}
          subtext="Net successful settlements"
        />
        <DashboardStatCard
          title="Completed Transactions"
          value={successfulCount}
          unit="Cleared"
          variant="teal"
          icon={IconCheck}
          subtext="Payments completed"
        />
        <DashboardStatCard
          title="Pending Authorizations"
          value={createdCount}
          unit="In Escrow"
          variant="amber"
          icon={IconClock}
          subtext="Awaiting gateway clearance"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase text-port-gray mr-2 flex items-center gap-1">
          <IconFilter size={14} /> Filter Status:
        </span>
        {['ALL', 'SUCCESS', 'CREATED', 'FAILED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
              statusFilter === s
                ? 'bg-port-dark text-white'
                : 'bg-white text-port-gray hover:bg-[#FAF8F5] border border-port-gray/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Payment Ledger Table */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Querying gateway transaction logs...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Payment Records Found"
            description={`No escrow payments registered with status ${statusFilter}.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Txn ID / Date</th>
                  <th className="px-4 py-3">Booking Reference</th>
                  <th className="px-4 py-3">Consignor Trader</th>
                  <th className="px-4 py-3">Settlement Amount</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark text-sm">{p.id}</div>
                      <div className="text-[10px] text-port-grayLight">{new Date(p.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-port-dark">{p.bookingId}</span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark">{p.traderName}</div>
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-port-dark text-sm tabular-nums">
                      ${p.amount.toFixed(2)} <span className="text-[10px] font-normal font-mono">USD</span>
                    </td>
                    <td className="px-4 py-3 text-port-gray text-[11px]">
                      {p.razorpayOrderId?.replace(/^DEMO-/, '') || '—'}
                    </td>
                    <td className="px-4 py-3 text-port-dark font-bold text-[11px]">
                      {p.razorpayPaymentId?.replace(/^DEMO-/, '') || <span className="text-port-gray font-normal">Awaiting Auth</span>}
                    </td>
                    <td className="px-4 py-3 text-port-gray text-[11px]">
                      {p.method?.startsWith('DEMO-') ? 'QR payment' : p.method}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={p.status} />
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
