import { Home, Pill, FileText, Calendar, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Pill, label: "Medicines", path: "/medicines" },
  { icon: FileText, label: "Prescriptions", path: "/prescriptions" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-card border-r border-border min-h-screen sticky top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl md:text-2xl font-bold text-primary">MediChain</h1>
        <p className="text-sm text-muted-foreground mt-1">Patient Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "hover:bg-muted/50",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-foreground">Need Help?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Call: 1800-000-0000
          </p>
        </div>
      </div>
    </aside>
  );
};
