import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { UserProfile, UserRole } from "@/types/entities";

type AuthContextValue = {
  user: UserProfile | null;
  login: (payload: { roles: UserRole[]; entityId?: string | null; subEntryId?: string | null; primaryRole?: UserRole }) => void;
  loginAs: (roles: UserRole[]) => void; // mock login - kept for dev switcher
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  activeRole: UserRole | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUserBase: UserProfile = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@medichain.dev",
  roles: ["admin"],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize role from localStorage if present
  const storedRole = (typeof window !== "undefined" && window.localStorage.getItem("activeRole")) as UserRole | null;
  const storedEntity = (typeof window !== "undefined" && window.localStorage.getItem("entityId")) || null;
  const storedSubEntry = (typeof window !== "undefined" && window.localStorage.getItem("subEntryId")) || null;
  const initialUser: UserProfile = storedRole ? { ...mockUserBase, roles: [storedRole], primaryRole: storedRole || undefined, entityId: storedEntity, subEntryId: storedSubEntry } : mockUserBase;
  const [user, setUser] = useState<UserProfile | null>(initialUser);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    activeRole: (user?.primaryRole as UserRole | undefined) ?? user?.roles?.[0] ?? null,
    login: ({ roles, entityId = null, subEntryId = null, primaryRole }) => {
      const next: UserProfile = { ...mockUserBase, roles, entityId, subEntryId, primaryRole: primaryRole ?? roles[0] };
      try {
        window.localStorage.setItem("activeRole", next.primaryRole!);
        if (entityId) window.localStorage.setItem("entityId", entityId);
        if (subEntryId) window.localStorage.setItem("subEntryId", subEntryId);
      } catch {}
      setUser(next);
    },
    loginAs: (roles: UserRole[]) => setUser((prev) => {
      const next: UserProfile = { ...(prev ?? mockUserBase), roles, primaryRole: roles[0] };
      try { window.localStorage.setItem("activeRole", roles[0]); } catch {}
      return next;
    }),
    logout: () => {
      try {
        window.localStorage.removeItem("activeRole");
        window.localStorage.removeItem("entityId");
        window.localStorage.removeItem("subEntryId");
      } catch {}
      setUser(null);
    },
    hasRole: (role: UserRole) => Boolean(user?.roles.includes(role)),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


