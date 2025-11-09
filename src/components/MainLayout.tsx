import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "./ui/sidebar";
import { SubEntryProvider } from "../contexts/SubEntryContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useSubEntry } from "../contexts/SubEntryContext";

export const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isPublic = location.pathname === "/" || location.pathname.startsWith("/onboard");
  const showSidebar = Boolean(user) && !isPublic;

  const EntityIndicator = () => {
    const { currentEntity } = useSubEntry();
    if (!currentEntity) return null;
    return (
      <span>
        Entity: <span className="font-medium">{currentEntity.name}</span>
      </span>
    );
  };
  return (
    <SubEntryProvider userId={"user-1"}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-[100svh] w-full">
          {showSidebar && <AppSidebar />}
          <div className="flex flex-1 flex-col min-h-0">
            <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 transition-all duration-200">
              {showSidebar && <SidebarTrigger className="transition-transform duration-200 hover:scale-110" aria-label="Toggle sidebar" />}
              <div className="flex-1 text-sm text-muted-foreground"><EntityIndicator /></div>
              {showSidebar && (
                <>
              <RoleSwitcher />
                  <UserProfileDropdown variant="compact" />
                </>
              )}
            </header>
            <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SubEntryProvider>
  );
};

