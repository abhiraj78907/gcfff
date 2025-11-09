/**
 * Alerts & Notifications Page
 * Alert management, acknowledgment, filtering, and configuration
 */

import { useState, useMemo } from "react";
import { Bell, AlertCircle, AlertTriangle, Info, Clock, CheckCircle, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchAlerts, acknowledgeAlert } from "../lib/adminApi";
import { useToast } from "../hooks/use-toast";
import type { Alert } from "../lib/adminApi";

const Alerts = () => {
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<"all" | "true" | "false">("false");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch alerts
  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ["admin", "alerts", typeFilter, acknowledgedFilter],
    queryFn: () => fetchAlerts({
      type: typeFilter !== "all" ? typeFilter : undefined,
      acknowledged: acknowledgedFilter === "all" ? undefined : acknowledgedFilter === "true",
    }),
  });

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.entity.toLowerCase().includes(searchLower) ||
        alert.message.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [alerts, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const active = alerts.filter(a => !a.acknowledged).length;
    const critical = alerts.filter(a => a.type === "critical" && !a.acknowledged).length;
    const warnings = alerts.filter(a => a.type === "warning" && !a.acknowledged).length;
    const info = alerts.filter(a => a.type === "info" && !a.acknowledged).length;

    return { active, critical, warnings, info };
  }, [alerts]);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId, "current-user-id"); // TODO: Get from auth context
      toast({
        title: "Alert acknowledged",
        description: "Alert has been marked as acknowledged.",
      });
      await refetch();
    } catch (error: any) {
      toast({
        title: "Error acknowledging alert",
        description: error.message || "Failed to acknowledge alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertCircle;
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "secondary";
    }
  };

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
              <p className="text-4xl font-bold text-destructive mb-2">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-destructive mb-2">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-warning mb-2">{stats.warnings}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-info mb-2">{stats.info}</p>
              <p className="text-sm text-muted-foreground">Info</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={acknowledgedFilter} onValueChange={(value) => setAcknowledgedFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="false">Unacknowledged</SelectItem>
                  <SelectItem value="true">Acknowledged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest system notifications requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No alerts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                const borderColor = 
                  alert.type === "critical" ? "border-destructive" :
                  alert.type === "warning" ? "border-warning" : "border-info";
                
                return (
                  <div
                    key={alert.id}
                    className={`border-l-4 ${borderColor} pl-4 py-3 bg-muted/50 rounded-r-lg ${
                      alert.acknowledged ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${
                          alert.type === "critical" ? "text-destructive" :
                          alert.type === "warning" ? "text-warning" : "text-info"
                        }`} />
                        <div>
                          <h4 className="font-semibold">{alert.entity}</h4>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.acknowledged && (
                          <Badge variant="outline" className="bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                        <Badge variant={getAlertColor(alert.type) as any}>
                          {alert.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
