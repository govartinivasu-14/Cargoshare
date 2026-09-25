import React from 'react';
import {
  IconSearch,
  IconShip,
  IconTrain,
  IconTruck,
  IconPlane,
  IconFilter,
  IconRotate
} from '@tabler/icons-react';

export default function SearchFilters({
  filters,
  onChange,
  onReset,
  onSearch,
  className = '',
}) {
  const modes = [
    { value: '', label: 'All Modes' },
    { value: 'SEA', label: 'Sea Ocean', icon: IconShip },
    { value: 'RAIL', label: 'Rail Freight', icon: IconTrain },
    { value: 'ROAD', label: 'Road Haulage', icon: IconTruck },
    { value: 'AIR', label: 'Air Express', icon: IconPlane },
  ];

  const handleChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className={`bg-white border border-[#D8D1C3] p-4 rounded-[2px] shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E2D6]">
        <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-port-dark">
          <IconFilter size={16} className="text-port-teal" />
          <span>Container Space Manifest Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-heading font-medium text-port-gray hover:text-port-dark flex items-center gap-1 transition-colors"
        >
          <IconRotate size={13} /> Reset Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Origin */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1">
            Origin Hub / Port
          </label>
          <input
            type="text"
            placeholder="e.g. Rotterdam, Shanghai"
            value={filters.origin || ''}
            onChange={(e) => handleChange('origin', e.target.value)}
            className="w-full text-xs font-sans border border-port-gray/40 rounded-[2px] px-2.5 py-1.5 focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1">
            Destination Hub / Port
          </label>
          <input
            type="text"
            placeholder="e.g. Dubai, Hamburg, Milan"
            value={filters.destination || ''}
            onChange={(e) => handleChange('destination', e.target.value)}
            className="w-full text-xs font-sans border border-port-gray/40 rounded-[2px] px-2.5 py-1.5 focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Transport Mode */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1">
            Transport Mode
          </label>
          <select
            value={filters.mode || ''}
            onChange={(e) => handleChange('mode', e.target.value)}
            className="w-full text-xs font-sans border border-port-gray/40 rounded-[2px] px-2.5 py-1.5 focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          >
            {modes.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Space Required (CBM) */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1">
            Min Space (CBM)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            placeholder="e.g. 5.0"
            value={filters.minSpace || ''}
            onChange={(e) => handleChange('minSpace', e.target.value)}
            className="w-full text-xs font-sans border border-port-gray/40 rounded-[2px] px-2.5 py-1.5 focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1">
            Departing On or After
          </label>
          <input
            type="date"
            value={filters.departureDate || ''}
            onChange={(e) => handleChange('departureDate', e.target.value)}
            className="w-full text-xs font-sans border border-port-gray/40 rounded-[2px] px-2.5 py-1.5 focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>
      </div>

      {/* Action Button */}
      {onSearch && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onSearch}
            className="bg-port-dark text-white hover:bg-port-darker font-heading font-semibold text-xs px-4 py-1.5 rounded-[2px] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <IconSearch size={14} /> Run Live Search
          </button>
        </div>
      )}
    </div>
  );
}
