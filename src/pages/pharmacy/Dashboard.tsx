import { StatCard } from "../../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getSalesByEntity, getTopMedicinesByEntity, getPrescriptionsByEntity, getMedicinesByEntity } from "../../lib/mockData";
import { useSubEntry } from "../../contexts/SubEntryContext";

export default function Dashboard() {
  const { currentEntityId } = useSubEntry();
  const medicines = getMedicinesByEntity(currentEntityId);
  const salesData = getSalesByEntity(currentEntityId);
  const topMeds = getTopMedicinesByEntity(currentEntityId);
  const prescriptions = getPrescriptionsByEntity(currentEntityId);

  const lowStockCount = medicines.filter(m => m.quantity < m.reorderThreshold).length;
  const expiringCount = medicines.filter(m => {
    const daysUntilExpiry = Math.floor((new Date(m.expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 90 && daysUntilExpiry > 0;
  }).length;

  const todaysSales = salesData[salesData.length - 1]?.sales ?? 0;
  const todaysPrescriptions = prescriptions.filter(p => p.date === "2024-01-15").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Prescriptions"
          value={todaysPrescriptions}
          icon={FileText}
          variant="default"
          trend={{ value: "12%", positive: true }}
        />
        <StatCard
          title="Today's Sales"
          value={`₹${todaysSales.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: "8%", positive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={Package}
          variant="warning"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringCount}
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Top Selling Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMeds.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Bar dataKey="sold" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recent Prescriptions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicines
              .filter(m => m.quantity < m.reorderThreshold)
              .slice(0, 5)
              .map(medicine => (
                <div key={medicine.id} 
                     className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                     role="alert">
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {medicine.quantity} (Reorder at {medicine.reorderThreshold})
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {prescriptions.slice(0, 5).map(prescription => (
              <div key={prescription.id} 
                   className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm cursor-pointer"
                   role="button"
                   tabIndex={0}
                   aria-label={`View prescription for ${prescription.patientName}`}>
                <div>
                  <p className="font-medium">{prescription.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {prescription.id} • {prescription.doctor}
                  </p>
                </div>
                <Badge variant={prescription.status === "completed" ? "default" : "secondary"}>
                  {prescription.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
