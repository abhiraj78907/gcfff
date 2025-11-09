/**
 * Users & Roles Management Page
 * Full CRUD operations with validation, error handling, and real-time updates
 */

import { useState, useMemo } from "react";
import { Users as UsersIcon, UserPlus, Shield, Mail, Search, Filter, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Avatar, AvatarFallback } from "@admin/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { Label } from "@admin/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@admin/components/ui/alert-dialog";
import { useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../hooks/useAdminUsers";
import { validateUser, type ValidationError } from "../lib/validation";
import type { UserRole } from "@shared/types/entities";
import type { AdminUser } from "../lib/adminApi";

/**
 * User Form Dialog Component
 */
function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSave,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser;
  onSave: (data: { name: string; email: string; roles: UserRole[]; entityId?: string }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    roles: (user?.roles || []) as UserRole[],
    entityId: user?.entityId || "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateUser(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSave(formData);
  };

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user details and roles" : "Create a new user account with assigned roles"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                className={errors.find(e => e.field === "name") ? "border-destructive" : ""}
              />
              {errors.find(e => e.field === "name") && (
                <p className="text-sm text-destructive">
                  {errors.find(e => e.field === "name")?.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="user@example.com"
                className={errors.find(e => e.field === "email") ? "border-destructive" : ""}
              />
              {errors.find(e => e.field === "email") && (
                <p className="text-sm text-destructive">
                  {errors.find(e => e.field === "email")?.message}
                </p>
              )}
            </div>

            {/* Roles Selection */}
            <div className="space-y-2">
              <Label>Roles *</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["admin", "doctor", "receptionist", "pharmacist", "lab-tech", "patient"] as UserRole[]).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={formData.roles.includes(role) ? "default" : "outline"}
                    onClick={() => handleRoleToggle(role)}
                    className="justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
              {errors.find(e => e.field === "roles") && (
                <p className="text-sm text-destructive">
                  {errors.find(e => e.field === "roles")?.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Main Users Component
 */
const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Fetch users with filters
  const { data: users = [], isLoading, error } = useAdminUsers({
    role: roleFilter !== "all" ? roleFilter : undefined,
    search: searchQuery || undefined,
  });

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.length; // TODO: Filter by status when available
    const admins = users.filter(u => u.roles.includes("admin")).length;
    const doctors = users.filter(u => u.roles.includes("doctor")).length;
    
    return { total, active, admins, doctors };
  }, [users]);

  // Handle create user
  const handleCreateUser = async (data: { name: string; email: string; roles: UserRole[]; entityId?: string }) => {
    try {
      await createUserMutation.mutateAsync(data);
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Handle update user
  const handleUpdateUser = async (data: { name: string; email: string; roles: UserRole[]; entityId?: string }) => {
    if (!editingUser) return;
    
    try {
      await updateUserMutation.mutateAsync({
        userId: editingUser.id,
        data,
      });
      setEditingUser(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await deleteUserMutation.mutateAsync(deleteUserId);
      setDeleteUserId(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Get role display name
  const getRoleDisplay = (roles: UserRole[]) => {
    if (roles.length === 0) return "No Role";
    if (roles.length === 1) return roles[0].charAt(0).toUpperCase() + roles[0].slice(1);
    return `${roles.length} Roles`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Users & Roles</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="receptionist">Receptionist</SelectItem>
            <SelectItem value="pharmacist">Pharmacist</SelectItem>
            <SelectItem value="lab-tech">Lab Technician</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats.admins}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary mb-2">{stats.doctors}</p>
              <p className="text-sm text-muted-foreground">Doctors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>All registered users across entities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading users. Please try again.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
          <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-primary text-white">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                      {user.entityId && (
                        <p className="text-xs text-muted-foreground mt-1">Entity: {user.entityId}</p>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-3 w-3 mr-1" />
                      {getRoleDisplay(user.roles)}
                  </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteUserId(user.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <UserFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleCreateUser}
        isLoading={createUserMutation.isPending}
      />

      {/* Edit User Dialog */}
      {editingUser && (
        <UserFormDialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
          onSave={handleUpdateUser}
          isLoading={updateUserMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
