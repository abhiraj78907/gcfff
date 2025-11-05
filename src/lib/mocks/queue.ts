export type Visit = {
  id: string;
  patientId: string;
  entityId: string;
  subEntryId: string;
  token: string;
  status: "waiting" | "in_consultation" | "completed";
  createdAt: string;
};

export const mockVisits: Visit[] = [
  { id: "v-1", patientId: "p-1", entityId: "entity-1", subEntryId: "sub-1", token: "A001", status: "waiting", createdAt: new Date().toISOString() },
  { id: "v-2", patientId: "p-2", entityId: "entity-1", subEntryId: "sub-1", token: "A002", status: "waiting", createdAt: new Date().toISOString() },
  { id: "v-3", patientId: "p-3", entityId: "entity-1", subEntryId: "sub-2", token: "T101", status: "waiting", createdAt: new Date().toISOString() },
];


