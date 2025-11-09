/**
 * Dashboard Header Component
 * Includes notifications dropdown with dynamic alerts, search, and user menu
 */

import { Bell, Search, LogOut, Settings, ChevronDown, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import { Badge } from "@admin/components/ui/badge";
import { SidebarTrigger } from "@admin/components/ui/sidebar";
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "../../lib/adminApi";
import { ScrollArea } from "@admin/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export const DashboardHeader = () => {
  const { user, logout, activeRole } = useAuth();
  const { currentEntity } = useSubEntry();
  const navigate = useNavigate();

  // Fetch recent unacknowledged alerts for notifications
  const { data: alerts = [] } = useQuery({
    queryKey: ["admin", "alerts", "header"],
    queryFn: () => fetchAlerts({ acknowledged: false }),
    select: (data) => data.slice(0, 5), // Get top 5 for dropdown
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = alerts.length;

  const handleLogout = () => {
    try {
      // Call logout function to clear auth state
    logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Immediately redirect to login page using full URL
    // This ensures a full page reload and prevents back navigation
    // Uses window.location.origin to work in both dev and production
    const loginUrl = `${window.location.origin}/onboard/login`;
    window.location.replace(loginUrl);
  };

  const handleSettings = () => {
    navigate("/dashboard/admin/settings");
  };

  const handleNotificationClick = (alertId: string) => {
    navigate(`/alerts?highlight=${alertId}`);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertCircle;
      case "warning":
        return AlertCircle;
      default:
        return CheckCircle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-destructive";
      case "warning":
        return "text-warning";
      default:
        return "text-info";
    }
  };

  // Always show header, use fallback if user is not available
  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AD";

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50 visible">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="text-foreground" />
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entities, users, reports..."
            className="pl-10 bg-muted border-muted-foreground/20"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.target as HTMLInputElement).value;
                if (query.trim()) {
                  navigate(`/dashboard/admin?search=${encodeURIComponent(query)}`);
                }
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
              )}
        </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <DropdownMenuItem
                        key={alert.id}
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted"
                        onClick={() => handleNotificationClick(alert.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <Icon className={`h-4 w-4 mt-0.5 ${getAlertColor(alert.type)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate">{alert.entity}</p>
                              <Badge
                                variant={alert.type === "critical" ? "destructive" : "secondary"}
                                className="text-xs ml-2"
                              >
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/admin/alerts")} className="cursor-pointer">
              <span className="text-sm">View all alerts</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-medium">
                {userInitials}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "admin@medichain.dev"}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {currentEntity && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {currentEntity.name}
                </DropdownMenuLabel>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
