import { Toaster } from "@admin/components/ui/toaster";
import { Toaster as Sonner } from "@admin/components/ui/sonner";
import { TooltipProvider } from "@admin/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Analytics from "./pages/Analytics";
import Hospitals from "./pages/entities/Hospitals";
import Clinics from "./pages/entities/Clinics";
import Pharmacies from "./pages/entities/Pharmacies";
import Labs from "./pages/entities/Labs";
import Users from "./pages/Users";
import Permissions from "./pages/Permissions";
import Alerts from "./pages/Alerts";
import Audit from "./pages/Audit";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<Map />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="entities/hospitals" element={<Hospitals />} />
            <Route path="entities/clinics" element={<Clinics />} />
            <Route path="entities/pharmacies" element={<Pharmacies />} />
            <Route path="entities/labs" element={<Labs />} />
            <Route path="users" element={<Users />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="audit" element={<Audit />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
