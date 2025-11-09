/**
 * Audit Logs Page
 * Complete audit trail with filtering, search, export, and detailed views
 */

import { useState, useMemo } from "react";
import { FileText, User, Clock, Filter, Search, Download, Calendar, Eye, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import { useAdminAuditLogs } from "../hooks/useAdminAudit";
import { useToast } from "../hooks/use-toast";
import type { AuditLog } from "../lib/adminApi";

const Audit = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"today" | "7d" | "30d" | "all">("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Calculate date range
  const getDateRange = () => {
    if (dateRange === "all") return {};
    
    const end = new Date();
    let start = new Date();
    
    switch (dateRange) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "7d":
        start.setDate(end.getDate() - 7);
        break;
      case "30d":
        start.setDate(end.getDate() - 30);
        break;
    }
    
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };

  const dateParams = getDateRange();
  const actionFilter = searchQuery || undefined;

  // Fetch audit logs
  const { data: logs = [], isLoading } = useAdminAuditLogs({
    ...dateParams,
    action: actionFilter,
  });

  // Filter logs
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    if (typeFilter !== "all") {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.entity?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [logs, typeFilter, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const userActions = filteredLogs.filter(l => l.type === "create" || l.type === "update" || l.type === "delete").length;
    const securityEvents = filteredLogs.filter(l => l.type === "security").length;
    const systemChanges = filteredLogs.filter(l => l.type === "update" || l.type === "delete").length;

    return { total, userActions, securityEvents, systemChanges };
  }, [filteredLogs]);

  const handleExport = (format: "CSV" | "PDF") => {
    try {
      let content = "";
      let mimeType = "";
      let extension = "";
      
      if (format === "CSV") {
        // Create CSV content
        const headers = ["Timestamp", "User", "Action", "Entity", "Type"];
        const rows = filteredLogs.map(log => [
          new Date(log.timestamp).toLocaleString(),
          log.userName,
          log.action,
          log.entity || "N/A",
          log.type,
        ]);
        content = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
        mimeType = "text/csv";
        extension = "csv";
      } else if (format === "PDF") {
        // For PDF, create a text representation (in production, use a PDF library)
        content = `Audit Logs Report\nGenerated: ${new Date().toLocaleString()}\n\n\n`;
        filteredLogs.forEach(log => {
          content += `[${new Date(log.timestamp).toLocaleString()}] ${log.userName} - ${log.action}\n`;
          content += `  Entity: ${log.entity || "N/A"} | Type: ${log.type}\n\n`;
        });
        mimeType = "text/plain";
        extension = "txt";
      }
      
      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split("T")[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export complete",
        description: `Audit logs exported as ${format}`,
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export audit logs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "create":
        return "default";
      case "update":
        return "secondary";
      case "delete":
        return "destructive";
      case "security":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("CSV")}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("PDF")}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                <SelectTrigger>
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">{stats.userActions}</p>
              <p className="text-sm text-muted-foreground">User Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-warning mb-2">{stats.securityEvents}</p>
              <p className="text-sm text-muted-foreground">Security Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats.systemChanges}</p>
              <p className="text-sm text-muted-foreground">System Changes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading audit logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No audit logs found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(log)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium text-sm">{log.userName}</span>
                        <Badge variant={getTypeBadgeVariant(log.type) as any} className="text-xs">
                          {log.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{log.action}</p>
                      {log.entity && (
                        <p className="text-xs text-muted-foreground mt-1">{log.entity}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Complete information about this audit event</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="font-medium">{selectedLog.userName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-medium">{selectedLog.userId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant={getTypeBadgeVariant(selectedLog.type) as any}>
                    {selectedLog.type}
                  </Badge>
                </div>
                {selectedLog.entity && (
                  <div>
                    <Label className="text-muted-foreground">Entity</Label>
                    <p className="font-medium">{selectedLog.entity}</p>
                  </div>
                )}
                {selectedLog.entityId && (
                  <div>
                    <Label className="text-muted-foreground">Entity ID</Label>
                    <p className="font-medium">{selectedLog.entityId}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Details</Label>
                  <pre className="mt-2 p-4 bg-muted rounded-md text-sm overflow-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Audit;
