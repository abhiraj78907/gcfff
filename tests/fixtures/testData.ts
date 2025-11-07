/**
 * Test data fixtures
 * Reusable test data for all test suites
 */

import type { UserProfile, UserRole } from "../../src/types/entities";
import type { LabRequestDoc, PrescriptionDoc, AppointmentDoc } from "../../src/lib/firebaseTypes";

export const testUsers: Record<UserRole, UserProfile> = {
  patient: {
    id: "test-patient-1",
    name: "Test Patient",
    email: "patient@test.com",
    roles: ["patient"],
    primaryRole: "patient",
    entityId: "test-entity-1",
    subEntryId: "test-subentry-1",
  },
  doctor: {
    id: "test-doctor-1",
    name: "Dr. Test",
    email: "doctor@test.com",
    roles: ["doctor"],
    primaryRole: "doctor",
    entityId: "test-entity-1",
    subEntryId: "test-subentry-1",
    doctorSpecialization: "General Medicine",
    doctorExperienceYears: 10,
  },
  pharmacist: {
    id: "test-pharmacist-1",
    name: "Test Pharmacist",
    email: "pharmacist@test.com",
    roles: ["pharmacist"],
    primaryRole: "pharmacist",
    entityId: "test-entity-1",
    subEntryId: "test-subentry-1",
  },
  "lab-tech": {
    id: "test-labtech-1",
    name: "Test Lab Tech",
    email: "labtech@test.com",
    roles: ["lab-tech"],
    primaryRole: "lab-tech",
    entityId: "test-entity-1",
    subEntryId: "test-subentry-1",
  },
  receptionist: {
    id: "test-receptionist-1",
    name: "Test Receptionist",
    email: "receptionist@test.com",
    roles: ["receptionist"],
    primaryRole: "receptionist",
    entityId: "test-entity-1",
    subEntryId: "test-subentry-1",
  },
  admin: {
    id: "test-admin-1",
    name: "Test Admin",
    email: "admin@test.com",
    roles: ["admin"],
    primaryRole: "admin",
    entityId: "test-entity-1",
    subEntryId: "test-subentry-1",
  },
};

export const testEntities = {
  entity1: {
    id: "test-entity-1",
    type: "hospital" as const,
    name: "Test Hospital",
  },
  entity2: {
    id: "test-entity-2",
    type: "clinic" as const,
    name: "Test Clinic",
  },
};

export const testLabRequests: LabRequestDoc[] = [
  {
    id: "lab-req-1",
    patientId: "test-patient-1",
    doctorId: "test-doctor-1",
    testType: "Complete Blood Count",
    status: "ordered",
    createdAt: Date.now(),
  },
  {
    id: "lab-req-2",
    patientId: "test-patient-1",
    doctorId: "test-doctor-1",
    testType: "Lipid Profile",
    status: "in_progress",
    createdAt: Date.now() - 3600000,
  },
];

export const testPrescriptions: PrescriptionDoc[] = [
  {
    id: "presc-1",
    date: new Date().toISOString(),
    doctorId: "test-doctor-1",
    doctorName: "Dr. Test",
    medicines: [
      {
        drugId: "drug-1",
        drugName: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "5 days",
      },
    ],
    status: "current",
  },
];

export const testAppointments: AppointmentDoc[] = [
  {
    id: "apt-1",
    patientId: "test-patient-1",
    doctorId: "test-doctor-1",
    date: new Date().toISOString(),
    time: "10:00",
    reason: "Follow-up consultation",
    status: "upcoming",
  },
];

