import { Home, Kanban, Upload, FileCheck, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Test Requests", url: "/requests", icon: Kanban },
  { title: "Upload Results", url: "/upload", icon: Upload },
  { title: "Completed Tests", url: "/completed", icon: FileCheck },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Lab Dashboard</h1>
        <p className="text-sm text-sidebar-foreground/70">Blood Test Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-5 w-5", isActive && "text-sidebar-primary-foreground")} />
                <span>{item.title}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground">LT</span>
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">Lab Technician</p>
            <p className="text-xs text-sidebar-foreground/70">technician@lab.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
