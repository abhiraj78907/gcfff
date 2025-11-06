import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "@/types/entities";

export const RoleRoute = ({ role, children }: { role: UserRole; children: JSX.Element }) => {
  const { hasRole } = useAuth();
  if (!hasRole(role)) {
    const defaultMap: Record<UserRole, string> = {
      admin: "/dashboard/admin",
      receptionist: "/receptionist",
      doctor: "/doctor",
      "lab-tech": "/lab",
      pharmacist: "/pharmacy",
      patient: "/patient",
    };
    // Redirect to the user's home will be handled at layout level; fallback to root
    return <Navigate to={"/onboard/login"} replace />;
  }
  return children;
};


