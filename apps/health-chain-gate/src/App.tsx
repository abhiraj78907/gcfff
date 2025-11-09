import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import RegisterEntity from "./pages/RegisterEntity";
import EntitySuccess from "./pages/EntitySuccess";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";
import ReceptionistDashboard from "./pages/dashboards/ReceptionistDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register-entity" element={<RegisterEntity />} />
          <Route path="/entity-success" element={<EntitySuccess />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/receptionist/*" element={<ReceptionistDashboard />} />
          <Route path="/receptionist/*" element={<ReceptionistDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
