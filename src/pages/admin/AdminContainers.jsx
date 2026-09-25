import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CapacityBar from '../../components/CapacityBar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { toArray } from '../../services/response';
import { IconShip, IconFilter } from '@tabler/icons-react';

export default function AdminContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchContainers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/containers');
        setContainers(toArray(res.data));
      } catch (err) {
        console.warn('Failed to load containers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContainers();
  }, []);

  const filtered = statusFilter === 'ALL'
    ? containers
    : containers.filter((c) => c.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Fleet Telematics Oversight
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Global Container Manifest Fleet
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Platform-wide inventory of all fractional container slots across Sea, Rail, Road, and Air
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase text-port-gray mr-2 flex items-center gap-1">
          <IconFilter size={14} /> Filter Status:
        </span>
        {['ALL', 'AVAILABLE', 'FULL', 'DEPARTED', 'CLOSED'].map((s) => (
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

      {/* Container Ledger Table */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Querying all registered container inventory...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Containers Found"
            description={`No containers registered in status ${statusFilter}.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Unit Number</th>
                  <th className="px-4 py-3">Carrier Provider</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Corridor</th>
                  <th className="px-4 py-3 w-56">Capacity Status</th>
                  <th className="px-4 py-3">Rate / CBM</th>
                  <th className="px-4 py-3">Departure Date</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark text-sm">{c.containerNumber}</div>
                      <div className="text-[10px] text-port-grayLight">{c.id}</div>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark truncate max-w-[150px]">{c.providerName}</div>
                      <div className="text-[10px] text-port-gray font-mono">{c.vesselFlightTrain}</div>
                    </td>
                    <td className="px-4 py-3 font-sans font-bold text-port-teal">
                      {c.mode}
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
                    <td className="px-4 py-3 text-port-gray">
                      {new Date(c.departureDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={c.status} />
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
