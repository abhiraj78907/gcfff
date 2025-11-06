import { User, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubEntry } from "@/contexts/SubEntryContext";

interface UserProfileDropdownProps {
  variant?: "default" | "icon-only" | "compact";
  showName?: boolean;
}

export function UserProfileDropdown({ variant = "default", showName = true }: UserProfileDropdownProps) {
  const { user, logout, activeRole } = useAuth();
  const { currentEntity } = useSubEntry();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/onboard/login", { replace: true });
  };

  const handleProfile = () => {
    const role = activeRole || user?.roles?.[0];
    if (!role) return;
    
    const profilePaths: Record<string, string> = {
      admin: "/dashboard/admin/settings",
      doctor: "/doctor/settings",
      pharmacist: "/pharmacy/settings",
      "lab-tech": "/lab/settings",
      receptionist: "/receptionist/help",
      patient: "/patient/settings",
    };
    
    const path = profilePaths[role] || "/";
    navigate(path);
  };

  const handleSettings = () => {
    const role = activeRole || user?.roles?.[0];
    if (!role) return;
    
    const settingsPaths: Record<string, string> = {
      admin: "/dashboard/admin/settings",
      doctor: "/doctor/settings",
      pharmacist: "/pharmacy/settings",
      "lab-tech": "/lab/settings",
      receptionist: "/receptionist/help",
      patient: "/patient/settings",
    };
    
    const path = settingsPaths[role] || "/";
    navigate(path);
  };

  if (!user) return null;

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleDisplayName: Record<string, string> = {
    admin: "Administrator",
    doctor: "Doctor",
    pharmacist: "Pharmacist",
    "lab-tech": "Lab Technician",
    receptionist: "Receptionist",
    patient: "Patient",
  };

  const displayRole = activeRole ? roleDisplayName[activeRole] || activeRole : "User";

  if (variant === "icon-only") {
    return (
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
              <p className="text-xs text-muted-foreground">{displayRole}</p>
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
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 h-auto py-1.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-medium">
              {userInitials}
            </div>
            {showName && (
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{displayRole}</p>
              </div>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
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
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-medium">
            {userInitials}
          </div>
          {showName && (
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{displayRole}</p>
            </div>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">{displayRole}</p>
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
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

