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
  AlertCircle
} from "lucide-react";
import { KPICard } from "@admin/components/dashboard/KPICard";
import { ActivityChart } from "@admin/components/dashboard/ActivityChart";
import { EntityMap } from "@admin/components/dashboard/EntityMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";

// Mock data for charts
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

const recentAlerts = [
  { id: 1, entity: "AIIMS Delhi", type: "Critical", message: "Inventory low for essential medicines", time: "5 min ago" },
  { id: 2, entity: "Apollo Clinic", type: "Warning", message: "System maintenance scheduled", time: "1 hour ago" },
  { id: 3, entity: "PathLabs", type: "Info", message: "New equipment installed", time: "2 hours ago" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Real-time insights across all healthcare entities
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Patients"
          value="48,524"
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          iconColor="primary"
          subtitle="Active registrations"
        />
        <KPICard
          title="Daily Consultations"
          value="1,284"
          change="+8.2% from yesterday"
          changeType="positive"
          icon={Stethoscope}
          iconColor="secondary"
          subtitle="Across all entities"
        />
        <KPICard
          title="Active Entities"
          value="312"
          change="24 Hospitals, 156 Clinics"
          changeType="neutral"
          icon={Hospital}
          iconColor="accent"
          subtitle="89 Pharmacies, 43 Labs"
        />
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
        <ActivityChart
          title="Monthly Consultations"
          description="Consultation trends over the last 6 months"
          data={consultationData}
          type="area"
          dataKey="consultations"
          xAxisKey="month"
        />
        <ActivityChart
          title="Weekly Prescriptions"
          description="Prescriptions dispensed this week"
          data={prescriptionData}
          type="bar"
          dataKey="prescriptions"
          xAxisKey="day"
        />
      </div>

      {/* Map and Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EntityMap />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="border-l-2 border-primary pl-4 py-2">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm">{alert.entity}</h4>
                  <Badge
                    variant={
                      alert.type === "Critical" ? "destructive" :
                      alert.type === "Warning" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {alert.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Entity Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Hospital, label: "Hospitals", count: 24, active: 23, color: "primary" },
          { icon: Building2, label: "Clinics", count: 156, active: 152, color: "secondary" },
          { icon: Pill, label: "Pharmacies", count: 89, active: 87, color: "accent" },
          { icon: FlaskConical, label: "Laboratories", count: 43, active: 42, color: "success" },
        ].map((entity) => (
          <Card key={entity.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <entity.icon className={`h-8 w-8 text-${entity.color}`} />
                <Badge variant="outline">{entity.active} Active</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{entity.count}</h3>
              <p className="text-sm text-muted-foreground">{entity.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
