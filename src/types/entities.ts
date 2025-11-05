export type EntityType = "hospital" | "clinic" | "lab" | "pharmacy";

export interface SubEntry {
  id: string;
  entityId: string;
  name: string;
  location: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  licenseNumber: string;
  registrationDate: string;
  status: "active" | "inactive";
  subEntries: SubEntry[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | "admin"
  | "receptionist"
  | "doctor"
  | "lab-tech"
  | "pharmacist"
  | "patient";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  // Assigned scope
  entityId?: string | null;
  subEntryId?: string | null;
  primaryRole?: UserRole;
  // Optional doctor fields for registration
  doctorSpecialization?: string;
  doctorExperienceYears?: number;
}


