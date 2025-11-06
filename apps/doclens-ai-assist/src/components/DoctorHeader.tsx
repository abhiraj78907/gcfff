import { Bell, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@doctor/components/ui/button";
import { Badge } from "@doctor/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@doctor/components/ui/dropdown-menu";
import { SidebarTrigger } from "@doctor/components/ui/sidebar";
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";
import { useNavigate } from "react-router-dom";

export function DoctorHeader() {
  const { user, logout } = useAuth();
  const { currentEntity } = useSubEntry();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/onboard/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/doctor/settings");
  };

  const handleSettings = () => {
    navigate("/doctor/settings");
  };

  if (!user) return null;

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-xl font-semibold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">Doctor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-critical p-0 text-[10px] flex items-center justify-center">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-medium">
                  {userInitials}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
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
              <DropdownMenuItem onClick={handleLogout} className="text-critical focus:text-critical">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
