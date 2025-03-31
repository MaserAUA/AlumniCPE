// src/components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Protected route for admin users only
 * Redirects to login page if not authenticated
 * Redirects to user home page if not an admin
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Redirect to user home page if not an admin
  if (!isAdmin) {
    return <Navigate to="/homeuser" state={{ from: location }} replace />;
  }
  
  // Render children if user is authenticated and is an admin
  return children;
};

export default AdminRoute;