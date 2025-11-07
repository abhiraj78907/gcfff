import { useEffect, useState } from "react";
import { listenCollection, paths, patchById } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useSubEntry } from "@/contexts/SubEntryContext";
import type { LabRequestDoc } from "@/lib/firebaseTypes";

export function useLabRequests() {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [requests, setRequests] = useState<LabRequestDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;

  useEffect(() => {
    if (!entityId) {
      setLoading(false);
      return;
    }

    const colPath = paths.labRequests(entityId);
    let unsub: (() => void) | undefined;
    listenCollection<LabRequestDoc>(colPath, (rows) => {
      setRequests(rows);
      setLoading(false);
    }).then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, [entityId]);

  const updateStatus = async (requestId: string, status: LabRequestDoc["status"]) => {
    if (!entityId) return;
    const colPath = paths.labRequests(entityId);
    await patchById<Partial<LabRequestDoc>>(colPath, requestId, { status });
  };

  return { requests, loading, updateStatus };
}

