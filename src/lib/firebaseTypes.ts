export type EntityId = string;
export type UserId = string;

export interface MedicineDoc {
  id: string;
  name: string;
  dosage: string;
  strength?: string;
  instructions: string;
  period?: "morning" | "afternoon" | "night";
  withFood?: boolean;
  status?: "taken" | "due" | "missed";
  startDate?: string;
  endDate?: string;
  remindersEnabled?: boolean;
}

export interface PrescriptionDoc {
  id: string;
  date: string;
  doctorId: UserId;
  doctorName?: string;
  hospitalName?: string;
  diagnosis?: string;
  medicines?: Array<{ name: string; dosage: string; duration?: string }>; 
  status?: "current" | "past";
}

export interface AppointmentDoc {
  id: string;
  patientId: UserId;
  doctorId: UserId;
  date: string; // ISO
  time?: string;
  specialty?: string;
  hospitalName?: string;
  reason?: string;
  status?: "upcoming" | "completed" | "cancelled";
}

export interface LabRequestDoc {
  id: string;
  patientId: UserId;
  doctorId: UserId;
  testType: string;
  status: "ordered" | "in_progress" | "completed" | "cancelled";
  resultUrl?: string;
  createdAt: number;
}


