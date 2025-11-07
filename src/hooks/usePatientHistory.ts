import { useEffect, useState } from "react";
import { listenCollection, paths } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useSubEntry } from "@/contexts/SubEntryContext";

export interface PatientHistoryVisit {
  id: string;
  date: string;
  doctor: string;
  doctorId: string;
  department?: string;
  diagnosis: string;
  symptoms?: string;
  medicines?: string;
  followUp?: string;
  createdAt: number;
}

export function usePatientHistory(patientId?: string) {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [history, setHistory] = useState<PatientHistoryVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const targetPatientId = patientId || user?.id || null;

  useEffect(() => {
    if (!entityId || !targetPatientId) {
      setLoading(false);
      return;
    }

    // Get consultations from all doctors for this patient
    // This requires querying across all doctor consultations
    // For now, we'll use a simplified approach - get from patient's appointments
    const appointmentsPath = paths.patientAppointments(entityId, targetPatientId);
    
    let unsub: (() => void) | undefined;
    listenCollection<any>(appointmentsPath, (rows) => {
      const historyItems: PatientHistoryVisit[] = rows
        .filter((apt) => apt.status === "completed")
        .map((apt) => ({
          id: apt.id,
          date: new Date(apt.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          doctor: apt.doctorName || "Dr. Unknown",
          doctorId: apt.doctorId || "",
          department: apt.specialty || "General Medicine",
          diagnosis: apt.reason || "General Consultation",
          symptoms: apt.reason,
          medicines: "",
          followUp: apt.followUpDate || "",
          createdAt: apt.createdAt || Date.now(),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setHistory(historyItems);
      setLoading(false);
    }).then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, [entityId, targetPatientId]);

  return { history, loading };
}

