import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconBox,
  IconSearch,
  IconLayoutDashboard,
  IconPlus,
  IconShield,
  IconLogout,
  IconUser,
  IconMessage,
  IconMenu2,
  IconX,
  IconBuildingStore,
  IconReceipt,
  IconChecks,
} from '@tabler/icons-react';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-port-dark text-port-light sticky top-0 z-40 border-b border-port-gray/40 shadow-md">
      {/* Top micro-bar: Network status */}
      <div className="bg-port-darker px-4 py-1 text-[10px] font-mono flex items-center justify-between border-b border-port-gray/20">
        <div className="flex items-center gap-3 text-port-grayLight">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-port-teal animate-pulse" />
            <span>CARGOSHARE</span>
          </span>
          <span className="hidden sm:inline text-port-gray">|</span>
          <span className="hidden sm:inline">ISO 668 FREIGHT SHARING TERMINAL</span>
        </div>

      </div>

      {isAuthenticated && <Link className="block px-4 py-1 text-xs underline" to="/marketplace">Browse all container space</Link>}
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-port-orange rounded-[2px] flex items-center justify-center text-white font-heading font-black tracking-tighter shadow-sm group-hover:bg-port-orangeHover transition-colors">
                CS
              </div>
              <div className="leading-tight">
                <span className="font-heading font-bold text-lg tracking-wider text-white">
                  CARGO<span className="text-port-orange">SHARE</span>
                </span>
                <span className="block font-mono text-[9px] text-port-grayLight tracking-widest uppercase">
                  Container Capacity Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Role-Aware) */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Public Links */}
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                isActive('/') ? 'text-port-orange bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                isActive('/about') ? 'text-port-orange bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
              }`}
            >
              About
            </Link>

            {/* TRADER LINKS */}
            {user?.role === 'TRADER' && (
              <>
                <Link
                  to="/trader"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/trader') ? 'text-port-orange bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/trader/search"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/trader/search') ? 'text-port-orange bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Search Space
                </Link>
                <Link
                  to="/trader/bookings"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/trader/bookings') ? 'text-port-orange bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/trader/chat"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/trader/chat') ? 'text-port-orange bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Provider Chat
                </Link>
              </>
            )}

            {/* PROVIDER LINKS */}
            {user?.role === 'PROVIDER' && (
              <>
                <Link
                  to="/provider"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/provider') ? 'text-port-teal bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Operations
                </Link>
                <Link
                  to="/provider/containers/new"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/provider/containers/new') ? 'text-port-teal bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  + Add Container
                </Link>
                <Link
                  to="/provider/containers"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/provider/containers') ? 'text-port-teal bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Manage Fleet
                </Link>
                <Link
                  to="/provider/bookings"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/provider/bookings') ? 'text-port-teal bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  to="/provider/chat"
                  className={`px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/provider/chat') ? 'text-port-teal bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Trader Chat
                </Link>
              </>
            )}

            {/* ADMIN LINKS */}
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin"
                  className={`px-2.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/admin') ? 'text-purple-400 bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/admin/applications"
                  className={`px-2.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors relative ${
                    isActive('/admin/applications') ? 'text-purple-400 bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Applications
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-2.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/admin/users') ? 'text-purple-400 bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/containers"
                  className={`px-2.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/admin/containers') ? 'text-purple-400 bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Containers
                </Link>
                <Link
                  to="/admin/bookings"
                  className={`px-2.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/admin/bookings') ? 'text-purple-400 bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  to="/admin/payments"
                  className={`px-2.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
                    isActive('/admin/payments') ? 'text-purple-400 bg-[#18283E]' : 'text-port-light hover:text-white hover:bg-[#18283E]'
                  }`}
                >
                  Payments
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Auth Area */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-port-gray/40 pl-3">
                <div className="text-right">
                  <div className="font-heading font-bold text-xs text-white truncate max-w-[130px]">
                    {user.name}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-port-grayLight">{user.role}</span>
                    {user.role === 'PROVIDER' && (
                      <StatusBadge status={user.providerStatus || 'PENDING'} />
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-port-grayLight hover:text-port-orange hover:bg-[#18283E] rounded-[2px] transition-colors"
                  title="Sign Out"
                >
                  <IconLogout size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-white hover:bg-[#18283E] rounded-[2px] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register/trader"
                  className="px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-white bg-port-orange hover:bg-port-orangeHover rounded-[2px] transition-colors shadow-sm"
                >
                  Register Trader
                </Link>
                <Link
                  to="/register/provider"
                  className="px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-port-light border border-port-gray hover:bg-[#18283E] rounded-[2px] transition-colors"
                >
                  Join as Carrier
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-port-light hover:text-white"
            >
              {mobileMenuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-port-darker border-t border-port-gray/30 px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-heading font-semibold uppercase tracking-wider text-port-light hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-heading font-semibold uppercase tracking-wider text-port-light hover:text-white"
          >
            About
          </Link>

          {user?.role === 'TRADER' && (
            <>
              <Link to="/trader" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-orange">Trader Dashboard</Link>
              <Link to="/trader/search" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Search Containers</Link>
              <Link to="/trader/bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">My Bookings</Link>
              <Link to="/trader/chat" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Carrier Chat</Link>
            </>
          )}

          {user?.role === 'PROVIDER' && (
            <>
              <Link to="/provider" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-teal">Provider Dashboard</Link>
              <Link to="/provider/containers/new" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">+ Add Container</Link>
              <Link to="/provider/containers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Manage Fleet</Link>
              <Link to="/provider/bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Provider Bookings</Link>
              <Link to="/provider/chat" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Trader Chat</Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-purple-400">Admin Dashboard</Link>
              <Link to="/admin/applications" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Applications</Link>
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Manage Users</Link>
              <Link to="/admin/containers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Containers</Link>
              <Link to="/admin/bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Bookings</Link>
              <Link to="/admin/payments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-heading font-semibold uppercase text-port-light">Payments</Link>
            </>
          )}

          <div className="pt-4 border-t border-port-gray/30">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">{user.name}</div>
                  <div className="text-[10px] text-port-grayLight">{user.email}</div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1 bg-port-rust text-white text-xs font-heading font-semibold rounded-[2px]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-xs font-heading font-bold text-white border border-port-gray rounded-[2px]">Log In</Link>
                <Link to="/register/trader" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-xs font-heading font-bold bg-port-orange text-white rounded-[2px]">Register Trader</Link>
                <Link to="/register/provider" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-xs font-heading font-bold bg-port-teal text-white rounded-[2px]">Carrier Registration</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
