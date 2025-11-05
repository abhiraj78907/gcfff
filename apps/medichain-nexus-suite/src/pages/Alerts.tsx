import { Bell, AlertCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";

const alerts = [
  { id: 1, type: "Critical", entity: "AIIMS Delhi", message: "Inventory critically low for essential medicines", time: "5 min ago", icon: AlertCircle },
  { id: 2, type: "Warning", entity: "Apollo Clinic", message: "System maintenance scheduled for tonight", time: "1 hour ago", icon: AlertTriangle },
  { id: 3, type: "Info", entity: "PathLabs", message: "New equipment successfully installed and calibrated", time: "2 hours ago", icon: Info },
  { id: 4, type: "Critical", entity: "MedPlus Pharmacy", message: "Stock shortage detected for 5 medicines", time: "3 hours ago", icon: AlertCircle },
  { id: 5, type: "Warning", entity: "Fortis Hospital", message: "High patient queue in Emergency department", time: "4 hours ago", icon: AlertTriangle },
];

const Alerts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor system alerts and configure notification rules</p>
        </div>
        <Button className="bg-gradient-primary">
          <Bell className="mr-2 h-4 w-4" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-destructive mb-2">12</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-destructive mb-2">3</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-warning mb-2">6</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-info mb-2">3</p>
              <p className="text-sm text-muted-foreground">Info</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest system notifications requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              const borderColor = 
                alert.type === "Critical" ? "border-destructive" :
                alert.type === "Warning" ? "border-warning" : "border-info";
              
              return (
                <div key={alert.id} className={`border-l-4 ${borderColor} pl-4 py-3 bg-muted/50 rounded-r-lg`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${
                        alert.type === "Critical" ? "text-destructive" :
                        alert.type === "Warning" ? "text-warning" : "text-info"
                      }`} />
                      <div>
                        <h4 className="font-semibold">{alert.entity}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        alert.type === "Critical" ? "destructive" :
                        alert.type === "Warning" ? "default" : "secondary"
                      }
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Acknowledge</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
