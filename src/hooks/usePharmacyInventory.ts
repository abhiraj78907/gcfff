import { useEffect, useState } from "react";
import { listenCollection, paths } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useSubEntry } from "@/contexts/SubEntryContext";

export type InventoryItem = {
  id: string;
  name: string;
  category?: string;
  batch?: string;
  supplier?: string;
  expiry?: string;
  quantity: number;
  reorderThreshold?: number;
  price?: number;
};

export function usePharmacyInventory() {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;

  useEffect(() => {
    if (!entityId) {
      setLoading(false);
      return;
    }
    const colPath = paths.pharmacyInventory(entityId);
    let unsub: (() => void) | undefined;
    listenCollection<InventoryItem>(colPath, (rows) => {
      setItems(rows);
      setLoading(false);
    }).then((unsubscribe) => {
      unsub = unsubscribe;
    });
    return () => {
      if (unsub) unsub();
    };
  }, [entityId]);

  return { items, loading };
}
