import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toArray } from '../../services/response';
import { wsService } from '../../services/websocket';
import { useAuth } from '../../context/AuthContext';
import SearchFilters from '../../components/SearchFilters';
import ContainerCard from '../../components/ContainerCard';
import EmptyState from '../../components/EmptyState';
import { IconFilter, IconSparkles } from '@tabler/icons-react';

export default function SearchContainers() {
  const { user } = useAuth();
  const [containers, setContainers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    mode: '',
    minSpace: '',
    departureDate: '',
  });

  const fetchContainers = async (currentFilters = filters) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (currentFilters.origin) params.append('origin', currentFilters.origin);
      if (currentFilters.destination) params.append('destination', currentFilters.destination);
      if (currentFilters.mode) params.append('mode', currentFilters.mode);
      if (currentFilters.minSpace) params.append('minSpace', currentFilters.minSpace);
      if (currentFilters.departureDate) params.append('departureDate', currentFilters.departureDate + 'T00:00:00');

      const res = await api.get(`/containers/search?${params.toString()}`);
      // Sort by match score descending
      const sorted = toArray(res.data).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      setContainers(sorted);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load live availability. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  useEffect(() => wsService.subscribeToContainer('all', () => fetchContainers(filters)), [filters]);

  const handleReset = () => {
    const cleared = {
      origin: '',
      destination: '',
      mode: '',
      minSpace: '',
      departureDate: '',
    };
    setFilters(cleared);
    fetchContainers(cleared);
  };

  const bestMatchCount = containers.filter((c) => c.matchScore >= 90).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="pb-3 border-b border-[#D8D1C3] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Multimodal Ledger Search
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Find Fractional Container Capacity
          </h1>
        </div>
        <div className="text-xs font-mono text-port-gray">
          Showing <span className="font-bold text-port-dark">{containers.length}</span> Active Container Slots
          {bestMatchCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 text-port-teal font-semibold">
              <IconSparkles size={13} /> {bestMatchCount} High Match Scores
            </span>
          )}
        </div>
      </div>

      {error && <p role="alert" className="text-red-800 bg-red-50 p-3">{error}</p>}
      {/* Filters */}
      <SearchFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        onSearch={() => fetchContainers(filters)}
      />

      {/* Ledger Results */}
      <div>
        <div className="text-[10px] font-mono uppercase text-port-gray mb-2 flex items-center justify-between">
          <span>Container Voyage Ledger (Horizontal Manifest View)</span>
          <span>Prices in USD / Net Volume in CBM</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray bg-white border border-[#D8D1C3] rounded-[2px]">
            Scanning carrier vessel schedules and intermodal rail departures...
          </div>
        ) : containers.length === 0 ? (
          <EmptyState
            title="No Matching Container Space Found"
            description="No current scheduled container has open capacity matching these exact route or space constraints. Try relaxing your filters or selecting 'All Modes'."
            actionText="Reset Search Parameters"
            onAction={handleReset}
          />
        ) : (
          <div className="space-y-2">
            {containers.map((container) => (
              <ContainerCard key={container.id} container={container} isTrader={user?.role === 'TRADER'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
