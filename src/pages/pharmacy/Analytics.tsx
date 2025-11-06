import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { mockRevenueData, getSalesByEntity, getTopMedicinesByEntity, getDoctorPrescriptionsByEntity } from "@/lib/mockData";
import { useSubEntry } from "@/contexts/SubEntryContext";
import { TrendingUp, Coins, UserCheck } from "lucide-react";
import { SalesTrendChart } from "@/components/pharmacy/SalesTrendChart";
import { PrescriptionsBar } from "@/components/pharmacy/PrescriptionsBar";
import { TopMedicinesPie } from "@/components/pharmacy/TopMedicinesPie";

const PharmacyAnalytics = () => {
  const { currentEntityId } = useSubEntry();
  const weeklySales = getSalesByEntity(currentEntityId);
  const topMeds = getTopMedicinesByEntity(currentEntityId);
  const doctorRx = getDoctorPrescriptionsByEntity(currentEntityId);
  const totalRevenue = mockRevenueData.reduce((s, r) => s + r.revenue, 0);
  const totalPrescriptions = doctorRx.reduce((s, d) => s + d.prescriptions, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      {/* KPI Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard title="Total Revenue (6 mo)" value={`₹${totalRevenue.toLocaleString()}`} icon={Coins} variant="success" />
        <StatCard title="Weekly Sales (avg)" value={`₹${Math.round((weeklySales.reduce((s, d) => s + d.sales, 0) / Math.max(1, weeklySales.length))).toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Doctor Rx (total)" value={totalPrescriptions} icon={UserCheck} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart data={weeklySales.map(d => ({ label: d.date, value: d.sales }))} title="Weekly Sales" />
        </div>
        <TopMedicinesPie data={topMeds.map(m => ({ label: m.name, value: m.sold }))} title="Top Medicines" />
      </div>

      {/* Prescriptions by Doctor */}
      <div className="grid gap-4 grid-cols-1">
        <PrescriptionsBar data={doctorRx.map(d => ({ label: d.doctor, value: d.prescriptions }))} title="Prescriptions by Doctor" />
      </div>
    </div>
  );
};

export default PharmacyAnalytics;


