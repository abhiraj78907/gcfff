import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, Users, FileText, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const todayStats = [
    { label: "Registered Today", value: "45", icon: UserPlus, color: "text-primary" },
    { label: "In Queue Now", value: "12", icon: Users, color: "text-warning" },
    { label: "Doctors Available", value: "3", icon: Users, color: "text-success" },
    { label: "Invoices Generated", value: "8", icon: FileText, color: "text-info" },
  ];

  const recentActivity = [
    { time: "9:45 AM", patient: "Ramesh Kumar", id: "VIMS-2025-12345", doctor: "Dr. Sharma" },
    { time: "9:30 AM", patient: "Sita Devi", id: "VIMS-2025-12344", doctor: "Dr. Patil" },
    { time: "9:15 AM", patient: "Abdul Khan", id: "VIMS-2025-12343", doctor: "Cardiology" },
  ];

  const alerts = [
    { type: "warning", message: "Dr. Patil consultation running 15 mins late" },
    { type: "info", message: "System maintenance scheduled for tonight 11 PM" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Sita</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {todayStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/dashboard/receptionist/register">
            <Button className="w-full" variant="default">
              <UserPlus className="w-4 h-4 mr-2" />
              Register New Patient
            </Button>
          </Link>
          <Link to="/dashboard/receptionist/appointments">
            <Button className="w-full" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
          <Link to="/dashboard/receptionist/queue">
            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              View Queue
            </Button>
          </Link>
          <Link to="/dashboard/receptionist/billing">
            <Button className="w-full" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Bill
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm">View All →</Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="text-sm text-muted-foreground w-16 flex-shrink-0">{activity.time}</div>
                <div className="flex-1">
                  <p className="font-medium">{activity.patient}</p>
                  <p className="text-sm text-muted-foreground">ID: {activity.id}</p>
                </div>
                <div className="text-sm text-muted-foreground">→ {activity.doctor}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.type === "warning"
                    ? "bg-warning/10 border-warning/20"
                    : "bg-info/10 border-info/20"
                }`}
              >
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
