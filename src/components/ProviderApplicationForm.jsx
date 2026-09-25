import React, { useState } from 'react';
import {
  IconBuildingStore,
  IconShip,
  IconTrain,
  IconTruck,
  IconPlane,
  IconShieldLock,
  IconCheck,
  IconClock
} from '@tabler/icons-react';
import StatusBadge from './StatusBadge';

export default function ProviderApplicationForm({ onSubmit, submitting = false }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    serviceType: 'SEA',
    operatingLocations: '',
    routes: '',
    companyDetails: '',
    supportingInfo: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid corporate email required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact phone required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.operatingLocations.trim()) newErrors.operatingLocations = 'Primary operating locations required';
    if (!formData.routes.trim()) newErrors.routes = 'Serviced corridors / routes required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData, () => {
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div className="bg-white border border-port-amber p-8 rounded-[2px] shadow-sm max-w-2xl mx-auto text-left">
        <div className="flex items-center gap-2 mb-3 text-port-amber">
          <IconClock size={24} />
          <h3 className="font-heading font-bold text-base uppercase tracking-wider text-port-dark">
            Application Pending Admin Review
          </h3>
          <StatusBadge status="PENDING" />
        </div>

        <p className="text-xs text-port-gray leading-relaxed mb-4">
          Your carrier verification dossier for <strong className="text-port-dark font-mono">{formData.companyName}</strong> has been registered in the platform audit queue. Our compliance desk vets all NVOCC licenses, CMR carriage certificates, and FMC bond authorizations before container space publishing privileges are unlocked.
        </p>

        <div className="bg-[#FAF8F5] border border-port-gray/30 p-3.5 rounded-[2px] font-mono text-[11px] space-y-1 text-port-dark">
          <div><span className="text-port-gray">Registered Email:</span> {formData.email}</div>
          <div><span className="text-port-gray">Primary Mode:</span> {formData.serviceType} Freight</div>
          <div><span className="text-port-gray">Status:</span> <span className="text-port-amber font-semibold">UNDER INSPECTION</span></div>
        </div>

        <div className="mt-6">
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-port-dark text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-port-darker transition-colors"
          >
            Go to Authentication
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm max-w-3xl mx-auto text-left">
      <div className="pb-4 mb-5 border-b border-[#E7E2D6]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg uppercase tracking-wider text-port-dark">
              Logistics Provider Vetting Dossier
            </h2>
            <p className="text-xs text-port-gray font-mono mt-0.5">
              Apply to list fractional multimodal container space across global ports
            </p>
          </div>
          <StatusBadge status="PENDING" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Registered Carrier / Company Name <span className="text-port-rust">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Apex Oceanic Freight Co."
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.companyName && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.companyName}</p>}
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Authorized Contact Representative <span className="text-port-rust">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Marcus Vance"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.contactPerson && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.contactPerson}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Corporate Email Address <span className="text-port-rust">*</span>
          </label>
          <input
            type="email"
            placeholder="dispatch@apex-freight.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.email && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Operations Phone Line <span className="text-port-rust">*</span>
          </label>
          <input
            type="tel"
            placeholder="+31 10 492 8812"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.phone && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.phone}</p>}
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Portal Access Password <span className="text-port-rust">*</span>
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.password && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.password}</p>}
        </div>

        {/* Service Type */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Primary Mode of Cargo Freight Operations <span className="text-port-rust">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'SEA', label: 'Sea Ocean', icon: IconShip },
              { id: 'RAIL', label: 'Rail Freight', icon: IconTrain },
              { id: 'ROAD', label: 'Road Haulage', icon: IconTruck },
              { id: 'AIR', label: 'Air Express', icon: IconPlane },
            ].map((m) => {
              const Icon = m.icon;
              const selected = formData.serviceType === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleChange('serviceType', m.id)}
                  className={`py-2.5 flex flex-col items-center justify-center border rounded-[2px] text-xs font-heading font-semibold uppercase transition-all ${
                    selected
                      ? 'bg-port-teal text-white border-port-tealDark'
                      : 'bg-[#FAF8F5] text-port-gray border-port-gray/30 hover:border-port-gray'
                  }`}
                >
                  <Icon size={18} className="mb-1" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Locations */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Hub Terminals / Operating Locations <span className="text-port-rust">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rotterdam, Antwerp, Hamburg, Dubai"
            value={formData.operatingLocations}
            onChange={(e) => handleChange('operatingLocations', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.operatingLocations && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.operatingLocations}</p>}
        </div>

        {/* Routes */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Regular Corridors / Lanes <span className="text-port-rust">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. North Europe — Middle East, Trans-Pacific"
            value={formData.routes}
            onChange={(e) => handleChange('routes', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
          {errors.routes && <p className="text-[10px] text-port-rust mt-1 font-mono">{errors.routes}</p>}
        </div>

        {/* Company Details */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Company Background & Freight Operations Profile
          </label>
          <textarea
            rows={2}
            placeholder="Describe your fleet size, slot charter arrangements, or consolidation depots..."
            value={formData.companyDetails}
            onChange={(e) => handleChange('companyDetails', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>

        {/* Supporting Info (Licensing, FMC, IMO, etc.) */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
            Regulatory Compliance, Licensing & Supporting Accreditation
          </label>
          <textarea
            rows={2}
            placeholder="Include FMC license number, IMO company registry, CMR carrier liability policy, or customs bonded broker credentials..."
            value={formData.supportingInfo}
            onChange={(e) => handleChange('supportingInfo', e.target.value)}
            className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E7E2D6] flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <IconShieldLock size={16} />
          <span>{submitting ? 'Submitting Application...' : 'Submit Carrier Dossier for Vetting'}</span>
        </button>
      </div>
    </form>
  );
}
