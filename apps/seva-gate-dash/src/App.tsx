import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import PatientRegistration from "./pages/PatientRegistration";
import Queue from "./pages/Queue";
import Appointments from "./pages/Appointments";
import DoctorStatus from "./pages/DoctorStatus";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/registration"
            element={
              <MainLayout>
                <PatientRegistration />
              </MainLayout>
            }
          />
          <Route
            path="/queue"
            element={
              <MainLayout>
                <Queue />
              </MainLayout>
            }
          />
          <Route
            path="/appointments"
            element={
              <MainLayout>
                <Appointments />
              </MainLayout>
            }
          />
          <Route
            path="/doctors"
            element={
              <MainLayout>
                <DoctorStatus />
              </MainLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <MainLayout>
                <Notifications />
              </MainLayout>
            }
          />
          <Route
            path="/help"
            element={
              <MainLayout>
                <Help />
              </MainLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
