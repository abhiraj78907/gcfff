export type AdherenceEvent = {
  id: string;
  patientId: string;
  prescriptionId: string;
  entityId: string;
  subEntryId: string;
  scheduledAt: string;
  status: "scheduled" | "sent" | "confirmed" | "snoozed" | "missed";
  channel: "app" | "sms" | "call";
};

export const mockAdherenceEvents: AdherenceEvent[] = [
  { id: "ae-1", patientId: "p-1", prescriptionId: "rx-1", entityId: "entity-1", subEntryId: "sub-1", scheduledAt: new Date().toISOString(), status: "scheduled", channel: "sms" },
];


