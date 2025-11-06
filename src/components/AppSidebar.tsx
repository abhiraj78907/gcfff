import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings as SettingsIcon,
  Pill,
  TestTube,
  ClipboardList,
  Upload,
  CheckCircle,
  User,
  Calendar,
  Pill as PillIcon,
  Bell,
  MapPin,
  Shield,
  Activity,
  Hospital,
  Building2,
  FlaskConical
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
} from "@/components/ui/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useSubEntry } from "../contexts/SubEntryContext";

// Removed universal menu; all items are role-scoped below

const labMenuItems = [
  { title: "Lab Dashboard", url: "/lab", icon: TestTube },
  { title: "Requests", url: "/lab/requests", icon: ClipboardList },
  { title: "Upload Results", url: "/lab/upload", icon: Upload },
  { title: "Completed", url: "/lab/completed", icon: CheckCircle },
  { title: "Lab Analytics", url: "/lab/analytics", icon: BarChart3 },
  { title: "Lab Settings", url: "/lab/settings", icon: SettingsIcon },
];

const patientMenuItems = [
  { title: "Patient Home", url: "/patient", icon: User },
  { title: "Medicines", url: "/patient/medicines", icon: PillIcon },
  { title: "Prescriptions", url: "/patient/prescriptions", icon: FileText },
  { title: "Appointments", url: "/patient/appointments", icon: Calendar },
  { title: "Patient Settings", url: "/patient/settings", icon: SettingsIcon },
];

const sevaMenuItems = [
  { title: "Receptionist Dashboard", url: "/receptionist", icon: LayoutDashboard },
  { title: "Queue", url: "/receptionist/queue", icon: ClipboardList },
  { title: "Registration", url: "/receptionist/registration", icon: FileText },
  { title: "Doctor Status", url: "/receptionist/doctor-status", icon: User },
  { title: "Appointments", url: "/receptionist/appointments", icon: Calendar },
  { title: "Notifications", url: "/receptionist/notifications", icon: Bell },
];

const doctorMenuItems = [
  { title: "Doctor Dashboard", url: "/doctor", icon: LayoutDashboard },
  { title: "Active Consultation", url: "/doctor/active", icon: ClipboardList },
  { title: "Completed", url: "/doctor/completed", icon: CheckCircle },
  { title: "Lab Requests", url: "/doctor/lab-requests", icon: TestTube },
  { title: "Patient History", url: "/doctor/patient-history", icon: FileText },
  { title: "Doctor Settings", url: "/doctor/settings", icon: SettingsIcon },
];

