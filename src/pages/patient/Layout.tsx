import { Outlet } from "react-router-dom";
import PatientBottomNav from "./BottomNav";

export default function PatientLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <PatientBottomNav />
    </div>
  );
}


