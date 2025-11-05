import { StatCard } from "@seva/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@seva/components/ui/card";
import { Button } from "@seva/components/ui/button";
import { Users, UserCheck, Stethoscope, Calendar as CalendarIcon, Plus, List } from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const departmentData = [
  { name: "General", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Cardiology", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Pediatrics", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Orthopedics", value: 10, color: "hsl(var(--chart-4))" },
];

const weeklyData = [
  { day: "Mon", patients: 45 },
  { day: "Tue", patients: 52 },
  { day: "Wed", patients: 48 },
  { day: "Thu", patients: 61 },
  { day: "Fri", patients: 55 },
  { day: "Sat", patients: 38 },
  { day: "Sun", patients: 28 },
];

const recentActivity = [
  { id: 1, patient: "Rajesh Kumar", time: "10 mins ago", doctor: "Dr. Sharma", action: "Registered" },
  { id: 2, patient: "Priya Singh", time: "25 mins ago", doctor: "Dr. Patel", action: "Checked In" },
  { id: 3, patient: "Amit Verma", time: "35 mins ago", doctor: "Dr. Reddy", action: "Registered" },
  { id: 4, patient: "Sunita Devi", time: "1 hour ago", doctor: "Dr. Kumar", action: "Completed" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your daily overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Patients Registered"
          value="127"
          icon={Users}
          trend="+12% from yesterday"
          variant="primary"
        />
        <StatCard
          title="Currently Waiting"
          value="34"
          icon={UserCheck}
          trend="8 in priority queue"
          variant="warning"
        />
        <StatCard
          title="Doctors Available"
          value="18"
          icon={Stethoscope}
          trend="2 on break"
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Distribution by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Registration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{activity.patient}</p>
                      <p className="text-sm text-muted-foreground">Assigned to {activity.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <span className="inline-flex items-center rounded-full bg-success-light px-2 py-1 text-xs font-medium text-success">
                      {activity.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Register New Patient
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <List className="mr-2 h-4 w-4" />
              View Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
