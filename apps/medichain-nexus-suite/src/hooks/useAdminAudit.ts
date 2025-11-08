/**
 * React Query hooks for Admin Audit Logs
 */

import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs, type AuditLog } from "../lib/adminApi";

/**
 * Fetch audit logs
 */
export function useAdminAuditLogs(params?: {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["admin", "audit", params],
    queryFn: () => fetchAuditLogs(params),
    staleTime: 30000,
  });
}

