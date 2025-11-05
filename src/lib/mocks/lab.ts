export type LabOrder = {
  id: string;
  visitId: string;
  entityId: string;
  subEntryId: string;
  tests: string[];
  status: "ordered" | "received" | "in_progress" | "completed";
};

export type LabResult = {
  id: string;
  orderId: string;
  files: string[];
  values?: Record<string, string | number>;
  verifiedBy?: string;
};

export const mockLabOrders: LabOrder[] = [
  { id: "lo-1", visitId: "v-1", entityId: "entity-1", subEntryId: "sub-1", tests: ["CBC", "CRP"], status: "ordered" },
  { id: "lo-2", visitId: "v-3", entityId: "entity-1", subEntryId: "sub-2", tests: ["X-Ray Chest"], status: "received" },
];

export const mockLabResults: LabResult[] = [];


