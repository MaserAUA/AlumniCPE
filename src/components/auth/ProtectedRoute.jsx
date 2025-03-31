// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Protected route that only allows authenticated users
 * Redirects to login page if not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
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
    // Store the location user was trying to access for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Render children if user is authenticated
  return children;
};

export default ProtectedRoute;