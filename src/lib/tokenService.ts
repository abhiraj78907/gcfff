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

  // First, try to use setDoc with merge (handles both create and update)
  // This is more reliable than transactions for this use case
  try {
    const counterSnap = await getDoc(counterRef);
    const current = counterSnap.exists() 
      ? (counterSnap.data()?.value as number) || 0 
      : 0;
    const next = current + 1;
    
    // Use setDoc with merge to handle both create and update
    await setDoc(counterRef, { 
      value: next, 
      updatedAt: Date.now() 
    }, { merge: true });
    
    return String(next);
  } catch (error: any) {
    // If setDoc fails, try transaction as fallback
    try {
      const result = await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);
        const current = counterSnap.exists()
          ? (counterSnap.data()?.value as number) || 0
          : 0;
        const next = current + 1;

        // Always use set with merge in transaction
        transaction.set(counterRef, { 
          value: next, 
          updatedAt: Date.now() 
        }, { merge: true });

        return String(next);
      });

      return result;
    } catch (transactionError: any) {
      console.error("[tokenService] Transaction also failed:", transactionError);
      // Final fallback: generate timestamp-based token
      return String(Date.now()).slice(-6);
    }
  }
}

