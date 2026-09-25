import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { toArray } from '../../services/response';
import {
  IconShieldCheck,
  IconClock,
  IconArrowRight,
  IconFileCertificate,
  IconFilter
} from '@tabler/icons-react';

export default function ProviderApplications() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('PENDING');

  const fetchProviders = async (status = selectedStatus) => {
    setLoading(true);
    try {
      const url = status === 'ALL' ? '/admin/providers' : `/admin/providers?status=${status}`;
      const res = await api.get(url);
      setProviders(toArray(res.data));
    } catch (err) {
      console.warn('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(selectedStatus);
  }, [selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Regulatory Compliance Audit
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Logistics Provider Applications
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Audit carrier licensing, IMO/FMC credentials, and authorize fractional container listing rights
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase text-port-gray mr-2 flex items-center gap-1">
          <IconFilter size={14} /> Filter Queue:
        </span>
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            className={`px-3 py-1 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
              selectedStatus === s
                ? 'bg-port-dark text-white'
                : 'bg-white text-port-gray hover:bg-[#FAF8F5] border border-port-gray/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Querying provider application dossiers...
          </div>
        ) : providers.length === 0 ? (
          <EmptyState
            title="No Provider Applications in Queue"
            description={`There are currently no provider applications matching status ${selectedStatus}.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Carrier / Firm</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Operating Corridors</th>
                  <th className="px-4 py-3">Date Applied</th>
                  <th className="px-4 py-3">Audit Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3 font-bold text-port-dark">
                      <div className="text-sm">{p.companyName}</div>
                      <div className="text-[10px] text-port-gray font-normal">{p.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-port-teal font-sans">{p.serviceType} Freight</span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark">{p.contactPerson}</div>
                      <div className="text-[10px] text-port-gray">{p.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-port-dark font-sans max-w-xs truncate">
                      {p.routes || p.operatingLocations}
                    </td>
                    <td className="px-4 py-3 text-port-gray">
                      {p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.providerStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/applications/${p.id}`}
                        className="px-3 py-1.5 bg-port-dark hover:bg-port-darker text-white font-heading font-bold text-[10px] uppercase tracking-wider rounded-[2px] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Inspect Dossier</span>
                        <IconArrowRight size={12} />
                      </Link>
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
