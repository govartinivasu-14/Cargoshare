import React, { useState } from 'react';
import {
  IconShip,
  IconTrain,
  IconTruck,
  IconPlane,
  IconAlertTriangle,
  IconPlus,
  IconCheck
} from '@tabler/icons-react';
import StatusBadge from './StatusBadge';

export default function ContainerForm({
  initialData = {},
  onSubmit,
  providerStatus = 'APPROVED',
  isEdit = false,
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    containerNumber: initialData.containerNumber || '',
    mode: initialData.mode || 'SEA',
    origin: initialData.origin || '',
    destination: initialData.destination || '',
    vesselFlightTrain: initialData.vesselFlightTrain || '',
    totalCapacity: initialData.totalCapacity || 68.0,
    availableCapacity: initialData.availableCapacity !== undefined ? initialData.availableCapacity : (initialData.totalCapacity || 68.0),
    pricePerCbm: initialData.pricePerCbm || 140.0,
    departureDate: initialData.departureDate ? initialData.departureDate.slice(0, 10) : '',
    arrivalDate: initialData.arrivalDate ? initialData.arrivalDate.slice(0, 10) : '',
    cutoffDate: initialData.cutoffDate ? initialData.cutoffDate.slice(0, 10) : '',
    cargoRestrictions: initialData.cargoRestrictions || 'General commercial crated cargo',
    temperatureControlled: initialData.temperatureControlled || false,
    status: initialData.status || 'AVAILABLE',
  });

  const [errors, setErrors] = useState({});

  if (providerStatus !== 'APPROVED') {
    return (
      <div className="bg-white border-2 border-port-amber/60 rounded-[2px] p-6 max-w-2xl text-left shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <IconAlertTriangle size={24} className="text-port-amber" />
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark">
            Carrier Publishing Gated — Verification Required
          </h3>
          <StatusBadge status={providerStatus} />
        </div>

        <p className="text-xs text-port-gray leading-relaxed mb-4">
          Your logistics provider credentials are currently in{' '}
          <strong className="text-port-amber font-mono font-semibold">{providerStatus}</strong> review status. Platform maritime compliance mandates that all NVOCC licenses, CMR haulage permits, and vessel slot allotments be vetted by port admin before fractional space can be published.
        </p>

        <div className="p-3 bg-[#FAF8F5] border border-port-gray/30 rounded-[2px] text-[11px] font-mono text-port-grayLight">
          Status: Awaiting administrative compliance audit. You will receive an authorization clearance once approved.
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.origin.trim()) newErrors.origin = 'Origin terminal is mandatory';
    if (!formData.destination.trim()) newErrors.destination = 'Destination terminal is mandatory';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date required';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date required';
    if (Number(formData.totalCapacity) <= 0) newErrors.totalCapacity = 'Capacity must exceed 0 CBM';
    if (Number(formData.pricePerCbm) <= 0) newErrors.pricePerCbm = 'Price per CBM must exceed 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm max-w-3xl text-left">
      <div className="pb-4 mb-5 border-b border-[#E7E2D6] flex justify-between items-center">
        <div>
          <h3 className="font-heading font-bold text-base uppercase tracking-wider text-port-dark">
            {isEdit ? 'Update Container Capacity Manifest' : 'Register Fractional Container Space'}
          </h3>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            ISO 668 standardized slot declaration for multimodal freight
          </p>
        </div>
        <StatusBadge status="APPROVED" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Multimodal Transport Mode <span className="text-port-rust">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'SEA', label: 'Sea', icon: IconShip },
              { id: 'RAIL', label: 'Rail', icon: IconTrain },
              { id: 'ROAD', label: 'Road', icon: IconTruck },
              { id: 'AIR', label: 'Air', icon: IconPlane },
            ].map((m) => {
              const Icon = m.icon;
              const selected = formData.mode === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleChange('mode', m.id)}
                  className={`py-2 flex flex-col items-center justify-center border rounded-[2px] text-xs font-heading font-semibold uppercase transition-all ${
                    selected
                      ? 'bg-port-dark text-white border-port-dark'
                      : 'bg-[#FAF8F5] text-port-gray border-port-gray/30 hover:border-port-gray'
                  }`}
                >
                  <Icon size={16} className="mb-0.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Container Number (Optional or auto) */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Container / Unit ID (BIC Code)
          </label>
          <input
            type="text"
            placeholder="e.g. MSKU-948210-4 or leave blank for auto"
            value={formData.containerNumber}
            onChange={(e) => handleChange('containerNumber', e.target.value)}
            className="w-full text-xs font-mono p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Origin */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Origin Port / Terminal <span className="text-port-rust">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rotterdam Port (NLRTM)"
            value={formData.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.origin && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.origin}</p>}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Destination Port / Terminal <span className="text-port-rust">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Jebel Ali Port, Dubai (AEJEA)"
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.destination && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.destination}</p>}
        </div>

        {/* Vessel / Flight / Train */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Carrier Designation / Vessel / Flight / Train Voyage ID
          </label>
          <input
            type="text"
            placeholder="e.g. Vessel: CMA CGM Jacques Saadé (Voyage 241E)"
            value={formData.vesselFlightTrain}
            onChange={(e) => handleChange('vesselFlightTrain', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Total Capacity CBM */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Total Container Capacity (CBM) <span className="text-port-rust">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="120"
            value={formData.totalCapacity}
            onChange={(e) => handleChange('totalCapacity', parseFloat(e.target.value) || 0)}
            className="w-full text-xs font-mono p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.totalCapacity && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.totalCapacity}</p>}
        </div>

        {/* Available Capacity (if edit or partial) */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Initial Available Capacity (CBM)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max={formData.totalCapacity}
            value={formData.availableCapacity}
            onChange={(e) => handleChange('availableCapacity', parseFloat(e.target.value) || 0)}
            className="w-full text-xs font-mono p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Price per CBM */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Rate per CBM (USD) <span className="text-port-rust">*</span>
          </label>
          <input
            type="number"
            step="1"
            min="1"
            value={formData.pricePerCbm}
            onChange={(e) => handleChange('pricePerCbm', parseFloat(e.target.value) || 0)}
            className="w-full text-xs font-mono p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.pricePerCbm && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.pricePerCbm}</p>}
        </div>

        {/* Status (If editing) */}
        {isEdit && (
          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Operational Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="FULL">FULL</option>
              <option value="DEPARTED">DEPARTED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        )}

        {/* Departure Date */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Departure Date <span className="text-port-rust">*</span>
          </label>
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleChange('departureDate', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.departureDate && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.departureDate}</p>}
        </div>

        {/* Arrival Date */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Arrival Date <span className="text-port-rust">*</span>
          </label>
          <input
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => handleChange('arrivalDate', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.arrivalDate && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.arrivalDate}</p>}
        </div>

        {/* Cutoff Date */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Cargo Cut-off & Terminal Gate-in Deadline
          </label>
          <input
            type="date"
            value={formData.cutoffDate}
            onChange={(e) => handleChange('cutoffDate', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Cargo Restrictions */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Cargo Acceptance Guidelines / Restrictions
          </label>
          <textarea
            rows={2}
            value={formData.cargoRestrictions}
            onChange={(e) => handleChange('cargoRestrictions', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Temperature Controlled Checkbox */}
        <div className="md:col-span-2 flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="tempControlled"
            checked={formData.temperatureControlled}
            onChange={(e) => handleChange('temperatureControlled', e.target.checked)}
            className="rounded-[2px] text-port-teal focus:ring-port-teal"
          />
          <label htmlFor="tempControlled" className="text-xs font-mono text-port-dark cursor-pointer select-none">
            Temperature-controlled Reefer Unit (Active Genset Monitored)
          </label>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E7E2D6] flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
        >
          {isEdit ? <IconCheck size={16} /> : <IconPlus size={16} />}
          <span>{submitting ? 'Publishing...' : isEdit ? 'Save Changes' : 'Publish Container Space'}</span>
        </button>
      </div>
    </form>
  );
}
