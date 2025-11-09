import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { UserProfile, UserRole } from "@/types/entities";
import { getFirebase } from "../lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { fetchUserProfile, createUserProfile } from "../lib/userProfile";

type AuthContextValue = {
  user: UserProfile | null;
  login: (payload: { roles: UserRole[]; entityId?: string | null; subEntryId?: string | null; primaryRole?: UserRole }) => void;
  signInEmail: (email: string, password: string) => Promise<void>;
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

  // Firebase auth listener with Firestore profile fetch
  useEffect(() => {
    let unsub = () => {};
    getFirebase().then(({ auth }) => {
      unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }
      
      // Try to fetch profile from Firestore
      let profile = await fetchUserProfile(fbUser.uid);
      
      // If no profile exists, create one from Firebase Auth data
      if (!profile) {
        const newProfile: Partial<UserProfile> = {
          name: fbUser.displayName ?? mockUserBase.name,
          email: fbUser.email ?? mockUserBase.email,
          roles: initialUser.roles.length > 0 ? initialUser.roles : mockUserBase.roles,
          primaryRole: (initialUser.roles?.[0] as UserRole | undefined) ?? mockUserBase.roles[0],
          entityId: storedEntity,
          subEntryId: storedSubEntry,
        };
        await createUserProfile(fbUser.uid, newProfile);
        profile = await fetchUserProfile(fbUser.uid);
      }
      
      // Fallback to mock if Firestore fetch still fails (dev mode)
      const next: UserProfile = profile ?? {
        id: fbUser.uid,
        name: fbUser.displayName ?? mockUserBase.name,
        email: fbUser.email ?? mockUserBase.email,
        roles: initialUser.roles.length > 0 ? initialUser.roles : mockUserBase.roles,
        primaryRole: (initialUser.roles?.[0] as UserRole | undefined) ?? mockUserBase.roles[0],
        entityId: storedEntity,
        subEntryId: storedSubEntry,
      };
      
      // Persist to localStorage
      try {
        if (next.primaryRole) window.localStorage.setItem("activeRole", next.primaryRole);
        if (next.entityId) window.localStorage.setItem("entityId", next.entityId);
        if (next.subEntryId) window.localStorage.setItem("subEntryId", next.subEntryId);
      } catch {}
      
      setUser(next);
      });
    });
    return () => unsub();
  }, []);

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
    signInEmail: async (email: string, password: string) => {
      const { auth } = await getFirebase();
      await signInWithEmailAndPassword(auth, email, password);
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
      signOut(auth).finally(() => setUser(null));
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


