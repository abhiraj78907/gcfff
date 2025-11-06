import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReceptionistSidebar } from "@/components/dashboards/receptionist/ReceptionistSidebar";
import { ReceptionistHeader } from "@/components/dashboards/receptionist/ReceptionistHeader";
import DashboardHome from "@/components/dashboards/receptionist/DashboardHome";
import PatientRegistration from "@/components/dashboards/receptionist/PatientRegistration";
import TodaysQueue from "@/components/dashboards/receptionist/TodaysQueue";
import Appointments from "@/components/dashboards/receptionist/Appointments";
import DoctorStatus from "@/components/dashboards/receptionist/DoctorStatus";
import Billing from "@/components/dashboards/receptionist/Billing";
import Settings from "@/components/dashboards/receptionist/Settings";

const ReceptionistDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-[100svh] flex w-full bg-background">
        <ReceptionistSidebar />
        <div className="flex flex-1 flex-col min-h-0">
          <ReceptionistHeader />
          <main className="flex-1 min-h-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/register" element={<PatientRegistration />} />
              <Route path="/queue" element={<TodaysQueue />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/doctors" element={<DoctorStatus />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReceptionistDashboard;
