import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMedicinesByEntity } from "@/lib/mockData";
import { useSubEntry } from "@/contexts/SubEntryContext";

const PharmacyInventory = () => {
  const { currentEntityId } = useSubEntry();
  const medicines = getMedicinesByEntity(currentEntityId);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <div className="w-64"><Input placeholder="Search medicine..." /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medicines.map((m) => (
          <Card key={m.id} className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{m.name}</h2>
              <span className="text-xs text-muted-foreground">Batch {m.batch}</span>
            </div>
            <p className="text-sm">Qty: {m.quantity} · Reorder ≤ {m.reorderThreshold}</p>
            <p className="text-sm text-muted-foreground">Expiry: {m.expiry} · Category: {m.category}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PharmacyInventory;


