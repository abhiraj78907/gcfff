import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, Users, FileText, Bell, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const navigate = useNavigate();

  const todayStats = [
    { label: "Registered Today", value: "45", icon: UserPlus, color: "text-primary", onClick: () => navigate("/dashboard/receptionist/register") },
    { label: "In Queue Now", value: "12", icon: Users, color: "text-warning", onClick: () => navigate("/dashboard/receptionist/queue") },
    { label: "Doctors Available", value: "3", icon: Users, color: "text-success", onClick: () => navigate("/dashboard/receptionist/doctors") },
    { label: "Invoices Generated", value: "8", icon: FileText, color: "text-info", onClick: () => navigate("/dashboard/receptionist/billing") },
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
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/receptionist/appointments")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            onClick={() => {
              const currentPath = window.location.pathname;
              const basePath = currentPath.includes("/dashboard/receptionist") 
                ? "/dashboard/receptionist" 
                : "/receptionist";
              navigate(`${basePath}/queue`);
            }}
          >
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
          <Card
            key={index}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={stat.onClick}
          >
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
          <Button
            className="w-full"
            variant="default"
            onClick={() => navigate("/dashboard/receptionist/register")}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register New Patient
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/dashboard/receptionist/appointments")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/dashboard/receptionist/queue")}
          >
            <Users className="w-4 h-4 mr-2" />
            View Queue
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/dashboard/receptionist/billing")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Bill
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/receptionist/queue")}
            >
              View All →
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b last:border-0 cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                onClick={() => navigate("/dashboard/receptionist/queue")}
              >
                <div className="text-sm text-muted-foreground w-16 flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </div>
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
