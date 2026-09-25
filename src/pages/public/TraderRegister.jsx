import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconArrowRight,
  IconAlertTriangle,
  IconBox
} from '@tabler/icons-react';

export default function TraderRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    traderType: 'EXPORTER', // EXPORTER, IMPORTER, BOTH
    company: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerTrader } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all mandatory fields');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await registerTrader(formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/trader');
    } else {
      setError(result.message || 'Registration could not be completed.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 text-left">
      <div className="bg-white border border-[#D8D1C3] p-6 sm:p-8 rounded-[2px] shadow-sm">
        <div className="border-b border-[#E7E2D6] pb-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-[1px] bg-port-orange" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray">
              Instant Trader Activation
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Exporter & Importer Registration
          </h1>
          <p className="text-xs text-port-gray font-mono mt-1">
            Immediate access to search, reserve, and settle fractional container space
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-port-rust/30 rounded-[2px] text-xs text-port-rust flex items-center gap-2 font-mono">
            <IconAlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Trader Full Legal Name <span className="text-port-rust">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Rostova"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-2.5 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Company / Trading Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rostova Specialty Glassware GmbH"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full text-xs p-2.5 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                Corporate Email <span className="text-port-rust">*</span>
              </label>
              <input
                type="email"
                placeholder="trade@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-2.5 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                Phone Contact
              </label>
              <input
                type="tel"
                placeholder="+49 170 8291039"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs p-2.5 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Primary Trade Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['EXPORTER', 'IMPORTER', 'BOTH'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, traderType: type })}
                  className={`py-2 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] border transition-colors ${
                    formData.traderType === type
                      ? 'bg-port-dark text-white border-port-dark'
                      : 'bg-[#FAF8F5] text-port-gray border-port-gray/30 hover:border-port-gray'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Access Password <span className="text-port-rust">*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full text-xs p-2.5 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>{submitting ? 'Registering Trader Account...' : 'Create Trader Account & Enter Terminal'}</span>
            <IconArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E7E2D6] text-center text-xs font-mono text-port-gray">
          Already registered?{' '}
          <Link to="/login" className="text-port-orange font-bold hover:underline">
            Terminal Login
          </Link>
        </div>
      </div>
    </div>
  );
}
