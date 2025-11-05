import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPrescriptionsByEntity } from "@/lib/mockData";
import { useSubEntry } from "@/contexts/SubEntryContext";

const PharmacyDispense = () => {
  const { currentEntityId } = useSubEntry();
  const prescriptions = getPrescriptionsByEntity(currentEntityId);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dispense Prescriptions</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions.map((rx) => (
          <Card key={rx.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{rx.id} · {rx.patientName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20">{rx.status}</span>
            </div>
            <p className="text-sm text-muted-foreground">Doctor: {rx.doctor} · {rx.hospital}</p>
            <ul className="text-sm list-disc pl-5">
              {rx.medicines.map((m, i) => (
                <li key={i}>{m.name} — {m.dosage} · {m.timing} · qty {m.quantity}</li>
              ))}
            </ul>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="default">Mark Dispensed</Button>
              <Button size="sm" variant="outline">Print Label</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PharmacyDispense;


