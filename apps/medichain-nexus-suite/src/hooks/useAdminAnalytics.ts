/**
 * React Query hooks for Admin Analytics
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics, type AnalyticsData } from "../lib/adminApi";

/**
 * Fetch analytics data with optimized caching and immediate mock data fallback
 */
export function useAdminAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  entityId?: string;
}) {
  return useQuery({
    queryKey: ["admin", "analytics", params],
    queryFn: () => fetchAnalytics(params),
    staleTime: 300000, // 5 minutes - analytics can be stale longer
    cacheTime: 600000, // 10 minutes cache
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent buffering
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchInterval: false, // Disable auto-refetch to prevent buffering
    // Return mock data immediately if query fails or is loading
    placeholderData: {
      totalPatients: 48524,
      totalConsultations: 1284,
      totalPrescriptions: 3210,
      activeEntities: 312,
      consultationTime: 24,
      patientSatisfaction: 4.6,
      waitTime: 18,
      completionRate: 94,
      patientFlow: [
        { month: "Jan", registered: 3200, consultations: 2800, followups: 1200 },
        { month: "Feb", registered: 4100, consultations: 3600, followups: 1500 },
        { month: "Mar", registered: 3800, consultations: 3200, followups: 1400 },
        { month: "Apr", registered: 5200, consultations: 4800, followups: 2100 },
        { month: "May", registered: 6100, consultations: 5600, followups: 2400 },
        { month: "Jun", registered: 5800, consultations: 5200, followups: 2200 },
      ],
      departmentData: [
        { department: "General Medicine", patients: 2400 },
        { department: "Cardiology", patients: 1800 },
        { department: "Orthopedics", patients: 1600 },
        { department: "Pediatrics", patients: 2200 },
        { department: "ENT", patients: 1400 },
        { department: "Dermatology", patients: 1200 },
      ],
    } as AnalyticsData,
  });
}

