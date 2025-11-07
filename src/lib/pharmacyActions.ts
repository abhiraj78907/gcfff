import { runTransaction } from "./db";
import { doc, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "./firebase";
import { paths } from "./db";
import type { EntityId } from "./firebaseTypes";

export type DispensationItem = {
  prescriptionId: string;
  drugId: string;
  quantity: number;
};

/**
 * Dispense medicines from prescription with inventory check and update
 * Uses transaction to ensure inventory consistency
 */
export async function dispensePrescription(
  entityId: EntityId,
  prescriptionId: string,
  items: DispensationItem[]
): Promise<void> {
  const { db } = await getFirebase();
  const inventoryPath = paths.pharmacyInventory(entityId);
  const dispensationsPath = paths.dispensations(entityId);

  await runTransaction(db, async (transaction) => {
    // Check inventory and update quantities
    for (const item of items) {
      const drugRef = doc(db, inventoryPath, item.drugId);
      const drugSnap = await transaction.get(drugRef);

      if (!drugSnap.exists()) {
        throw new Error(`Drug ${item.drugId} not found in inventory`);
      }

      const currentQty = drugSnap.data().quantity as number;
      if (currentQty < item.quantity) {
        throw new Error(`Insufficient stock for ${item.drugId}. Available: ${currentQty}, Required: ${item.quantity}`);
      }

      // Update inventory
      transaction.update(drugRef, {
        quantity: currentQty - item.quantity,
        updatedAt: serverTimestamp(),
      });
    }

    // Record dispensation
    const dispensationRef = doc(collection(db, dispensationsPath));
    transaction.set(dispensationRef, {
      prescriptionId,
      items,
      dispensedAt: serverTimestamp(),
      createdAt: Date.now(),
    });
  });
}

/**
 * Update prescription status after dispensation
 */
export async function markPrescriptionDispensed(
  entityId: EntityId,
  patientId: string,
  prescriptionId: string
): Promise<void> {
  const { db } = await getFirebase();
  const prescriptionsPath = paths.patientPrescriptions(entityId, patientId);
  await updateDoc(doc(db, prescriptionsPath, prescriptionId), {
    status: "dispensed",
    dispensedAt: serverTimestamp(),
  } as any);
}

