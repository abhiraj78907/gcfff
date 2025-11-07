import { useEffect, useState, useMemo } from "react";
import { listenCollection, paths } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { useSubEntry } from "@/contexts/SubEntryContext";
import { where, query } from "firebase/firestore";

export interface CompletedConsultation {
  id: string;
  visitId: string;
  patientId: string;
  patientName?: string;
  notes: string;
  diagnosis?: string;
  diagnosisCodes?: string[];
  aiTranscript?: string;
  createdAt: number;
  // Prescription info (from related prescription)
  medicines?: string;
  followUpDate?: string;
}

export function useCompletedConsultations() {
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  const [consultations, setConsultations] = useState<CompletedConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  const entityId = currentEntity?.id ?? user?.entityId ?? null;
  const doctorId = user?.id ?? null;

  useEffect(() => {
    if (!entityId || !doctorId) {
      setLoading(false);
      return;
    }

    const consultationsPath = paths.consultations(entityId, doctorId);
    
    // Filter to today's consultations (can be extended for other periods)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const unsub = listenCollection<CompletedConsultation>(
      consultationsPath,
      (rows) => {
        // Filter consultations from today onwards (completed ones)
        const todayConsultations = rows.filter(
          (c) => c.createdAt >= todayTimestamp
        );
        setConsultations(todayConsultations);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [entityId, doctorId]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = consultations.length;
    const withPrescriptions = consultations.filter(c => c.medicines).length;
    const avgTime = 8; // Could calculate from actual data if available
    
    return {
      total,
      avgTime,
      prescriptions: withPrescriptions,
      labTests: 0, // Would need to query lab requests separately
    };
  }, [consultations]);

  return { consultations, loading, stats };
}

