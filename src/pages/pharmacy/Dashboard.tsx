import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { getSalesByEntity, getTopMedicinesByEntity, getDoctorPrescriptionsByEntity } from "@/lib/mockData";
import { useSubEntry } from "@/contexts/SubEntryContext";
import { DollarSign, Pill, UserCheck } from "lucide-react";
import { SalesTrendChart } from "@/components/pharmacy/SalesTrendChart";
import { PrescriptionsBar } from "@/components/pharmacy/PrescriptionsBar";
import { TopMedicinesPie } from "@/components/pharmacy/TopMedicinesPie";

const PharmacyDashboard = () => {
  const { currentEntityId } = useSubEntry();
  const sales = getSalesByEntity(currentEntityId);
  const topMeds = getTopMedicinesByEntity(currentEntityId);
  const doctorRx = getDoctorPrescriptionsByEntity(currentEntityId);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pharmacy Dashboard</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard 
          title="Today Sales" 
          value={`₹${(sales[0]?.sales ?? 0).toLocaleString()}`} 
          icon={DollarSign}
          trend={{ value: "12%", positive: true }} 
        />
        <StatCard 
          title="Top Medicine" 
          value={topMeds[0]?.name ?? "-"} 
          icon={Pill}
        />
        <StatCard 
          title="Active Doctors" 
          value={`${doctorRx.length}`} 
          icon={UserCheck}
        />
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart
            data={sales.map((d) => ({ label: d.date, value: d.sales }))}
            title="Weekly Sales"
          />
        </div>
        <TopMedicinesPie
          data={topMeds.slice(0, 6).map((m) => ({ label: m.name, value: m.sold }))}
          title="Top Medicines"
        />
      </div>
      <div className="grid gap-4 grid-cols-1">
        <PrescriptionsBar
          data={doctorRx.map((d) => ({ label: d.doctor, value: d.prescriptions }))}
          title="Prescriptions by Doctor"
        />
      </div>
    </div>
  );
};

export default PharmacyDashboard;


