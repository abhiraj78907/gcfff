import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, AlertTriangle } from "lucide-react";
import medicineTablet from "@/assets/medicine-tablet.png";
import medicineCapsule from "@/assets/medicine-capsule.png";
import medicineSyrup from "@/assets/medicine-syrup.png";

interface MedicineDetail {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  strength: string;
  instructions: string;
  imageUrl: string;
  warning?: string;
  remindersEnabled: boolean;
  startDate: string;
  endDate: string;
}

const Medicines = () => {
  const [medicines, setMedicines] = useState<MedicineDetail[]>([
    {
      id: "1",
      name: "Paracetamol",
      genericName: "Acetaminophen",
      dosage: "Tablet",
      strength: "500mg",
      instructions: "Take 1 tablet three times daily",
      imageUrl: medicineTablet,
      remindersEnabled: true,
      startDate: "2025-11-01",
      endDate: "2025-11-10",
    },
    {
      id: "2",
      name: "Amoxicillin",
      genericName: "Amoxicillin Trihydrate",
      dosage: "Capsule",
      strength: "250mg",
      instructions: "Take 1 capsule twice daily after meals",
      imageUrl: medicineCapsule,
      warning: "Complete full course even if symptoms improve",
      remindersEnabled: true,
      startDate: "2025-11-01",
      endDate: "2025-11-07",
    },
    {
      id: "3",
      name: "Cough Syrup",
      genericName: "Dextromethorphan",
      dosage: "Syrup",
      strength: "5ml",
      instructions: "Take 2 spoons three times daily",
      imageUrl: medicineSyrup,
      remindersEnabled: false,
      startDate: "2025-11-03",
      endDate: "2025-11-08",
    },
  ]);

  const toggleReminder = (id: string) => {
    setMedicines(prev =>
      prev.map(med =>
        med.id === id ? { ...med, remindersEnabled: !med.remindersEnabled } : med
      )
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">My Medicines</h1>
          <p className="text-sm text-muted-foreground">Manage your medication schedule</p>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {medicines.map(medicine => (
            <Card key={medicine.id} className="p-5">
              <div className="flex gap-4">
                {/* Medicine Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={medicine.imageUrl}
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Medicine Details */}
                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {medicine.dosage}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {medicine.strength}
                      </Badge>
                    </div>

                    <p className="text-sm text-foreground">{medicine.instructions}</p>

                    {medicine.warning && (
                      <div className="flex items-start gap-2 p-2 bg-warning/10 border border-warning rounded-md">
                        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground">{medicine.warning}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{medicine.startDate} to {medicine.endDate}</span>
                    </div>

                    {/* Reminder Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Reminders</span>
                      </div>
                      <Switch
                        checked={medicine.remindersEnabled}
                        onCheckedChange={() => toggleReminder(medicine.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {medicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No medicines added yet</p>
            <Button className="mt-4">Add Medicine</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
