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
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const location = useLocation(); // To remember the location for redirect
  // console.log(isLoading)

  // if (isLoading) {
  //   return <div>Loading...</div>; // 🔥 Wait until loading is done
  // }

  // If not authenticated, redirect to login page
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If the role doesn't match the required role, redirect to unauthorized page
  if (role && requiredRole && role != requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // Otherwise, return the protected route element
  return <>{element}</>;
};

export default ProtectedRoute;
