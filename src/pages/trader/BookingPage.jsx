import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CapacityBar from '../../components/CapacityBar';
import StatusBadge from '../../components/StatusBadge';
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCalculator,
  IconShieldCheck,
  IconReceipt
} from '@tabler/icons-react';

export default function BookingPage() {
  const { containerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [spaceRequired, setSpaceRequired] = useState(5.0);
  const [cargoDescription, setCargoDescription] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [clientError, setClientError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const fetchContainer = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/containers/${containerId}`);
        setContainer(res.data);
        // Default space required to sensible min
        if (res.data?.availableCapacity < 5.0) {
          setSpaceRequired(Math.max(1.0, res.data.availableCapacity));
        }
      } catch (err) {
        setServerError('Container manifest could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchContainer();
  }, [containerId]);

  const handleSpaceChange = (val) => {
    const num = parseFloat(val) || 0;
    setSpaceRequired(num);

    if (container) {
      if (num <= 0) {
        setClientError('Required space must be at least 0.5 CBM.');
      } else if (num > container.availableCapacity) {
        setClientError(`Requested space (${num.toFixed(1)} CBM) exceeds available capacity of ${container.availableCapacity.toFixed(1)} CBM.`);
      } else {
        setClientError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Business Rule 3: Client-side validation check
    if (spaceRequired <= 0) {
      setClientError('Minimum booking volume is 0.5 CBM.');
      return;
    }
    if (container && spaceRequired > container.availableCapacity) {
      setClientError(`Cannot submit: Only ${container.availableCapacity.toFixed(1)} CBM is currently available.`);
      return;
    }
    if (!cargoDescription.trim()) {
      setClientError('Please enter a description of the cargo.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        containerId: container.id,
        spaceRequired: spaceRequired,
        cargoDescription,
        weightKg: parseFloat(weightKg) || spaceRequired * 300,
        traderId: user?.id,
        traderName: user?.name,
        traderEmail: user?.email,
        traderPhone: user?.phone,
      };

      const res = await api.post('/bookings', payload);
      const newBooking = res.data;
      // Navigate directly to payment checkout step
      navigate(`/trader/payment/${newBooking.id}`);
    } catch (err) {
      // Business Rule 3: Surface server's authoritative race condition error
      const message = err.response?.data?.message || err.message || 'Booking reservation rejected by container terminal.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-port-gray">
        Preparing space reservation manifest...
      </div>
    );
  }

  if (!container) {
    return (
      <div className="max-w-md mx-auto py-16 text-left">
        <div className="bg-red-50 border border-port-rust/30 p-4 rounded-[2px] text-xs font-mono text-port-rust">
          Target container not found or departed.
        </div>
      </div>
    );
  }

  const computedTotal = (spaceRequired * container.pricePerCbm) || 0;
  const hasError = !!clientError || (spaceRequired > container.availableCapacity);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Breadcrumb */}
      <div className="text-xs font-mono text-port-gray pb-2 border-b border-[#D8D1C3]">
        <Link to={`/trader/containers/${container.id}`} className="hover:underline">
          ← Back to Container {container.containerNumber}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm space-y-4">
            <div className="border-b border-[#E7E2D6] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
                Fractional Cargo Allotment
              </span>
              <h1 className="font-heading font-black text-xl uppercase tracking-tight text-port-dark">
                Reserve Container Space
              </h1>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="p-3 bg-red-50 border border-port-rust/40 rounded-[2px] text-xs text-port-rust font-mono flex items-center gap-2">
                <IconAlertTriangle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Client Error Alert */}
            {clientError && (
              <div className="p-3 bg-amber-50 border border-port-amber/40 rounded-[2px] text-xs text-port-amber font-mono flex items-center gap-2">
                <IconAlertTriangle size={18} />
                <span>{clientError}</span>
              </div>
            )}

            {/* Space Required */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="block text-[10px] font-mono uppercase text-port-gray font-semibold">
                  Required Cargo Volume (CBM) <span className="text-port-rust">*</span>
                </label>
                <span className="text-[10px] font-mono text-port-teal font-semibold">
                  Available: {container.availableCapacity.toFixed(1)} CBM
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max={container.availableCapacity}
                  value={spaceRequired}
                  onChange={(e) => handleSpaceChange(e.target.value)}
                  className={`w-full text-base font-mono font-bold p-2.5 border rounded-[2px] focus:outline-none bg-[#FAF8F5] ${
                    hasError ? 'border-port-rust text-port-rust' : 'border-port-gray/40 focus:border-port-teal'
                  }`}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-port-gray">
                  CBM
                </span>
              </div>
              <p className="text-[10px] text-port-gray font-mono mt-1">
                Validated in real time against container capacity
              </p>
            </div>

            {/* Cargo Description */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                Cargo Description & Packaging <span className="text-port-rust">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 10 Crates of Precision Machine Parts on Euro Pallets"
                value={cargoDescription}
                onChange={(e) => setCargoDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                Estimated Gross Weight (KG)
              </label>
              <input
                type="number"
                placeholder="e.g. 1250"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full text-xs font-mono p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-[#E7E2D6]">
              <button
                type="submit"
                disabled={submitting || hasError}
                className="w-full py-3 bg-port-orange hover:bg-port-orangeHover disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{submitting ? 'Generating Booking...' : 'Proceed to Payment Authorization'}</span>
                <IconArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#D8D1C3] p-5 rounded-[2px] shadow-sm text-left">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-port-dark pb-2 mb-3 border-b border-[#E7E2D6] flex items-center gap-1.5">
              <IconReceipt size={16} className="text-port-teal" />
              <span>Manifest Rate Breakdown</span>
            </h3>

            <div className="space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-port-gray">Voyage Corridor:</span>
                <span className="font-bold text-port-dark truncate max-w-[170px]">{container.origin} → {container.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-port-gray">Container Mode:</span>
                <span className="font-bold text-port-teal">{container.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-port-gray">Rate per CBM:</span>
                <span className="font-bold text-port-dark">${container.pricePerCbm.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-port-gray">Requested Volume:</span>
                <span className="font-bold text-port-dark">{spaceRequired.toFixed(1)} CBM</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-port-gray/30 rounded-[2px] flex justify-between items-baseline mb-4">
              <span className="font-heading font-bold text-xs uppercase text-port-dark">
                Calculated Total:
              </span>
              <span className="font-heading font-black text-2xl text-port-dark tabular-nums">
                ${computedTotal.toFixed(2)} <span className="text-xs font-normal text-port-gray">USD</span>
              </span>
            </div>

            {/* Container Capacity Bar */}
            <div className="pt-2 border-t border-[#E7E2D6]">
              <span className="text-[10px] font-mono text-port-gray block mb-1">
                Remaining Capacity After This Allocation:
              </span>
              <CapacityBar
                total={container.totalCapacity}
                available={Math.max(0, container.availableCapacity - spaceRequired)}
                height="h-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
