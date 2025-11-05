import { Toaster } from "@doctor/components/ui/toaster";
import { Toaster as Sonner } from "@doctor/components/ui/sonner";
import { TooltipProvider } from "@doctor/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@doctor/components/ui/sidebar";
import { DoctorSidebar } from "@doctor/components/DoctorSidebar";
import { DoctorHeader } from "@doctor/components/DoctorHeader";
import Dashboard from "./pages/Dashboard";
import ActiveConsultation from "./pages/ActiveConsultation";
import CompletedConsultations from "./pages/CompletedConsultations";
import LabRequests from "./pages/LabRequests";
import PatientHistory from "./pages/PatientHistory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <DoctorSidebar />
            <div className="flex flex-1 flex-col">
              <DoctorHeader />
              <main className="flex-1 overflow-y-auto bg-background p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/consultation" element={<ActiveConsultation />} />
                  <Route path="/completed" element={<CompletedConsultations />} />
                  <Route path="/lab-requests" element={<LabRequests />} />
                  <Route path="/patient-history" element={<PatientHistory />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
