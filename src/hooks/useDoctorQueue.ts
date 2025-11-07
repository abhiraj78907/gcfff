import { useEffect, useState } from "react";
import { listenCollection, paths } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useSubEntry } from "@/contexts/SubEntryContext";
import type { AppointmentDoc } from "@/lib/firebaseTypes";

export function useDoctorQueue() {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [queue, setQueue] = useState<AppointmentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const doctorId = user?.id ?? null;

  useEffect(() => {
    if (!entityId || !doctorId) {
      setLoading(false);
      return;
    }

    const queuePath = paths.doctorQueue(entityId, doctorId);
    let unsub: (() => void) | undefined;
    listenCollection<AppointmentDoc>(queuePath, (rows) => {
      const active = rows.filter(
        (apt) => apt.status === "upcoming" || !apt.status
      );
      setQueue(active);
      setLoading(false);
    }).then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, [entityId, doctorId]);

  return { queue, loading };
}

