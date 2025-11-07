import { useEffect, useMemo, useState } from "react";
import { listenCollection, paths } from "@shared/lib/db";
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";

type Prescription = {
  id: string;
  date: string;
  doctorId?: string;
  doctorName?: string;
  hospitalName?: string;
  diagnosis?: string;
  medicines?: Array<{ name: string; dosage: string; duration?: string }>; 
  status?: "current" | "past";
};

function mergeById(live: Prescription[], mock: Prescription[]): Prescription[] {
  const map = new Map<string, Prescription>();
  for (const m of mock) map.set(m.id, m);
  for (const l of live) map.set(l.id, { ...(map.get(l.id) ?? {} as Prescription), ...l });
  return Array.from(map.values());
}

export function usePatientPrescriptions(mockPrescriptions: Prescription[]) {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [live, setLive] = useState<Prescription[]>([]);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const patientId = user?.id ?? "patient-demo";

  useEffect(() => {
    if (!entityId) return;
    const colPath = paths.patientPrescriptions(entityId, patientId);
    const unsub = listenCollection(colPath, (rows: any[]) => setLive(rows as Prescription[]));
    return () => unsub();
  }, [entityId, patientId]);

  const data = useMemo(() => mergeById(live, mockPrescriptions), [live, mockPrescriptions]);
  return { prescriptions: data, hasLive: live.length > 0 };
}


