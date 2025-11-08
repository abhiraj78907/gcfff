/**
 * React Query hooks for Admin User Management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  type AdminUser,
} from "../lib/adminApi";
import { useToast } from "./use-toast";
import { logAuditEvent } from "../lib/adminApi";
import type { UserRole } from "@shared/types/entities";

/**
 * Fetch all users with filters
 */
export function useAdminUsers(params?: {
  role?: UserRole;
  entityId?: string;
  status?: "active" | "inactive";
  search?: string;
}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => fetchUsers(params),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Create new user mutation
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (data) => {
      // Invalidate users list
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      
      // Log audit event
      await logAuditEvent({
        userId: "current-user", // TODO: Get from auth context
        userName: "Admin",
        action: `Created user: ${data.name}`,
        type: "create",
        details: { userId: data.id, email: data.email, roles: data.roles },
      });
      
      toast({
        title: "User created",
        description: `${data.name} has been successfully created.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating user",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Update user mutation
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<AdminUser> }) =>
      updateUser(userId, data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      
      await logAuditEvent({
        userId: "current-user",
        userName: "Admin",
        action: `Updated user: ${variables.userId}`,
        type: "update",
        details: { userId: variables.userId, changes: variables.data },
      });
      
      toast({
        title: "User updated",
        description: "User details have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating user",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Delete user mutation
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async (_, userId) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      
      await logAuditEvent({
        userId: "current-user",
        userName: "Admin",
        action: `Deleted user: ${userId}`,
        type: "delete",
        details: { userId },
      });
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting user",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });
}

