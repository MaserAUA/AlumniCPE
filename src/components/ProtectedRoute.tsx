// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/auth_context";

interface ProtectedRouteProps {
  element: React.ReactNode; // The component that will be rendered for the protected route
  requiredRole?: string; // Specify required role for the route (e.g., "admin")
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isAuthenticated, role } = useAuthContext();
  const location = useLocation(); // To remember the location for redirect

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If the role doesn't match the required role, redirect to unauthorized page
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // Otherwise, return the protected route element
  return <>{element}</>;
};

export default ProtectedRoute;
