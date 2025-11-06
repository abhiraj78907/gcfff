import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import TestRequests from "./pages/TestRequests";
import UploadResults from "./pages/UploadResults";
import CompletedTests from "./pages/CompletedTests";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { LabHeader } from "./components/LabHeader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <div className="flex flex-1 flex-col min-h-0">
            <LabHeader />
            <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/requests" element={<TestRequests />} />
                <Route path="/upload" element={<UploadResults />} />
                <Route path="/completed" element={<CompletedTests />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
