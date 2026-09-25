import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-port-light">
        <div className="font-mono text-xs text-port-gray flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-port-orange animate-ping" />
          <span>Authenticating Manifest Clearance...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role check specified and current user's role is not allowed:
  // Redirect to user's respective authorized dashboard
  if (roles.length > 0 && !roles.includes(user.role)) {
    if (user.role === 'TRADER') {
      return <Navigate to="/trader" replace />;
    } else if (user.role === 'PROVIDER') {
      return <Navigate to="/provider" replace />;
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
