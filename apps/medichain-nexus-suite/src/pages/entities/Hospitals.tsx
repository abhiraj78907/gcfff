/**
 * Hospitals Entity Management Page
 * Full CRUD operations with search, filters, and detailed views
 */

import { useState, useMemo } from "react";
import { Hospital, MapPin, Phone, Users, Activity, Plus, Edit, Trash2, Search, Loader2, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import { Textarea } from "@admin/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
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
import { useAdminEntities, useCreateEntity, useUpdateEntity, useDeleteEntity } from "../../hooks/useAdminEntities";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { AdminEntity } from "../../lib/adminApi";

const Hospitals = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "maintenance">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<AdminEntity | null>(null);
  const [deleteEntityId, setDeleteEntityId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    location: "",
    address: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  // Fetch hospitals
  const { data: entities = [], isLoading } = useAdminEntities("hospital");
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();
  const deleteMutation = useDeleteEntity();

  // Filter hospitals
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.subEntries?.[0]?.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [entities, searchQuery, statusFilter]);

  // Calculate statistics
  const stats = {
    total: entities.length,
    active: entities.filter(e => e.status === "active").length,
    totalPatients: entities.reduce((sum, e) => sum + (e.totalPatients || 0), 0),
  };

  const handleCreate = () => {
    setFormData({
      name: "",
      licenseNumber: "",
      location: "",
      address: "",
      contactPerson: "",
      email: "",
      phone: "",
    });
    setEditingEntity(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (entity: AdminEntity) => {
    setFormData({
      name: entity.name,
      licenseNumber: entity.licenseNumber,
      location: entity.subEntries?.[0]?.location || "",
      address: entity.subEntries?.[0]?.address || "",
      contactPerson: entity.subEntries?.[0]?.contactPerson || "",
      email: entity.subEntries?.[0]?.email || "",
      phone: entity.subEntries?.[0]?.phone || "",
    });
    setEditingEntity(entity);
    setIsAddDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Hospital name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const entityData: Partial<AdminEntity> = {
        type: "hospital",
        name: formData.name,
        licenseNumber: formData.licenseNumber,
        status: "active",
        subEntries: [{
          id: editingEntity?.subEntries?.[0]?.id || Date.now().toString(),
          entityId: editingEntity?.id || "",
          name: formData.name,
          location: formData.location,
          address: formData.address,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          status: "active",
          createdAt: editingEntity?.subEntries?.[0]?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      };

      if (editingEntity) {
        await updateMutation.mutateAsync({ entityId: editingEntity.id, data: entityData });
      } else {
        await createMutation.mutateAsync(entityData);
      }

      setIsAddDialogOpen(false);
      setEditingEntity(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!deleteEntityId) return;
    try {
      await deleteMutation.mutateAsync(deleteEntityId);
      setDeleteEntityId(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Hospitals</h1>
          <p className="text-muted-foreground">Manage and monitor all hospital entities</p>
        </div>
        <Button className="bg-gradient-primary" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hospital
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Hospitals</p>
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
              <p className="text-4xl font-bold text-accent mb-2">{stats.totalPatients.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading hospitals...</span>
        </div>
      ) : filteredEntities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Hospital className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No hospitals found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredEntities.map((entity) => (
            <Card 
              key={entity.id} 
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Hospital className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{entity.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {entity.subEntries?.[0]?.location || "Location not set"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={entity.status === "active" ? "default" : "secondary"}>
                    {entity.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{entity.totalPatients || 0}</p>
                    <p className="text-xs text-muted-foreground">Patients</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Activity className="h-4 w-4 mx-auto mb-1 text-secondary" />
                    <p className="text-lg font-bold">{entity.totalUsers || 0}</p>
                    <p className="text-xs text-muted-foreground">Staff</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Hospital className="h-4 w-4 mx-auto mb-1 text-accent" />
                    <p className="text-lg font-bold">-</p>
                    <p className="text-xs text-muted-foreground">Beds</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Phone className="h-4 w-4 mx-auto mb-1 text-info" />
                    <p className="text-xs text-muted-foreground mt-1">{entity.subEntries?.[0]?.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(entity)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteEntityId(entity.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntity ? "Edit Hospital" : "Add New Hospital"}</DialogTitle>
            <DialogDescription>
              {editingEntity ? "Update hospital details" : "Create a new hospital entity"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Hospital Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter hospital name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  placeholder="Enter license number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="hospital@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                  id="contact"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Contact person name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingEntity ? "Update Hospital" : "Create Hospital"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteEntityId} onOpenChange={(open) => !open && setDeleteEntityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hospital entity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Hospitals;
