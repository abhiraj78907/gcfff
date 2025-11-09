import { Home, UserPlus, Users, Calendar, Stethoscope, CreditCard, Settings as SettingsIcon } from "lucide-react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", path: "", icon: Home },
  { title: "Patient Registration", path: "/register", icon: UserPlus },
  { title: "Today's Queue", path: "/queue", icon: Users },
  { title: "Appointments", path: "/appointments", icon: Calendar },
  { title: "Doctor Status", path: "/doctors", icon: Stethoscope },
  { title: "Billing", path: "/billing", icon: CreditCard },
  { title: "Settings", path: "/settings", icon: SettingsIcon },
];

export function ReceptionistSidebar() {
  const location = useLocation();
  const basePath = location.pathname.includes("/dashboard/receptionist") 
    ? "/dashboard/receptionist" 
    : "/receptionist";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-semibold">VIMS Hospital</h2>
              <p className="text-xs text-muted-foreground">Receptionist</p>
            </div>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`${basePath}${item.path}`}
                      end={item.path === ""}
                      className={({ isActive }) =>
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
