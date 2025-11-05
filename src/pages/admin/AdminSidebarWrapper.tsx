import { useLocation, NavLink } from "react-router-dom";
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
} from "lucide-react";
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
} from "../../../apps/medichain-nexus-suite/src/components/ui/sidebar";

const BASE_PATH = "/dashboard/admin";

const mainNavItems = [
  { title: "Overview", url: `${BASE_PATH}`, icon: LayoutDashboard },
  { title: "Live Map", url: `${BASE_PATH}/map`, icon: MapPin },
  { title: "Analytics", url: `${BASE_PATH}/analytics`, icon: Activity },
];

const entityNavItems = [
  {
    title: "Hospitals",
    icon: Hospital,
    url: `${BASE_PATH}/entities/hospitals`,
    badge: "24",
  },
  {
    title: "Clinics",
    icon: Building2,
    url: `${BASE_PATH}/entities/clinics`,
    badge: "156",
  },
  {
    title: "Pharmacies",
    icon: Pill,
    url: `${BASE_PATH}/entities/pharmacies`,
    badge: "89",
  },
  {
    title: "Laboratories",
    icon: FlaskConical,
    url: `${BASE_PATH}/entities/labs`,
    badge: "43",
  },
];

const managementItems = [
  { title: "Users & Roles", url: `${BASE_PATH}/users`, icon: Users },
  { title: "Permissions", url: `${BASE_PATH}/permissions`, icon: Shield },
  { title: "Alerts", url: `${BASE_PATH}/alerts`, icon: Bell, badge: "12" },
  { title: "Audit Logs", url: `${BASE_PATH}/audit`, icon: FileText },
  { title: "Reports", url: `${BASE_PATH}/reports`, icon: FileText },
];

export function AdminSidebarWrapper() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === BASE_PATH) return location.pathname === BASE_PATH;
    return location.pathname.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border flex-shrink-0">
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
                <SidebarMenuButton asChild className={getNavCls(`${BASE_PATH}/settings`)}>
                  <NavLink to={`${BASE_PATH}/settings`}>
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

