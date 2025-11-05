import {
  Building2,
  LayoutDashboard,
  Hospital,
  Pill,
  FlaskConical,
  Users,
  Shield,
  Bell,
  FileText,
  Settings,
  Activity,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@admin/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@admin/components/ui/collapsible";

const mainNavItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Live Map", url: "/map", icon: MapPin },
  { title: "Analytics", url: "/analytics", icon: Activity },
];

const entityNavItems = [
  {
    title: "Hospitals",
    icon: Hospital,
    url: "/entities/hospitals",
    badge: "24",
  },
  {
    title: "Clinics",
    icon: Building2,
    url: "/entities/clinics",
    badge: "156",
  },
  {
    title: "Pharmacies",
    icon: Pill,
    url: "/entities/pharmacies",
    badge: "89",
  },
  {
    title: "Laboratories",
    icon: FlaskConical,
    url: "/entities/labs",
    badge: "43",
  },
];

const managementItems = [
  { title: "Users & Roles", url: "/users", icon: Users },
  { title: "Permissions", url: "/permissions", icon: Shield },
  { title: "Alerts", url: "/alerts", icon: Bell, badge: "12" },
  { title: "Audit Logs", url: "/audit", icon: FileText },
  { title: "Reports", url: "/reports", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Activity className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Medichain</h1>
              <p className="text-xs text-sidebar-muted">Admin Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted">Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavCls(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Entities */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted">Healthcare Entities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {entityNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavCls(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          <span className="ml-auto text-xs bg-sidebar-muted px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavCls(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={getNavCls("/settings")}>
                  <NavLink to="/settings">
                    <Settings className="h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
