/**
 * Firestore Database Type Definitions
 * Indian Multilingual Clinical Consultation Platform
 */

import type { Timestamp } from "firebase/firestore";

// ============================================================================
// Base Types
// ============================================================================

export type UserRole = 'doctor' | 'receptionist' | 'pharmacist' | 'lab-tech' | 'admin' | 'patient';
export type EntityType = 'hospital' | 'clinic' | 'pharmacy' | 'laboratory';
export type ConsultationStatus = 'active' | 'completed' | 'cancelled';
export type PrescriptionStatus = 'pending' | 'dispensed' | 'partially-dispensed' | 'cancelled';
export type QueueStatus = 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'ml';

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  phone?: string;
  roles: UserRole[];
  primaryRole: UserRole;
  entityId: string | null;
  subEntryId: string | null;
  specialization?: string;
  licenseNumber?: string;
  language: Language;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  isActive: boolean;
  metadata?: {
    avatar?: string;
    address?: string;
    emergencyContact?: string;
  };
}

// ============================================================================
// Entity Types
// ============================================================================

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  licenseNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  status: 'active' | 'inactive' | 'maintenance';
  totalPatients: number;
  totalDoctors: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    beds?: number;
    specialties?: string[];
    accreditation?: string[];
  };
}

export interface SubEntry {
  id: string;
  entityId: string;
  name: string;
  type: 'ward' | 'department' | 'branch';
  location?: {
    floor?: number;
    room?: string;
  };
  capacity?: number;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Patient Types
// ============================================================================

export interface Patient {
  id: string; // Unique patient ID (e.g., VIMS-2025-12345)
  entityId: string;
  aadhaarNumber?: string; // Hashed/encrypted
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Timestamp;
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string[];
  chronicConditions?: string[];
  language: Language;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastVisitAt?: Timestamp;
  totalConsultations: number;
  metadata?: {
    insurance?: {
      provider: string;
      policyNumber: string;
    };
    notes?: string;
  };
}

// ============================================================================
// Consultation Types
// ============================================================================

export interface Symptom {
  term: string; // Normalized symptom term
  originalText: string; // Original text from transcript
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
  language: Language;
}

export interface TranscriptSegment {
  text: string;
  timestamp: number;
  speaker: 'patient' | 'doctor';
}

export interface Consultation {
  id: string;
  entityId: string;
  patientId: string;
  patientName: string; // Denormalized
  doctorId: string;
  doctorName: string; // Denormalized
  department: string;
  status: ConsultationStatus;
  
  // Gemini AI Integration
  transcript: {
    raw: string; // Full voice transcript
    language: Language;
    segments?: TranscriptSegment[];
  };
  
  // Extracted Data
  symptoms: Symptom[];
  
  diagnosis: {
    primary: string;
    icd10Code?: string;
    secondary?: string[];
    notes?: string;
  };
  
  // Editable Prescription Fields (EXCLUDING medicines)
  prescription: {
    instructions: string;
    followUpDate?: Timestamp;
    labTests?: Array<{
      testName: string;
      notes?: string;
    }>;
    imaging?: Array<{
      type: string;
      bodyPart: string;
      notes?: string;
    }>;
    diet?: string;
    lifestyle?: string;
    restrictions?: string[];
  };
  
