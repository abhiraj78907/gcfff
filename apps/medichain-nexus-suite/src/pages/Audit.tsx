import { FileText, User, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";

const auditLogs = [
  { id: 1, user: "Dr. Rajesh Kumar", action: "Updated patient record", entity: "AIIMS Delhi", time: "2 min ago", type: "Update" },
  { id: 2, user: "Priya Sharma", action: "Added new user account", entity: "Apollo Hospital", time: "15 min ago", type: "Create" },
  { id: 3, user: "Amit Patel", action: "Registered new patient", entity: "Fortis Hospital", time: "23 min ago", type: "Create" },
  { id: 4, user: "Admin User", action: "Modified permissions", entity: "System", time: "1 hour ago", type: "Security" },
  { id: 5, user: "Sunita Reddy", action: "Dispensed prescription", entity: "MedPlus Pharmacy", time: "1 hour ago", type: "Transaction" },
];

const Audit = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search logs..." className="max-w-md" />
        <Button variant="outline">Date Range</Button>
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">2,847</p>
              <p className="text-sm text-muted-foreground">Total Events Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">1,234</p>
              <p className="text-sm text-muted-foreground">User Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-warning mb-2">45</p>
              <p className="text-sm text-muted-foreground">Security Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">892</p>
              <p className="text-sm text-muted-foreground">System Changes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-sm">{log.user}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.entity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {log.time}
                  </div>
                  <Button variant="ghost" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Audit;
