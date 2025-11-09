/**
 * Entity Detail Dashboard Page
 * Shows complete dashboard for a specific entity with isolated data
 * Works for Hospitals, Clinics, Pharmacies, and Labs
 */

import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAdminEntities } from "../../hooks/useAdminEntities";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import { ActivityChart } from "@admin/components/dashboard/ActivityChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { ArrowLeft, Hospital, Building2, Pill, FlaskConical, Users, Activity, MapPin, Phone, Mail, Calendar, Loader2 } from "lucide-react";
import { useMemo } from "react";

const EntityDetail = () => {
  const location = useLocation();
  const type = location.pathname.includes("/hospitals") ? "hospitals" :
               location.pathname.includes("/clinics") ? "clinics" :
               location.pathname.includes("/pharmacies") ? "pharmacies" :
               location.pathname.includes("/labs") ? "labs" : null;
  const [searchParams] = useSearchParams();
  const entityId = searchParams.get("id");
  const navigate = useNavigate();

  // Fetch entities of the specific type
  const entityType = type === "hospitals" ? "hospital" :
                     type === "clinics" ? "clinic" :
                     type === "pharmacies" ? "pharmacy" :
                     type === "labs" ? "lab" : undefined;
  const { data: entities = [], isLoading } = useAdminEntities(entityType);
  
  // Find the specific entity
  const entity = useMemo(() => {
    if (!entityId) return null;
    return entities.find(e => e.id === entityId);
  }, [entities, entityId]);

  // Fetch analytics for this entity
  const { data: analytics } = useAdminAnalytics({ entityId: entityId || undefined });

  const getEntityIcon = () => {
    switch (type) {
      case "hospitals":
        return Hospital;
      case "clinics":
        return Building2;
      case "pharmacies":
        return Pill;
      case "labs":
        return FlaskConical;
      default:
        return Activity;
    }
  };

  const getEntityTypeLabel = () => {
    switch (type) {
      case "hospitals":
        return "Hospital";
      case "clinics":
        return "Clinic";
      case "pharmacies":
        return "Pharmacy";
      case "labs":
        return "Laboratory";
      default:
        return "Entity";
    }
  };

  // Mock data for entity-specific charts
  const consultationData = [
    { month: "Jan", consultations: 420 },
    { month: "Feb", consultations: 510 },
    { month: "Mar", consultations: 480 },
    { month: "Apr", consultations: 620 },
    { month: "May", consultations: 710 },
    { month: "Jun", consultations: 680 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading entity details...</span>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(`/entities/${type}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {getEntityTypeLabel()}s
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Entity not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const EntityIcon = getEntityIcon();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(`/entities/${type}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <EntityIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{entity.name}</h1>
              <p className="text-muted-foreground">{getEntityTypeLabel()} Dashboard</p>
            </div>
          </div>
        </div>
        <Badge variant={entity.status === "active" ? "default" : "secondary"}>
          {entity.status}
        </Badge>
      </div>

      {/* Entity Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{entity.subEntries?.[0]?.location || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{entity.subEntries?.[0]?.phone || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{entity.subEntries?.[0]?.email || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{entity.subEntries?.[0]?.contactPerson || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">License Number</p>
                <p className="font-medium">{entity.licenseNumber || "Not set"}</p>
              </div>
            </div>
            {entity.subEntries?.[0]?.address && (
              <div className="flex items-start gap-3 md:col-span-2 lg:col-span-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{entity.subEntries[0].address}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <Badge variant="outline">{entity.totalPatients || 0}</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">{entity.totalPatients || 0}</p>
            <p className="text-sm text-muted-foreground">
              {type === "pharmacies" ? "Prescriptions" : type === "labs" ? "Tests" : "Patients"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-secondary" />
              <Badge variant="outline">{entity.totalUsers || 0}</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">{entity.totalUsers || 0}</p>
            <p className="text-sm text-muted-foreground">Staff Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-accent" />
              <Badge variant="outline">Today</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">
              {type === "pharmacies" ? "45" : type === "labs" ? "23" : "128"}
            </p>
            <p className="text-sm text-muted-foreground">
              {type === "pharmacies" ? "Prescriptions Today" : type === "labs" ? "Tests Today" : "Consultations Today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-success" />
              <Badge variant="outline">Active</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">98.5%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityChart
          title={`${getEntityTypeLabel()} Activity`}
          description="Monthly activity trends"
          data={consultationData}
          type="area"
          dataKey="consultations"
          xAxisKey="month"
        />
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest operations and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "New patient registered", time: "2 hours ago" },
                { action: "Consultation completed", time: "3 hours ago" },
                { action: "Staff member added", time: "1 day ago" },
                { action: "System update applied", time: "2 days ago" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntityDetail;

