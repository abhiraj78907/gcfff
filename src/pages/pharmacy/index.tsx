import { Routes, Route, Navigate } from "react-router-dom";
import PharmacyDashboard from "./Dashboard";
import PharmacyDispense from "./Prescriptions";
import PharmacyInventory from "./Inventory";
import PharmacyProcurement from "./Procurement";
import PharmacyAnalytics from "./Analytics";
import PharmacySettings from "./Settings";

const PharmacistRoutes = () => {
  return (
    <Routes>
      <Route index element={<PharmacyDashboard />} />
      <Route path="prescriptions" element={<PharmacyDispense />} />
      <Route path="inventory" element={<PharmacyInventory />} />
      <Route path="procurement" element={<PharmacyProcurement />} />
      <Route path="analytics" element={<PharmacyAnalytics />} />
      <Route path="settings" element={<PharmacySettings />} />
      <Route path="*" element={<Navigate to="/pharmacy" replace />} />
    </Routes>
  );
};

export default PharmacistRoutes;
