import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockOrders, mockSuppliers } from "@/lib/mockData";

const PharmacyProcurement = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Procurement</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Open Orders</h2>
          <ul className="text-sm space-y-2">
            {mockOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between">
                <span>{o.id} · {o.supplier} · {o.items} items</span>
                <span className="text-xs text-muted-foreground">{o.status} · ETA {o.eta}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Suppliers</h2>
          <ul className="text-sm space-y-2">
            {mockSuppliers.map((s) => (
              <li key={s.id} className="flex items-center justify-between">
                <span>{s.name} · {s.medicines} medicines</span>
                <Button size="sm" variant="outline">New Order</Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyProcurement;


