/**
 * Admin Dashboard Overview Page
 * Real-time insights with clickable cards and navigation
 */

import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Activity, 
  Stethoscope, 
  TrendingUp,
  Hospital,
  Building2,
  Pill,
  FlaskConical,
  Clock,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { KPICard } from "@admin/components/dashboard/KPICard";
import { ActivityChart } from "@admin/components/dashboard/ActivityChart";
import { EntityMap } from "@admin/components/dashboard/EntityMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { useAdminAnalytics } from "../hooks/useAdminAnalytics";
import { useAdminEntities } from "../hooks/useAdminEntities";
import { fetchAlerts } from "../lib/adminApi";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  
  // Fetch entities for counts
  const { data: entities = [], isLoading: entitiesLoading } = useAdminEntities();
  
  // Fetch recent alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["admin", "alerts", "recent"],
    queryFn: () => fetchAlerts({ acknowledged: false }),
    select: (data) => data.slice(0, 3), // Get top 3
  });

  // Calculate entity counts
  const entityCounts = {
    hospitals: entities.filter(e => e.type === "hospital").length,
    clinics: entities.filter(e => e.type === "clinic").length,
    pharmacies: entities.filter(e => e.type === "pharmacy").length,
    labs: entities.filter(e => e.type === "lab").length,
    active: entities.filter(e => e.status === "active").length,
  };

  // Mock data for charts (will be replaced with real data from analytics)
const consultationData = [
  { month: "Jan", consultations: 4200 },
  { month: "Feb", consultations: 5100 },
  { month: "Mar", consultations: 4800 },
  { month: "Apr", consultations: 6200 },
  { month: "May", consultations: 7100 },
  { month: "Jun", consultations: 6800 },
];

const prescriptionData = [
  { day: "Mon", prescriptions: 320 },
  { day: "Tue", prescriptions: 445 },
  { day: "Wed", prescriptions: 380 },
  { day: "Thu", prescriptions: 510 },
  { day: "Fri", prescriptions: 490 },
  { day: "Sat", prescriptions: 420 },
  { day: "Sun", prescriptions: 280 },
];

  const handleEntityClick = (type: "hospital" | "clinic" | "pharmacy" | "lab") => {
    navigate(`/entities/${type}s`);
  };

  const handleAlertClick = (alertId: string) => {
    navigate(`/dashboard/admin/alerts?highlight=${alertId}`);
  };

  const handleViewAllAlerts = () => {
    navigate("/dashboard/admin/alerts");
  };

  const handleViewAnalytics = () => {
    navigate("/dashboard/admin/analytics");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Real-time insights across all healthcare entities
        </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewAnalytics}>
            View Analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div onClick={() => navigate("/dashboard/admin/analytics")} className="cursor-pointer">
        <KPICard
          title="Total Patients"
            value={analytics?.totalPatients?.toLocaleString() || "0"}
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          iconColor="primary"
          subtitle="Active registrations"
        />
        </div>
        <div onClick={() => navigate("/dashboard/admin/analytics")} className="cursor-pointer">
        <KPICard
          title="Daily Consultations"
            value={analytics?.totalConsultations?.toLocaleString() || "0"}
          change="+8.2% from yesterday"
          changeType="positive"
          icon={Stethoscope}
          iconColor="secondary"
          subtitle="Across all entities"
        />
        </div>
        <div onClick={() => navigate("/dashboard/admin/map")} className="cursor-pointer">
        <KPICard
          title="Active Entities"
            value={entityCounts.active.toString()}
            change={`${entityCounts.hospitals} Hospitals, ${entityCounts.clinics} Clinics`}
          changeType="neutral"
          icon={Hospital}
          iconColor="accent"
            subtitle={`${entityCounts.pharmacies} Pharmacies, ${entityCounts.labs} Labs`}
        />
        </div>
        <KPICard
          title="System Health"
          value="98.7%"
          change="All systems operational"
          changeType="positive"
          icon={Activity}
          iconColor="success"
          subtitle="Uptime last 24h"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewAnalytics}>
          <CardHeader className="text-center">
            <CardTitle>Monthly Consultations</CardTitle>
            <CardDescription>Consultation trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
        <ActivityChart
          data={consultationData}
          type="area"
          dataKey="consultations"
          xAxisKey="month"
        />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewAnalytics}>
          <CardHeader className="text-center">
            <CardTitle>Weekly Prescriptions</CardTitle>
            <CardDescription>Prescriptions dispensed this week</CardDescription>
          </CardHeader>
          <CardContent>
        <ActivityChart
          data={prescriptionData}
          type="bar"
          dataKey="prescriptions"
          xAxisKey="day"
        />
          </CardContent>
        </Card>
      </div>

      {/* Map and Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Entity Map</CardTitle>
              <CardDescription>Geographic distribution of healthcare entities</CardDescription>
            </CardHeader>
            <CardContent>
          <EntityMap />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
                <CardTitle>Recent Alerts</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewAllAlerts}>
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Latest system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border-l-2 border-primary pl-4 py-2 cursor-pointer hover:bg-muted/50 rounded-r transition-colors"
                  onClick={() => handleAlertClick(alert.id)}
                >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm">{alert.entity}</h4>
                  <Badge
                    variant={
                        alert.type === "critical" ? "destructive" :
                        alert.type === "warning" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {alert.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Entity Status Cards - Clickable */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: Hospital, 
            label: "Hospitals", 
            count: entityCounts.hospitals, 
            active: entityCounts.hospitals, 
            color: "primary",
            route: "/dashboard/admin/entities/hospitals"
          },
          { 
            icon: Building2, 
            label: "Clinics", 
            count: entityCounts.clinics, 
            active: entityCounts.clinics, 
            color: "secondary",
            route: "/dashboard/admin/entities/clinics"
          },
          { 
            icon: Pill, 
            label: "Pharmacies", 
            count: entityCounts.pharmacies, 
            active: entityCounts.pharmacies, 
            color: "accent",
            route: "/dashboard/admin/entities/pharmacies"
          },
          { 
            icon: FlaskConical, 
            label: "Laboratories", 
            count: entityCounts.labs, 
            active: entityCounts.labs, 
            color: "success",
            route: "/dashboard/admin/entities/labs"
          },
        ].map((entity) => (
          <Card 
            key={entity.label} 
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate(entity.route)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <entity.icon className={`h-8 w-8 text-${entity.color} group-hover:scale-110 transition-transform`} />
                <Badge variant="outline">{entity.active} Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
              <h3 className="text-2xl font-bold mb-1">{entity.count}</h3>
              <p className="text-sm text-muted-foreground">{entity.label}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
