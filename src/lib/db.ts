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

// Collections
export const paths = {
  patientMedicines: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/medicines`,
  patientPrescriptions: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/prescriptions`,
  patientAppointments: (entityId: EntityId, patientId: string) =>
    `${entityPath(entityId)}/patients/${patientId}/appointments`,
  doctorQueue: (entityId: EntityId, doctorId: string) =>
    `${entityPath(entityId)}/doctors/${doctorId}/queue`,
  labRequests: (entityId: EntityId) => `${entityPath(entityId)}/labRequests`,
  pharmacyInventory: (entityId: EntityId) => `${entityPath(entityId)}/pharmacy/inventory`,
  receptionQueue: (entityId: EntityId, subEntryId: string) =>
    `${entityPath(entityId)}/subEntries/${subEntryId}/queue`,
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


