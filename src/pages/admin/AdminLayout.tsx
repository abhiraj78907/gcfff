import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebarWrapper } from "./AdminSidebarWrapper";
import { DashboardHeader } from "../../../apps/medichain-nexus-suite/src/components/layout/DashboardHeader";
import { SidebarProvider } from "../../../apps/medichain-nexus-suite/src/components/ui/sidebar";
import { SubEntryProvider } from "@/contexts/SubEntryContext";

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // In production, get userId from auth context
  const userId = "user-1";

  return (
    <SubEntryProvider userId={userId}>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className="min-h-[100svh] flex w-full max-w-full overflow-x-hidden bg-background">
          <AdminSidebarWrapper />
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SubEntryProvider>
  );
};

export default AdminLayout;
