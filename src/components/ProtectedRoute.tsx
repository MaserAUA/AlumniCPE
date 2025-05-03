// components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/auth_context";

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const location = useLocation();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace/>;
  }

  if (role && requiredRole && role != requiredRole) {
    return <Navigate to="/homeuser" state={{ from: location }} replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
