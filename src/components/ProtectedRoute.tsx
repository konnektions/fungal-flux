import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'customer',
  redirectTo = '/'
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D4A3E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={`/login?returnTo=${location.pathname}`} replace />;
  }

  // Check role permissions, only after loading is complete
  const hasPermission = () => {
    if (loading) {
      return false; // Prevent access until loading is complete
    }

    switch (requiredRole) {
      case 'super_admin':
        return isSuperAdmin;
      case 'admin':
        return isAdmin;
      case 'customer':
        return true; // All authenticated users are customers
      default:
        return false;
    }
  };

  if (!hasPermission()) {
    // If the user is authenticated but doesn't have the required role,
    // redirect them to the specified page. This prevents potential redirect loops.
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}