/**
 * Permissions & Roles Page
 * Complete role management with permission matrix and CRUD operations
 */

import { useState } from "react";
import { Shield, Lock, CheckCircle, XCircle, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
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
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useToast } from "../hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const defaultRoles: Role[] = [
  { id: "1", name: "Super Admin", description: "Full system access", permissions: ["All Access"], userCount: 5 },
  { id: "2", name: "Hospital Admin", description: "Hospital management access", permissions: ["Hospital Management", "User Management"], userCount: 24 },
  { id: "3", name: "Doctor", description: "Clinical access", permissions: ["Patient Records", "Prescriptions"], userCount: 890 },
  { id: "4", name: "Receptionist", description: "Front desk operations", permissions: ["Registration", "Appointments"], userCount: 234 },
];

const availablePermissions = [
  "All Access",
  "Hospital Management",
  "Clinic Management",
  "Pharmacy Management",
  "Lab Management",
  "User Management",
  "Patient Records",
  "Prescriptions",
  "Registration",
  "Appointments",
  "Reports",
  "Analytics",
  "Settings",
  "Audit Logs",
];

const Permissions = () => {
  const { toast } = useToast();
  const { data: users = [] } = useAdminUsers();
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", permissions: [] as string[] });

  // Calculate statistics
  const stats = {
    totalRoles: roles.length,
    assignedUsers: users.length,
    permissions: availablePermissions.length,
    customRoles: roles.filter(r => !defaultRoles.find(dr => dr.id === r.id)).length,
  };

  const handleCreateRole = () => {
    setFormData({ name: "", description: "", permissions: [] });
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setFormData({ name: role.name, description: role.description, permissions: role.permissions });
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...formData } : r));
      toast({
        title: "Role updated",
        description: `${formData.name} has been updated.`,
      });
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
      toast({
        title: "Role created",
        description: `${formData.name} has been created.`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteRole = () => {
    if (!deleteRoleId) return;
    
    const role = roles.find(r => r.id === deleteRoleId);
    if (role && role.userCount > 0) {
      toast({
        title: "Cannot delete role",
        description: "This role has assigned users. Please reassign them first.",
        variant: "destructive",
      });
      setDeleteRoleId(null);
      return;
    }

    setRoles(roles.filter(r => r.id !== deleteRoleId));
    toast({
      title: "Role deleted",
      description: "Role has been successfully deleted.",
    });
    setDeleteRoleId(null);
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Permissions & Roles</h1>
          <p className="text-muted-foreground">Configure access control and role permissions</p>
        </div>
        <Button className="bg-gradient-primary" onClick={handleCreateRole}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stats.totalRoles}</p>
              <p className="text-sm text-muted-foreground">Total Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">{stats.assignedUsers}</p>
              <p className="text-sm text-muted-foreground">Assigned Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats.permissions}</p>
              <p className="text-sm text-muted-foreground">Permissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-warning mb-2">{stats.customRoles}</p>
              <p className="text-sm text-muted-foreground">Custom Roles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {role.description} • {role.userCount} users assigned
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteRoleId(role.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="outline" className="bg-muted">
                      <CheckCircle className="h-3 w-3 mr-1 text-success" />
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole ? "Update role details and permissions" : "Define a new role with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name *</Label>
              <Input
                id="role-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter role description"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-4 border rounded-md">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted"
                    onClick={() => togglePermission(permission)}
                  >
                    {formData.permissions.includes(permission) ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteRoleId} onOpenChange={(open) => !open && setDeleteRoleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Permissions;
