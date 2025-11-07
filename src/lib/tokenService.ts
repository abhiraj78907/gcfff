import { runTransaction } from "firebase/firestore";
import { getFirebase } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { paths } from "./db";
import type { EntityId } from "./firebaseTypes";

const TOKEN_COUNTER_PATH = (entityId: EntityId, subEntryId: string) =>
  `entities/${entityId}/subEntries/${subEntryId}/_meta/tokenCounter`;

/**
 * Get next sequential token number for a sub-entry using Firestore transaction
 * Ensures no race conditions when multiple registrations happen simultaneously
 */
export async function getNextToken(
  entityId: EntityId,
  subEntryId: string
): Promise<string> {
  const { db } = await getFirebase();
  const counterPath = TOKEN_COUNTER_PATH(entityId, subEntryId);
  const counterRef = doc(db, counterPath);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const current = counterSnap.exists()
        ? (counterSnap.data().value as number)
        : 0;
      const next = current + 1;

      transaction.set(counterRef, { value: next, updatedAt: Date.now() }, { merge: true });

      return String(next);
    });

    return result;
  } catch (error) {
    console.error("[tokenService] Transaction failed:", error);
    // Fallback: generate timestamp-based token
    return String(Date.now()).slice(-6);
  }
}

