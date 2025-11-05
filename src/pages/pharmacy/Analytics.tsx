import { Card } from "@/components/ui/card";
import { mockRevenueData } from "@/lib/mockData";

const PharmacyAnalytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Monthly Revenue</h2>
        <ul className="text-sm space-y-1">
          {mockRevenueData.map((r) => (
            <li key={r.month} className="flex justify-between">
              <span>{r.month}</span>
              <span className="text-muted-foreground">₹{r.revenue.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default PharmacyAnalytics;


