export type Consultation = {
  id: string;
  visitId: string;
  entityId: string;
  subEntryId: string;
  doctorId: string;
  notes?: string;
  diagnosisCodes?: string[];
  aiTranscript?: string;
  status: "active" | "completed";
};

export const mockConsultations: Consultation[] = [
  { id: "c-1", visitId: "v-1", entityId: "entity-1", subEntryId: "sub-1", doctorId: "doc-1", status: "active", aiTranscript: "Patient reports fever since 2 days..." },
];


