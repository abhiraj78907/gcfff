/**
 * Firebase Emulator Setup for Testing
 * 
 * Use Firebase emulators for local testing without affecting production data
 */

import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const EMULATOR_HOST = "localhost";
const FIRESTORE_PORT = 8080;
const AUTH_PORT = 9099;

/**
 * Initialize Firebase with emulators
 */
export function initFirebaseEmulators() {
  const app = initializeApp({
    projectId: "medichain-test",
    apiKey: "test-api-key",
    authDomain: "localhost",
  });

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Connect to emulators (only if not already connected)
  if (!(db as any)._delegate?._settings?.host?.includes("localhost")) {
    connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_PORT);
  }

  if (!(auth as any)._delegate?.config?.emulator) {
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_PORT}`);
  }

  return { app, db, auth };
}

/**
 * Clear all emulator data
 */
export async function clearEmulatorData() {
  // Clear Firestore
  try {
    await fetch(`http://${EMULATOR_HOST}:${FIRESTORE_PORT}/emulator/v1/projects/medichain-test/databases/(default)/documents`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("Failed to clear Firestore emulator:", error);
  }

  // Clear Auth
  try {
    await fetch(`http://${EMULATOR_HOST}:${AUTH_PORT}/emulator/v1/accounts`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("Failed to clear Auth emulator:", error);
  }
}

/**
 * Seed test data in emulator
 */
export async function seedEmulatorData() {
  // This would seed test data for all roles
  // Implementation depends on your data structure
}

