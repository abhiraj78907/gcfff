import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  type QueryConstraint,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { getFirebase } from "./firebase";
import type { EntityId } from "./firebaseTypes";

export function entityPath(entityId: EntityId) {
  return `entities/${entityId}`;
}

// Collections - Comprehensive path helpers
export const paths = {
  // Users
  user: (userId: string) => `users/${userId}`,
  
  // Entities
  entity: (entityId: EntityId) => `entities/${entityId}`,
  subEntry: (entityId: EntityId, subEntryId: string) =>
    `${entityPath(entityId)}/subEntries/${subEntryId}`,
  
  // Patients
  patient: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}`,
  patientConsultations: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/consultations`,
  patientConsultation: (entityId: EntityId, patientId: string, consultationId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/consultations/${consultationId}`,
  consultationPrescriptions: (entityId: EntityId, patientId: string, consultationId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/consultations/${consultationId}/prescriptions`,
  consultationPrescription: (entityId: EntityId, patientId: string, consultationId: string, prescriptionId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/consultations/${consultationId}/prescriptions/${prescriptionId}`,
  
  // Doctors
  doctor: (entityId: EntityId, doctorId: string) =>
    `${entityPath(entityId)}/doctors/${doctorId}`,
  doctorConsultations: (entityId: EntityId, doctorId: string) =>
    `${entityPath(entityId)}/doctors/${doctorId}/consultations`,
  doctorConsultation: (entityId: EntityId, doctorId: string, consultationId: string) =>
    `${entityPath(entityId)}/doctors/${doctorId}/consultations/${consultationId}`,
  
  // Medicines & Pharmacy
  medicines: (entityId: EntityId) => `${entityPath(entityId)}/medicines`,
  medicine: (entityId: EntityId, medicineId: string) =>
    `${entityPath(entityId)}/medicines/${medicineId}`,
  pharmacyInventory: (entityId: EntityId) => `${entityPath(entityId)}/pharmacy/inventory`,
  pharmacyInventoryItem: (entityId: EntityId, itemId: string) =>
    `${entityPath(entityId)}/pharmacy/inventory/${itemId}`,
  pharmacyDispensations: (entityId: EntityId) =>
    `${entityPath(entityId)}/pharmacy/dispensations`,
  pharmacyDispensation: (entityId: EntityId, dispensationId: string) =>
    `${entityPath(entityId)}/pharmacy/dispensations/${dispensationId}`,
  
  // Lab
  labRequests: (entityId: EntityId) => `${entityPath(entityId)}/lab/requests`,
  labRequest: (entityId: EntityId, requestId: string) =>
    `${entityPath(entityId)}/lab/requests/${requestId}`,
  labResults: (entityId: EntityId) => `${entityPath(entityId)}/lab/results`,
  labResult: (entityId: EntityId, resultId: string) =>
    `${entityPath(entityId)}/lab/results/${resultId}`,
  
  // Queue
  receptionQueue: (entityId: EntityId, subEntryId: string) =>
    `${entityPath(entityId)}/subEntries/${subEntryId}/queue`,
  queueEntry: (entityId: EntityId, subEntryId: string, queueId: string) =>
    `${entityPath(entityId)}/subEntries/${subEntryId}/queue/${queueId}`,
  
  // System
  notifications: () => 'notifications',
  notification: (notificationId: string) => `notifications/${notificationId}`,
  auditLogs: () => 'auditLogs',
  auditLog: (logId: string) => `auditLogs/${logId}`,
  reports: () => 'reports',
  report: (reportId: string) => `reports/${reportId}`,
  analytics: (entityId: EntityId, date: string) => `analytics/${entityId}/${date}`,
  
  // Legacy paths (for backward compatibility)
  patientMedicines: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/medicines`,
  patientPrescriptions: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/prescriptions`,
  patientAppointments: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/appointments`,
  doctorQueue: (entityId: EntityId, doctorId: string) =>
    `${entityPath(entityId)}/doctors/${doctorId}/queue`,
  labResults: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/labResults`,
  consultations: (entityId: EntityId, doctorId: string) =>
    `${entityPath(entityId)}/doctors/${doctorId}/consultations`,
  prescriptions: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/prescriptions`,
  dispensations: (entityId: EntityId) =>
    `${entityPath(entityId)}/pharmacy/dispensations`,
};

// Basic helpers
export async function getDocByPath<T>(path: string) {
  const { db } = await getFirebase();
  const snap = await getDoc(doc(db, path));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null;
}

export async function getCollection<T>(path: string, ...filters: QueryConstraint[]) {
  const { db } = await getFirebase();
  const q = filters.length ? query(collection(db, path), ...filters) : collection(db, path);
  const snap = await getDocs(q as any);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
}

export async function listenCollection<T>(path: string, cb: (rows: T[]) => void, ...filters: QueryConstraint[]) {
  const { db } = await getFirebase();
  const q = filters.length ? query(collection(db, path), ...filters) : collection(db, path);
  return onSnapshot(q as any, snap => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
    cb(rows);
  });
}

export async function upsertById<T extends Record<string, unknown>>(path: string, id: string, data: T) {
  const { db } = await getFirebase();
  await setDoc(doc(db, path, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function addRow<T extends Record<string, unknown>>(path: string, data: T) {
  const { db } = await getFirebase();
  await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
}

export async function patchById<T extends Record<string, unknown>>(path: string, id: string, data: Partial<T>) {
  const { db } = await getFirebase();
  await updateDoc(doc(db, path, id), { ...data, updatedAt: serverTimestamp() } as any);
}

export { runTransaction };


