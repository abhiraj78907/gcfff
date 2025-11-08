/**
 * React Query hooks for Admin Entity Management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  type AdminEntity,
} from "../lib/adminApi";
import { useToast } from "./use-toast";
import { logAuditEvent } from "../lib/adminApi";

/**
 * Fetch all entities
 */
export function useAdminEntities(type?: "hospital" | "clinic" | "pharmacy" | "lab") {
  return useQuery({
    queryKey: ["admin", "entities", type],
    queryFn: () => fetchEntities(type),
    staleTime: 30000,
  });
}

/**
 * Create entity mutation
 */
export function useCreateEntity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createEntity,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "entities"] });
      
      await logAuditEvent({
        userId: "current-user",
        userName: "Admin",
        action: `Created ${data.type}: ${data.name}`,
        entity: data.name,
        entityId: data.id,
        type: "create",
      });
      
      toast({
        title: "Entity created",
        description: `${data.name} has been successfully created.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating entity",
        description: error.message || "Failed to create entity. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update entity mutation
 */
export function useUpdateEntity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ entityId, data }: { entityId: string; data: Partial<AdminEntity> }) =>
      updateEntity(entityId, data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "entities"] });
      
      await logAuditEvent({
        userId: "current-user",
        userName: "Admin",
        action: `Updated entity: ${variables.entityId}`,
        entityId: variables.entityId,
        type: "update",
      });
      
      toast({
        title: "Entity updated",
        description: "Entity details have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating entity",
        description: error.message || "Failed to update entity. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete entity mutation
 */
export function useDeleteEntity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteEntity,
    onSuccess: async (_, entityId) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "entities"] });
      
      await logAuditEvent({
        userId: "current-user",
        userName: "Admin",
        action: `Deleted entity: ${entityId}`,
        entityId,
        type: "delete",
      });
      
      toast({
        title: "Entity deleted",
        description: "Entity has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting entity",
        description: error.message || "Failed to delete entity. Please try again.",
        variant: "destructive",
      });
    },
  });
}