const pharmacistMenuItems = [
  { title: "Pharmacy Dashboard", url: "/pharmacy", icon: LayoutDashboard },
  { title: "Prescriptions", url: "/pharmacy/prescriptions", icon: FileText },
  { title: "Inventory", url: "/pharmacy/inventory", icon: Package },
  { title: "Procurement", url: "/pharmacy/procurement", icon: ShoppingCart },
  { title: "Analytics", url: "/pharmacy/analytics", icon: BarChart3 },
  { title: "Settings", url: "/pharmacy/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { hasRole, user } = useAuth();
  const { currentEntityId, currentSubEntryId } = useSubEntry();
  const debugEnabled = (import.meta as any).env?.VITE_DEBUG_SIDEBAR === "true";

  if (debugEnabled) {
    const visibleSections = [
      hasRole("admin") && "admin",
      hasRole("pharmacist") && "pharmacist",
      hasRole("lab-tech") && "lab-tech",
      hasRole("patient") && "patient",
      hasRole("doctor") && "doctor",
      hasRole("receptionist") && "receptionist",
    ].filter(Boolean);
    // eslint-disable-next-line no-console
    console.debug("[Sidebar] user roles=", user?.roles, "entity=", currentEntityId, "subEntry=", currentSubEntryId, "sections=", visibleSections);
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border transition-all duration-300">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary transition-transform duration-200 hover:scale-110" 
               role="img" 
               aria-label="PharmaCare logo">
            <Pill className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="text-sm font-semibold text-sidebar-foreground">PharmaCare</span>
              <span className="text-xs text-sidebar-foreground/70">Dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Admin Section - restricted */}
        {hasRole("admin") && (
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Overview">
                  <NavLink 
                    to="/dashboard/admin" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Admin Overview"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Live Map">
                  <NavLink 
                    to="/dashboard/admin/map" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Live Map"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Live Map</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Analytics">
                  <NavLink 
                    to="/dashboard/admin/analytics" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Analytics"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Analytics</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("admin") && (
        <SidebarGroup>
          <SidebarGroupLabel>Healthcare Entities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Hospitals">
                  <NavLink 
                    to="/dashboard/admin/entities/hospitals" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Hospitals"
                  >
                    <Hospital className="h-4 w-4" />
                    <span>Hospitals</span>
                    <span className="ml-auto text-xs bg-sidebar-muted px-2 py-0.5 rounded-full">24</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Clinics">
                  <NavLink 
                    to="/dashboard/admin/entities/clinics" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Clinics"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Clinics</span>
                    <span className="ml-auto text-xs bg-sidebar-muted px-2 py-0.5 rounded-full">156</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Pharmacies">
                  <NavLink 
                    to="/dashboard/admin/entities/pharmacies" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Pharmacies"
                  >
                    <Pill className="h-4 w-4" />
                    <span>Pharmacies</span>
                    <span className="ml-auto text-xs bg-sidebar-muted px-2 py-0.5 rounded-full">89</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Laboratories">
                  <NavLink 
                    to="/dashboard/admin/entities/labs" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Laboratories"
                  >
                    <FlaskConical className="h-4 w-4" />
                    <span>Laboratories</span>
                    <span className="ml-auto text-xs bg-sidebar-muted px-2 py-0.5 rounded-full">43</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("admin") && (
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Users & Roles">
                  <NavLink 
                    to="/dashboard/admin/users" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Users & Roles"
                  >
                    <User className="h-4 w-4" />
                    <span>Users & Roles</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Permissions">
                  <NavLink 
                    to="/dashboard/admin/permissions" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Permissions"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Permissions</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Alerts">
                  <NavLink 
                    to="/dashboard/admin/alerts" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Alerts"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Alerts</span>
                    <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">12</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Audit Logs">
                  <NavLink 
                    to="/dashboard/admin/audit" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Audit Logs"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Audit Logs</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reports">
                  <NavLink 
                    to="/dashboard/admin/reports" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Reports"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("admin") && (
        <SidebarGroup>
          <SidebarGroupLabel>Admin Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <NavLink 
                    to="/dashboard/admin/settings" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                        : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                    }
                    aria-label="Navigate to Admin Settings"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("pharmacist") && (
        <SidebarGroup>
          <SidebarGroupLabel>Pharmacist</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pharmacistMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                          : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                      }
                      aria-label={`Navigate to ${item.title}`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("lab-tech") && (
        <SidebarGroup>
          <SidebarGroupLabel>Lab</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {labMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                          : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                      }
                      aria-label={`Navigate to ${item.title}`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("patient") && (
        <SidebarGroup>
          <SidebarGroupLabel>Patient</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {patientMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                          : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                      }
                      aria-label={`Navigate to ${item.title}`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("doctor") && (
        <SidebarGroup>
          <SidebarGroupLabel>Doctor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {doctorMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                          : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                      }
                      aria-label={`Navigate to ${item.title}`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

        {hasRole("receptionist") && (
        <SidebarGroup>
          <SidebarGroupLabel>Receptionist</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sevaMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground transition-all duration-200" 
                          : "hover:bg-sidebar-accent/50 transition-all duration-200 hover:translate-x-1"
                      }
                      aria-label={`Navigate to ${item.title}`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        )}

      </SidebarContent>
    </Sidebar>
  );
}
