/**
 * Route Guard for Admin Pages
 * Ensures only users with admin role can access admin routes
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@shared/contexts/AuthContext";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { hasRole, user } = useAuth();

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/onboard/login" replace />;
  }

  // Check if user has admin role
  if (!hasRole("admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

