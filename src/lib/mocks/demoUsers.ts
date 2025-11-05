import type { UserRole } from "@/types/entities";

export type DemoUser = {
  username: string;
  password: string;
  role: UserRole;
  entityId: string;
  subEntryId: string;
  name: string;
};

export const demoUsersByEntity: Record<string, DemoUser[]> = {
  "entity-apo": [
    { username: "apollo.doc1", password: "pwd1", role: "doctor", entityId: "entity-apo", subEntryId: "apo-sub-main", name: "Dr. Apollo One" },
    { username: "apollo.rec", password: "pwd2", role: "receptionist", entityId: "entity-apo", subEntryId: "apo-sub-main", name: "Apollo Reception" },
    { username: "apollo.lab", password: "pwd3", role: "lab-tech", entityId: "entity-apo", subEntryId: "apo-sub-cardiac", name: "Apollo Lab Tech" },
    { username: "apollo.pharm", password: "pwd4", role: "pharmacist", entityId: "entity-apo", subEntryId: "apo-sub-main", name: "Apollo Pharmacist" },
    { username: "apollo.admin", password: "admin1", role: "admin", entityId: "entity-apo", subEntryId: "apo-sub-main", name: "Apollo Admin" },
    { username: "apollo.patient", password: "pwd5", role: "patient", entityId: "entity-apo", subEntryId: "apo-sub-main", name: "Apollo Patient" },
  ],
  "entity-grn": [
    { username: "green.doc1", password: "pwd1", role: "doctor", entityId: "entity-grn", subEntryId: "grn-sub-main", name: "Dr. Green One" },
    { username: "green.rec", password: "pwd2", role: "receptionist", entityId: "entity-grn", subEntryId: "grn-sub-main", name: "GreenLife Reception" },
    { username: "green.lab", password: "pwd3", role: "lab-tech", entityId: "entity-grn", subEntryId: "grn-sub-main", name: "GreenLife Lab" },
    { username: "green.admin", password: "admin1", role: "admin", entityId: "entity-grn", subEntryId: "grn-sub-main", name: "Green Admin" },
    { username: "green.patient", password: "pwd5", role: "patient", entityId: "entity-grn", subEntryId: "grn-sub-main", name: "Green Patient" },
  ],
  "entity-med": [
    { username: "med.pharm", password: "pwd4", role: "pharmacist", entityId: "entity-med", subEntryId: "med-sub-main", name: "MediTown Pharmacist" },
    { username: "med.admin", password: "admin1", role: "admin", entityId: "entity-med", subEntryId: "med-sub-main", name: "MediTown Admin" },
  ],
};

export function authenticateDemo(params: { entityId: string; username: string; password: string; role: UserRole }) {
  const { entityId, username, password, role } = params;
  const pool = demoUsersByEntity[entityId];
  if (!pool) return null;
  const user = pool.find((u) => u.username === username && u.password === password && u.role === role);
  return user ?? null;
}