  // Metadata
  consultationDate: Timestamp;
  duration: number; // Minutes
  tokenNumber?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  
  // Links
  prescriptionId?: string;
  labRequestIds?: string[];
}

// ============================================================================
// Prescription Types
// ============================================================================

export interface MedicineTiming {
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
  night?: boolean;
  beforeMeals?: boolean;
  afterMeals?: boolean;
}

export interface PrescriptionMedicine {
  medicineId: string;
  medicineName: string; // Denormalized
  composition?: string; // Denormalized
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unit: string;
  instructions?: string;
  timing?: MedicineTiming;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  entityId: string;
  medicines: PrescriptionMedicine[];
  status: PrescriptionStatus;
  dispensedAt?: Timestamp;
  dispensedBy?: string; // Pharmacist ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  validUntil: Timestamp;
}

// ============================================================================
// Medicine Catalog Types
// ============================================================================

export interface Medicine {
  id: string;
  entityId: string;
  name: string;
  brandName?: string;
  genericName: string;
  composition: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops';
  strength: string;
  manufacturer: string;
  mrp: number;
  hsnCode?: string;
  schedule?: string; // H, H1, X, etc.
  prescriptionRequired: boolean;
  stockAvailable: boolean;
  searchTerms: string[]; // For multilingual search
  languageVariants?: {
    [lang in Language]?: {
      name: string;
      composition: string;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Pharmacy Types
// ============================================================================

export interface InventoryItem {
  id: string;
  entityId: string;
  medicineId: string;
  medicineName: string; // Denormalized
  batchNumber: string;
  expiryDate: Timestamp;
  quantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  location?: string;
  status: 'available' | 'low-stock' | 'out-of-stock' | 'expired';
  reorderLevel: number;
  lastRestockedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Dispensation {
  id: string;
  entityId: string;
  prescriptionId: string;
  patientId: string;
  items: Array<{
    medicineId: string;
    medicineName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  dispensedBy: string; // Pharmacist ID
  dispensedAt: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// Lab Types
// ============================================================================

export interface LabRequest {
  id: string;
  entityId: string;
  patientId: string;
  patientName: string; // Denormalized
  doctorId: string;
  consultationId?: string;
  tests: Array<{
    testName: string;
    testCode?: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    priority: 'routine' | 'urgent' | 'stat';
    notes?: string;
  }>;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestedAt: Timestamp;
  completedAt?: Timestamp;
  resultId?: string;
  assignedTo?: string; // Lab technician ID
}

export interface LabResult {
  id: string;
  requestId: string;
  entityId: string;
  patientId: string;
  doctorId: string;
  tests: Array<{
    testName: string;
    values: Record<string, any>;
    normalRange?: string;
    unit?: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  reportUrl?: string; // PDF report URL
  verifiedBy: string; // Lab technician ID
  verifiedAt: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// Queue Types
// ============================================================================

export interface QueueEntry {
  id: string;
  entityId: string;
  subEntryId: string;
  patientId: string;
  patientName: string; // Denormalized
  token: number;
  department: string;
  doctorId?: string;
  doctorName?: string;
  status: QueueStatus;
  reason: string;
  priority?: 'normal' | 'urgent';
  registeredAt: Timestamp;
  consultationStartedAt?: Timestamp;
  consultationCompletedAt?: Timestamp;
  consultationId?: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  userId?: string;
  entityId?: string;
  type: 'system' | 'alert' | 'reminder' | 'update';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  language: Language;
  actionUrl?: string;
  read: boolean;
  acknowledged: boolean;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  metadata?: {
    consultationId?: string;
    patientId?: string;
    prescriptionId?: string;
  };
}

// ============================================================================
// Audit Log Types
// ============================================================================

export interface AuditLog {
  id: string;
  userId: string;
  userName: string; // Denormalized
  entityId: string;
  action: string; // 'create', 'update', 'delete', 'view', 'login', 'logout'
  resource: string; // 'consultation', 'prescription', 'patient', etc.
  resourceId?: string;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

// ============================================================================
// Report Types
// ============================================================================

export interface Report {
  id: string;
  entityId: string;
  name: string;
  type: 'analytics' | 'financial' | 'inventory' | 'performance';
  format: 'PDF' | 'CSV' | 'Excel';
  parameters: Record<string, any>;
  generatedAt: Timestamp;
  generatedBy: string; // User ID
  fileUrl?: string;
  size: string;
  status: 'generating' | 'completed' | 'failed';
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface Analytics {
  entityId: string;
  date: string; // YYYY-MM-DD
  metrics: {
    totalPatients: number;
    totalConsultations: number;
    totalPrescriptions: number;
    averageConsultationTime: number;
    patientSatisfaction: number;
    revenue: number;
  };
  breakdown: {
    byDepartment: Record<string, number>;
    byDoctor: Record<string, number>;
    byTimeOfDay: Record<string, number>;
  };
  computedAt: Timestamp;
}

