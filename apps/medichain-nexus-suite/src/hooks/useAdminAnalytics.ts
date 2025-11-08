/**
 * React Query hooks for Admin Analytics
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics, type AnalyticsData } from "../lib/adminApi";

/**
 * Fetch analytics data
 */
export function useAdminAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  entityId?: string;
}) {
  return useQuery({
    queryKey: ["admin", "analytics", params],
    queryFn: () => fetchAnalytics(params),
    staleTime: 60000, // 1 minute - analytics can be slightly stale
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

