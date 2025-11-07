import { useEffect, useMemo, useState } from "react";
import { listenCollection, paths } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useSubEntry } from "@/contexts/SubEntryContext";

export type ReceptionQueueItem = {
  id: string;
  token: number | string;
  patientId: string;
  patientName?: string;
  patientAge?: number;
  gender?: string;
  reason?: string;
  department?: string;
  createdAt?: number;
};

export function useReceptionQueue() {
  const { user } = useAuth();
  const { currentEntity, currentSubEntry } = useSubEntry();
  const [items, setItems] = useState<ReceptionQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const subEntryId = currentSubEntry?.id ?? user?.subEntryId ?? null;

  useEffect(() => {
    if (!entityId || !subEntryId) {
      setLoading(false);
      return;
    }

    const colPath = paths.receptionQueue(entityId, subEntryId);
    let unsub: (() => void) | undefined;
    listenCollection<ReceptionQueueItem>(colPath, (rows) => {
      setItems(rows);
      setLoading(false);
    }).then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, [entityId, subEntryId]);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
  }, [items]);

  return { queue: sorted, loading };
}
