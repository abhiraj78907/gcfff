export type Prescription = {
  id: string;
  visitId: string;
  entityId: string;
  subEntryId: string;
  items: Array<{ drugId: string; name: string; dose: string; frequency: string; duration: string }>;
  status: "pending" | "dispensed";
};

export type InventoryItem = {
  drugId: string;
  name: string;
  quantity: number;
  reorderThreshold: number;
};

export const mockPrescriptions: Prescription[] = [
  { id: "rx-1", visitId: "v-1", entityId: "entity-1", subEntryId: "sub-1", status: "pending", items: [
    { drugId: "d-1", name: "Paracetamol 500mg", dose: "500mg", frequency: "TID", duration: "5 days" },
  ]},
];

export const mockInventory: InventoryItem[] = [
  { drugId: "d-1", name: "Paracetamol 500mg", quantity: 120, reorderThreshold: 50 },
  { drugId: "d-2", name: "Amoxicillin 250mg", quantity: 35, reorderThreshold: 40 },
];


