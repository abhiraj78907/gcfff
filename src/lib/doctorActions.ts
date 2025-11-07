import { addRow, paths, patchById } from "./db";
import type { EntityId } from "./firebaseTypes";

export type ConsultationNote = {
  visitId: string;
  patientId: string;
  notes: string;
  diagnosis?: string;
  diagnosisCodes?: string[];
  aiTranscript?: string;
};

export type PrescriptionItem = {
  drugId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
};

/**
 * Create consultation record for a patient visit
 */
export async function createConsultation(
  entityId: EntityId,
  doctorId: string,
  consultation: ConsultationNote
): Promise<string> {
  const consultationsPath = paths.consultations(entityId, doctorId);
  const { addDoc, collection } = await import("firebase/firestore");
  const { getFirebase } = await import("./firebase");
  const { db } = await getFirebase();
  const result = await addDoc(collection(db, consultationsPath), {
    visitId: consultation.visitId,
    patientId: consultation.patientId,
    notes: consultation.notes,
    diagnosis: consultation.diagnosis,
    diagnosisCodes: consultation.diagnosisCodes,
    aiTranscript: consultation.aiTranscript,
    createdAt: Date.now(),
  });
  
  // Update appointment status to completed
  const appointmentsPath = paths.patientAppointments(entityId, consultation.patientId);
  await patchById(appointmentsPath, consultation.visitId, {
    status: "completed",
  });

  return result.id;
}

/**
 * Create prescription for a patient
 */
export async function createPrescription(
  entityId: EntityId,
  patientId: string,
  visitId: string,
  items: PrescriptionItem[],
  doctorId: string,
  doctorName?: string
): Promise<string> {
  const prescriptionsPath = paths.patientPrescriptions(entityId, patientId);
  const { addDoc, collection } = await import("firebase/firestore");
  const { getFirebase } = await import("./firebase");
  const { db } = await getFirebase();
  const result = await addDoc(collection(db, prescriptionsPath), {
    visitId,
    doctorId,
    doctorName,
    medicines: items,
    status: "current",
    date: new Date().toISOString(),
    createdAt: Date.now(),
  });

  return result.id;
}

/**
 * Create lab order from doctor
 */
export async function createLabOrder(
  entityId: EntityId,
  patientId: string,
  doctorId: string,
  testType: string
): Promise<string> {
  const requestsPath = paths.labRequests(entityId);
  const { addDoc, collection } = await import("firebase/firestore");
  const { getFirebase } = await import("./firebase");
  const { db } = await getFirebase();
  const result = await addDoc(collection(db, requestsPath), {
    patientId,
    doctorId,
    testType,
    status: "ordered",
    createdAt: Date.now(),
  });

  return result.id;
}

