import { ActivityChart } from "@admin/components/dashboard/ActivityChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Users } from "lucide-react";

const patientFlowData = [
  { month: "Jan", registered: 3200, consultations: 2800, followups: 1200 },
  { month: "Feb", registered: 4100, consultations: 3600, followups: 1500 },
  { month: "Mar", registered: 3800, consultations: 3200, followups: 1400 },
  { month: "Apr", registered: 5200, consultations: 4800, followups: 2100 },
  { month: "May", registered: 6100, consultations: 5600, followups: 2400 },
  { month: "Jun", registered: 5800, consultations: 5200, followups: 2200 },
];

const departmentData = [
  { department: "General", patients: 2400 },
  { department: "Cardiology", patients: 1800 },
  { department: "Orthopedics", patients: 1600 },
  { department: "Pediatrics", patients: 2200 },
  { department: "ENT", patients: 1400 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Deep insights into healthcare operations and trends</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Avg. Consultation Time", value: "24 min", icon: Activity, trend: "-5%", positive: true },
          { label: "Patient Satisfaction", value: "4.6/5", icon: TrendingUp, trend: "+0.3", positive: true },
          { label: "Wait Time", value: "18 min", icon: TrendingDown, trend: "+2 min", positive: false },
          { label: "Completion Rate", value: "94%", icon: Users, trend: "+3%", positive: true },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-5 w-5 text-primary" />
                <span className={`text-sm ${metric.positive ? 'text-success' : 'text-destructive'}`}>
                  {metric.trend}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActivityChart
        title="Patient Flow Analysis"
        description="Monthly trends for patient registrations, consultations, and follow-ups"
        data={patientFlowData}
        type="line"
        dataKey="consultations"
        xAxisKey="month"
        height={350}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityChart
          title="Department Utilization"
          description="Patient distribution across departments"
          data={departmentData}
          type="bar"
          dataKey="patients"
          xAxisKey="department"
        />
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key metrics summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { metric: "Most Active Department", value: "General Medicine", change: "2,400 patients" },
              { metric: "Peak Hours", value: "10 AM - 2 PM", change: "65% of traffic" },
              { metric: "Average Queue Size", value: "12 patients", change: "Per department" },
              { metric: "Doctor Utilization", value: "87%", change: "Across all entities" },
            ].map((item) => (
              <div key={item.metric} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.metric}</p>
                  <p className="text-xs text-muted-foreground">{item.change}</p>
                </div>
                <p className="text-lg font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
