/**
 * React Query hooks for Admin Settings
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings, type Settings } from "../lib/adminApi";
import { useToast } from "./use-toast";
import { logAuditEvent } from "../lib/adminApi";

/**
 * Fetch settings
 */
export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: fetchSettings,
    staleTime: 60000,
  });
}

/**
 * Update settings mutation
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      
      await logAuditEvent({
        userId: "current-user",
        userName: "Admin",
        action: "Updated system settings",
        type: "update",
        details: { settings: Object.keys(data) },
      });
      
      toast({
        title: "Settings updated",
        description: "System settings have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating settings",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });
}

