import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Prescriptions from "./pages/Prescriptions";
import Inventory from "./pages/Inventory";
import Procurement from "./pages/Procurement";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { LabDashboard, TestRequests as LabTestRequests, UploadResults as LabUploadResults, CompletedTests as LabCompletedTests, LabAnalytics, LabSettings } from "./pages/lab";
import { PatientHome, PatientMedicines, PatientPrescriptions, PatientAppointments, PatientSettings, PatientReminders } from "./pages/patient";
import PatientLayout from "./pages/patient/Layout";
import { SevaDashboard, SevaQueue, SevaPatientRegistration, SevaDoctorStatus, SevaNotifications, SevaAppointments, SevaHelp } from "./pages/seva";
import { AdminLayout, AdminDashboard, AdminAnalytics, AdminUsers, AdminSettings, AdminReports, AdminAudit, AdminMap, AdminAlerts, AdminPermissions, AdminClinics, AdminHospitals, AdminLabs, AdminPharmacies } from "./pages/admin";
import Welcome from "./pages/welcome";
import { RegisterEntity, RegisterUser, Login as GateLogin, EntitySuccess } from "./pages/onboard";
import { DoctorDashboard, DoctorActiveConsultation, DoctorCompletedConsultations, DoctorLabRequests, DoctorPatientHistory, DoctorSettings } from "./pages/doctor";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { RoleRoute } from "./components/RoleRoute";
import PharmacistRoutes from "./pages/pharmacy";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
        <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Admin routes - rendered outside main app layout */}
            <Route path="/dashboard/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="audit" element={<AdminAudit />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="permissions" element={<AdminPermissions />} />
              <Route path="entities/clinics" element={<AdminClinics />} />
              <Route path="entities/hospitals" element={<AdminHospitals />} />
              <Route path="entities/labs" element={<AdminLabs />} />
              <Route path="entities/pharmacies" element={<AdminPharmacies />} />
            </Route>
            {/* Legacy admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="audit" element={<AdminAudit />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="permissions" element={<AdminPermissions />} />
              <Route path="entities/clinics" element={<AdminClinics />} />
              <Route path="entities/hospitals" element={<AdminHospitals />} />
              <Route path="entities/labs" element={<AdminLabs />} />
              <Route path="entities/pharmacies" element={<AdminPharmacies />} />
            </Route>
            {/* Root and main app routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Welcome />} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="onboard/register" element={<RegisterEntity />} />
              <Route path="onboard/register-user" element={<RegisterUser />} />
              <Route path="onboard/login" element={<GateLogin />} />
              <Route path="onboard/success" element={<EntitySuccess />} />
              <Route path="lab" element={<ProtectedRoute><RoleRoute role="lab-tech"><LabDashboard /></RoleRoute></ProtectedRoute>} />
              <Route path="lab/requests" element={<RoleRoute role="lab-tech"><LabTestRequests /></RoleRoute>} />
              <Route path="lab/upload" element={<RoleRoute role="lab-tech"><LabUploadResults /></RoleRoute>} />
              <Route path="lab/completed" element={<RoleRoute role="lab-tech"><LabCompletedTests /></RoleRoute>} />
              <Route path="lab/analytics" element={<RoleRoute role="lab-tech"><LabAnalytics /></RoleRoute>} />
              <Route path="lab/settings" element={<RoleRoute role="lab-tech"><LabSettings /></RoleRoute>} />
              <Route path="patient" element={<ProtectedRoute><RoleRoute role="patient"><PatientLayout /></RoleRoute></ProtectedRoute>}>
                <Route index element={<PatientHome />} />
                <Route path="medicines" element={<PatientMedicines />} />
                <Route path="prescriptions" element={<PatientPrescriptions />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="settings" element={<PatientSettings />} />
                <Route path="reminders" element={<PatientReminders />} />
              </Route>
              <Route path="receptionist" element={<ProtectedRoute><RoleRoute role="receptionist"><SevaDashboard /></RoleRoute></ProtectedRoute>} />
              <Route path="receptionist/queue" element={<RoleRoute role="receptionist"><SevaQueue /></RoleRoute>} />
              <Route path="receptionist/registration" element={<RoleRoute role="receptionist"><SevaPatientRegistration /></RoleRoute>} />
              <Route path="receptionist/doctor-status" element={<RoleRoute role="receptionist"><SevaDoctorStatus /></RoleRoute>} />
              <Route path="receptionist/notifications" element={<RoleRoute role="receptionist"><SevaNotifications /></RoleRoute>} />
              <Route path="receptionist/appointments" element={<RoleRoute role="receptionist"><SevaAppointments /></RoleRoute>} />
              <Route path="receptionist/help" element={<RoleRoute role="receptionist"><SevaHelp /></RoleRoute>} />
              <Route path="doctor" element={<ProtectedRoute><RoleRoute role="doctor"><DoctorDashboard /></RoleRoute></ProtectedRoute>} />
              <Route path="doctor/active" element={<RoleRoute role="doctor"><DoctorActiveConsultation /></RoleRoute>} />
              <Route path="doctor/completed" element={<RoleRoute role="doctor"><DoctorCompletedConsultations /></RoleRoute>} />
              <Route path="doctor/lab-requests" element={<RoleRoute role="doctor"><DoctorLabRequests /></RoleRoute>} />
              <Route path="doctor/patient-history" element={<RoleRoute role="doctor"><DoctorPatientHistory /></RoleRoute>} />
              <Route path="doctor/settings" element={<RoleRoute role="doctor"><DoctorSettings /></RoleRoute>} />
              {/* Pharmacist routes */}
              <Route path="pharmacy/*" element={<ProtectedRoute><RoleRoute role="pharmacist"><PharmacistRoutes /></RoleRoute></ProtectedRoute>} />
              <Route path="prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
              <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="procurement" element={<ProtectedRoute><Procurement /></ProtectedRoute>} />
              <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>
            {/* Catch-all route for 404 */}
            <Route path="*" element={<MainLayout />}>
              <Route index element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
