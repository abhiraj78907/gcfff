import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "@/types/entities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleToDefaultPath: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  receptionist: "/receptionist",
  doctor: "/doctor",
  "lab-tech": "/lab",
  pharmacist: "/pharmacy",
  patient: "/patient",
};

export const RoleSwitcher = () => {
  // Dev-only feature toggle via env var
  const enabled = (import.meta as any).env?.VITE_ENABLE_ROLE_SWITCHER === "true";
  if (!enabled) return null;

  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginAs } = useAuth();
  const activeRole = user?.roles?.[0] as UserRole | undefined;

  const roles: UserRole[] = useMemo(() => [
    "admin",
    "receptionist",
    "doctor",
    "lab-tech",
    "pharmacist",
    "patient",
  ], []);

  const onChange = (nextRole: UserRole) => {
    // Update mock auth roles
    loginAs([nextRole]);
    try {
      window.localStorage.setItem("activeRole", nextRole);
    } catch {}
    // Redirect to role's default dashboard if current path is not allowed or mismatched
    const target = roleToDefaultPath[nextRole] || "/";
    // If switching within the same role namespace, remain; else go to default
    const isSameNamespace = location.pathname.startsWith(roleToDefaultPath[nextRole]);
    navigate(isSameNamespace ? location.pathname : target, { replace: true });
  };

  // Load from localStorage on mount if differs
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("activeRole") as UserRole | null;
      if (stored && stored !== activeRole) {
        // Apply stored role silently and remain on current page if valid
        loginAs([stored]);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts: Alt+1..6 map to roles order
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const map: Record<string, UserRole> = {
        "1": roles[0],
        "2": roles[1],
        "3": roles[2],
        "4": roles[3],
        "5": roles[4],
        "6": roles[5],
      };
      const key = e.key;
      const targetRole = map[key];
      if (targetRole) {
        e.preventDefault();
        onChange(targetRole);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [roles, onChange]);

  return (
    <div className="w-48">
      <Select value={activeRole} onValueChange={(v) => onChange(v as UserRole)}>
        <SelectTrigger aria-label="Select active role" className="aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive" role="combobox">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r} value={r} aria-selected={activeRole === r} aria-label={`Switch to role ${r}`}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


