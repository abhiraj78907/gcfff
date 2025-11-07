import { useEffect, useMemo, useState } from "react";
import { listenCollection, paths, upsertById } from "@shared/lib/db";
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";

type Medicine = {
  id: string;
  name: string;
  dosage: string;
  strength?: string;
  instructions: string;
  period?: "morning" | "afternoon" | "night";
  withFood?: boolean;
  status?: "taken" | "due" | "missed";
  startDate?: string;
  endDate?: string;
  remindersEnabled?: boolean;
  imageUrl?: string;
};

function mergeById(live: Medicine[], mock: Medicine[]): Medicine[] {
  const map = new Map<string, Medicine>();
  for (const m of mock) map.set(m.id, m);
  for (const l of live) map.set(l.id, { ...(map.get(l.id) ?? {} as Medicine), ...l });
  return Array.from(map.values());
}

export function usePatientMedicines(mockMedicines: Medicine[]) {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [liveMedicines, setLiveMedicines] = useState<Medicine[]>([]);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const patientId = user?.id ?? "patient-demo";

  useEffect(() => {
    if (!entityId) return; // stay on mock until entity is chosen
    const colPath = paths.patientMedicines(entityId, patientId);
    const unsub = listenCollection<Medicine>(colPath, (rows) => {
      setLiveMedicines(rows);
    });
    return () => unsub();
  }, [entityId, patientId]);

  const data = useMemo(() => mergeById(liveMedicines, mockMedicines), [liveMedicines, mockMedicines]);

  const updateReminder = async (id: string, remindersEnabled: boolean) => {
    if (!entityId) return;
    const colPath = paths.patientMedicines(entityId, patientId);
    await upsertById<Partial<Medicine>>(colPath, id, { remindersEnabled });
  };

  return { medicines: data, hasLive: liveMedicines.length > 0, updateReminder };
}


