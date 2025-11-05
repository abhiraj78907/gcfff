import { Home, UserPlus, Users, Calendar, Stethoscope, CreditCard, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
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
  { title: "Dashboard", url: "/dashboard/receptionist", icon: Home },
  { title: "Patient Registration", url: "/dashboard/receptionist/register", icon: UserPlus },
  { title: "Today's Queue", url: "/dashboard/receptionist/queue", icon: Users },
  { title: "Appointments", url: "/dashboard/receptionist/appointments", icon: Calendar },
  { title: "Doctor Status", url: "/dashboard/receptionist/doctors", icon: Stethoscope },
  { title: "Billing", url: "/dashboard/receptionist/billing", icon: CreditCard },
  { title: "Settings", url: "/dashboard/receptionist/settings", icon: SettingsIcon },
];

export function ReceptionistSidebar() {
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
                      to={item.url}
                      end
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
