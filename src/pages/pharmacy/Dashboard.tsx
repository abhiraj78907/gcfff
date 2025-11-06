import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { getSalesByEntity, getTopMedicinesByEntity, getDoctorPrescriptionsByEntity } from "@/lib/mockData";
import { useSubEntry } from "@/contexts/SubEntryContext";
import { DollarSign, Pill, UserCheck } from "lucide-react";

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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Top Medicines</h2>
          <ul className="text-sm space-y-1">
            {topMeds.slice(0, 6).map((m) => (
              <li key={m.name} className="flex justify-between">
                <span>{m.name}</span>
                <span className="text-muted-foreground">{m.sold}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Doctor Prescriptions</h2>
          <ul className="text-sm space-y-1">
            {doctorRx.map((d) => (
              <li key={d.doctor} className="flex justify-between">
                <span>{d.doctor}</span>
                <span className="text-muted-foreground">{d.prescriptions}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDashboard;


