import { useEffect, useMemo, useState } from "react";
import { listenCollection, paths } from "@shared/lib/db";
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";

type Appointment = {
  id: string;
  patientId?: string;
  doctorId?: string;
  date: string;
  time?: string;
  specialty?: string;
  hospitalName?: string;
  reason?: string;
  status?: "upcoming" | "completed" | "cancelled";
};

function mergeById(live: Appointment[], mock: Appointment[]): Appointment[] {
  const map = new Map<string, Appointment>();
  for (const m of mock) map.set(m.id, m);
  for (const l of live) map.set(l.id, { ...(map.get(l.id) ?? {} as Appointment), ...l });
  return Array.from(map.values());
}

export function usePatientAppointments(mockAppointments: Appointment[]) {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [live, setLive] = useState<Appointment[]>([]);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const patientId = user?.id ?? "patient-demo";

  useEffect(() => {
    if (!entityId) return;
    const colPath = paths.patientAppointments(entityId, patientId);
    const unsub = listenCollection(colPath, (rows: any[]) => setLive(rows as Appointment[]));
    return () => unsub();
  }, [entityId, patientId]);

  const data = useMemo(() => mergeById(live, mockAppointments), [live, mockAppointments]);
  return { appointments: data, hasLive: live.length > 0 };
}


