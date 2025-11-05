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
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebarWrapper />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SubEntryProvider>
  );
};

export default AdminLayout;
