import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Long wait time in Cardiology",
    message: "Average wait time has exceeded 30 minutes",
    time: "5 mins ago",
  },
  {
    id: 2,
    type: "info",
    title: "Dr. Patel on break",
    message: "Expected to return in 15 minutes",
    time: "10 mins ago",
  },
  {
    id: 3,
    type: "success",
    title: "Registration completed",
    message: "Patient T015 successfully registered",
    time: "15 mins ago",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertCircle className="h-5 w-5 text-warning" />;
    case "info":
      return <Clock className="h-5 w-5 text-primary" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Notifications</h2>
        <p className="text-muted-foreground">System alerts and operational updates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-foreground">{notification.title}</h4>
                    <Badge variant="outline" className="ml-2">
                      {notification.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
