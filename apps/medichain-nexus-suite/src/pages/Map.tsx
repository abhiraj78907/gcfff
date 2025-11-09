/**
 * Geographic Map Page
 * Interactive map with entity markers, filtering, and details
 */

import { useState } from "react";
import { EntityMap } from "@admin/components/dashboard/EntityMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { MapPin, Filter, Hospital, Building2, Pill, FlaskConical } from "lucide-react";
import { useAdminEntities } from "../hooks/useAdminEntities";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Map = () => {
  const navigate = useNavigate();
  const [entityTypeFilter, setEntityTypeFilter] = useState<"all" | "hospital" | "clinic" | "pharmacy" | "lab">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "maintenance">("all");

  // Fetch entities
  const { data: entities = [], isLoading } = useAdminEntities(
    entityTypeFilter !== "all" ? entityTypeFilter : undefined
  );

  // Filter entities
  const filteredEntities = entities.filter(entity => {
    if (statusFilter === "all") return true;
    return entity.status === statusFilter;
  });

  // Calculate statistics
  const stats = {
    total: entities.length,
    active: entities.filter(e => e.status === "active").length,
    maintenance: entities.filter(e => e.status === "maintenance").length,
    critical: entities.filter(e => e.status === "inactive").length,
  };

  const handleEntityClick = (entityId: string, type: string) => {
    // Navigate to the specific entity type page with the entity ID
    const typeMap: Record<string, string> = {
      'hospital': 'hospitals',
      'clinic': 'clinics',
      'pharmacy': 'pharmacies',
      'lab': 'labs'
    };
    const routeType = typeMap[type] || type;
    navigate(`/entities/${routeType}?id=${entityId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Geographic Map</h1>
          <p className="text-muted-foreground">Real-time location tracking of all healthcare entities</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Entities</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Now</p>
            <p className="text-3xl font-bold text-success">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Maintenance</p>
            <p className="text-3xl font-bold text-warning">{stats.maintenance}</p>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Critical</p>
            <p className="text-3xl font-bold text-destructive">{stats.critical}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Entities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Entity Type</label>
              <Select value={entityTypeFilter} onValueChange={(value) => setEntityTypeFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hospital">
                    <div className="flex items-center gap-2">
                      <Hospital className="h-4 w-4" />
                      Hospitals
                    </div>
                  </SelectItem>
                  <SelectItem value="clinic">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Clinics
                    </div>
                  </SelectItem>
                  <SelectItem value="pharmacy">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Pharmacies
                    </div>
                  </SelectItem>
                  <SelectItem value="lab">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" />
                      Laboratories
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Locations</CardTitle>
          <CardDescription>
            {filteredEntities.length} entities displayed on map
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading map...</span>
            </div>
          ) : (
            <div className="h-[600px] rounded-lg overflow-hidden">
              <EntityMap />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entity List */}
      <Card>
        <CardHeader>
          <CardTitle>Entity List</CardTitle>
          <CardDescription>Click to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntities.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No entities found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEntities.slice(0, 9).map((entity) => (
                <Card
                  key={entity.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleEntityClick(entity.id, entity.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {entity.type === "hospital" && <Hospital className="h-5 w-5 text-primary" />}
                        {entity.type === "clinic" && <Building2 className="h-5 w-5 text-secondary" />}
                        {entity.type === "pharmacy" && <Pill className="h-5 w-5 text-accent" />}
                        {entity.type === "lab" && <FlaskConical className="h-5 w-5 text-success" />}
                        <h4 className="font-semibold">{entity.name}</h4>
                      </div>
                      <Badge variant={entity.status === "active" ? "default" : "secondary"}>
                        {entity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{entity.subEntries?.[0]?.location || "Location not set"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Map;
