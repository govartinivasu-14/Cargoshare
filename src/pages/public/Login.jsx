import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconLock,
  IconMail,
  IconArrowRight,
  IconAlertTriangle,
  IconShield,
  IconUser,
  IconTruck
} from '@tabler/icons-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate email and security password');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      const user = result.user;
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'PROVIDER') {
        navigate('/provider');
      } else {
        navigate('/trader');
      }
    } else {
      setError(result.message || 'Authentication credentials rejected.');
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left">
      <div className="bg-white border border-[#D8D1C3] p-6 sm:p-8 rounded-[2px] shadow-sm">
        <div className="border-b border-[#E7E2D6] pb-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-[1px] bg-port-orange" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray">
              Unified Portal Access
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            CargoShare Terminal Login
          </h1>
          <p className="text-xs text-port-gray font-mono mt-1">
            Single entry gate for Traders, Logistics Providers, and Port Admin
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-port-rust/30 rounded-[2px] text-xs text-port-rust flex items-center gap-2 font-mono">
            <IconAlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Authorized Email Identifier
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. trader@cargoshare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 pl-9 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
              />
              <IconMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-port-grayLight" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
              Security Key / Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 pl-9 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
              />
              <IconLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-port-grayLight" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-port-orange hover:bg-port-orangeHover text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>{submitting ? 'Verifying Credentials...' : 'Authenticate & Enter Portal'}</span>
            <IconArrowRight size={16} />
          </button>
        </form>

        {/* Instant Demo Credential Fillers */}
        <div className="mt-8 pt-5 border-t border-[#E7E2D6]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-port-gray block mb-2 font-semibold">
            Quick-fill account credentials:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleQuickFill('trader@cargoshare.com', 'password123')}
              className="p-2 border border-port-gray/30 rounded-[2px] bg-[#FAF8F5] hover:bg-[#E7E2D6] text-left transition-colors"
            >
              <div className="font-heading font-bold text-xs text-port-dark">Trader</div>
              <div className="text-[10px] text-port-gray truncate">trader@cargoshare.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('provider@cargoshare.com', 'password123')}
              className="p-2 border border-port-gray/30 rounded-[2px] bg-[#FAF8F5] hover:bg-[#E7E2D6] text-left transition-colors"
            >
              <div className="font-heading font-bold text-xs text-port-teal">Provider (Vetted)</div>
              <div className="text-[10px] text-port-gray truncate">provider@cargoshare.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('vanguard@applicant.com', 'password123')}
              className="p-2 border border-port-gray/30 rounded-[2px] bg-[#FAF8F5] hover:bg-[#E7E2D6] text-left transition-colors"
            >
              <div className="font-heading font-bold text-xs text-port-amber">Provider (Pending)</div>
              <div className="text-[10px] text-port-gray truncate">vanguard@applicant.com</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@cargoshare.com', 'password123')}
              className="p-2 border border-port-gray/30 rounded-[2px] bg-[#FAF8F5] hover:bg-[#E7E2D6] text-left transition-colors"
            >
              <div className="font-heading font-bold text-xs text-purple-700">Port Admin</div>
              <div className="text-[10px] text-port-gray truncate">admin@cargoshare.com</div>
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 text-center text-xs font-mono text-port-gray space-y-1">
          <div>
            Need to book cargo space?{' '}
            <Link to="/register/trader" className="text-port-orange font-bold hover:underline">
              Register as Trader
            </Link>
          </div>
          <div>
            Have fractional capacity to list?{' '}
            <Link to="/register/provider" className="text-port-teal font-bold hover:underline">
              Apply as Logistics Provider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
