import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages (5)
import Home from './pages/public/Home';
import About from './pages/public/About';
import Login from './pages/public/Login';
import TraderRegister from './pages/public/TraderRegister';
import ProviderRegister from './pages/public/ProviderRegister';

// Trader Pages (8)
import TraderDashboard from './pages/trader/TraderDashboard';
import SearchContainers from './pages/trader/SearchContainers';
import ContainerDetails from './pages/trader/ContainerDetails';
import BookingPage from './pages/trader/BookingPage';
import PaymentPage from './pages/trader/PaymentPage';
import MyBookings from './pages/trader/MyBookings';
import BookingDetails from './pages/trader/BookingDetails';
import TraderChat from './pages/trader/TraderChat';

// Provider Pages (5)
import ProviderDashboard from './pages/provider/ProviderDashboard';
import AddContainer from './pages/provider/AddContainer';
import ManageContainers from './pages/provider/ManageContainers';
import ProviderBookings from './pages/provider/ProviderBookings';
import ProviderChat from './pages/provider/ProviderChat';

// Admin Pages (7)
import AdminDashboard from './pages/admin/AdminDashboard';
import ProviderApplications from './pages/admin/ProviderApplications';
import ProviderInspection from './pages/admin/ProviderInspection';
import ManageUsers from './pages/admin/ManageUsers';
import AdminContainers from './pages/admin/AdminContainers';
import AdminBookings from './pages/admin/AdminBookings';
import PaymentMonitoring from './pages/admin/PaymentMonitoring';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-port-light text-port-dark selection:bg-port-orange selection:text-white">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/marketplace" element={<ProtectedRoute roles={['TRADER', 'PROVIDER']}><SearchContainers /></ProtectedRoute>} />
              {/* Public Routes (5) */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/trader" element={<TraderRegister />} />
              <Route path="/register/provider" element={<ProviderRegister />} />

              {/* Trader Routes (8) */}
              <Route
                path="/trader"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <TraderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/search"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <SearchContainers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/containers/:id"
                element={
                  <ProtectedRoute roles={['TRADER', 'PROVIDER']}>
                    <ContainerDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/book/:containerId"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/payment/:bookingId"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/bookings"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/bookings/:id"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trader/chat"
                element={
                  <ProtectedRoute roles={['TRADER']}>
                    <TraderChat />
                  </ProtectedRoute>
                }
              />

              {/* Provider Routes (5) */}
              <Route
                path="/provider"
                element={
                  <ProtectedRoute roles={['PROVIDER']}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/containers/new"
                element={
                  <ProtectedRoute roles={['PROVIDER']}>
                    <AddContainer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/containers"
                element={
                  <ProtectedRoute roles={['PROVIDER']}>
                    <ManageContainers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/bookings"
                element={
                  <ProtectedRoute roles={['PROVIDER']}>
                    <ProviderBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/chat"
                element={
                  <ProtectedRoute roles={['PROVIDER']}>
                    <ProviderChat />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes (7) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ProviderApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications/:id"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ProviderInspection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/containers"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminContainers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <PaymentMonitoring />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Industrial Port Footer */}
          <footer className="bg-port-dark text-port-light border-t border-port-gray/30 py-6 px-4 font-mono text-xs text-center sm:text-left">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-port-grayLight text-[11px]">
              <div>
                <span className="font-heading font-bold text-white uppercase tracking-wider">
                  Cargo<span className="text-port-orange">Share</span>
                </span>
                <span className="mx-2">•</span>
                <span>ISO 668 Fractional Container Allocation Marketplace</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Shared container marketplace</span>
                <span>•</span>
                <span>QR payments</span>
                <span>•</span>
                <span>Provider inspection workflow</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
