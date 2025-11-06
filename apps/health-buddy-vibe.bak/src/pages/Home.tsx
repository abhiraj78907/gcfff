import { useState } from "react";
import { ProgressRing } from "@/components/ProgressRing";
import { MedicineCard, MedicineStatus } from "@/components/MedicineCard";
import { TimelineSection } from "@/components/TimelineSection";
import { VoiceButton } from "@/components/VoiceButton";
import { HelpButton } from "@/components/HelpButton";
import { QuickActionButton } from "@/components/QuickActionButton";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import medicineTablet from "@/assets/medicine-tablet.png";
import medicineCapsule from "@/assets/medicine-capsule.png";
import medicineSyrup from "@/assets/medicine-syrup.png";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  time: string;
  status: MedicineStatus;
  imageUrl: string;
  withFood: boolean;
  period: "morning" | "afternoon" | "night";
}

const Home = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Paracetamol",
      dosage: "500mg Tablet",
      instructions: "Take 1 tablet",
      time: "8:00 AM",
      status: "taken",
      imageUrl: medicineTablet,
      withFood: false,
      period: "morning",
    },
    {
      id: "2",
      name: "Amoxicillin",
      dosage: "250mg Capsule",
      instructions: "Take 1 capsule",
      time: "9:00 AM",
      status: "due",
      imageUrl: medicineCapsule,
      withFood: true,
      period: "morning",
    },
    {
      id: "3",
      name: "Cough Syrup",
      dosage: "5ml Syrup",
      instructions: "Take 2 spoons",
      time: "2:00 PM",
      status: "due",
      imageUrl: medicineSyrup,
      withFood: false,
      period: "afternoon",
    },
    {
      id: "4",
      name: "Vitamin D",
      dosage: "1000 IU Tablet",
      instructions: "Take 1 tablet",
      time: "9:00 PM",
      status: "missed",
      imageUrl: medicineTablet,
      withFood: true,
      period: "night",
    },
  ]);

  const handleMarkTaken = (id: string) => {
    setMedicines(prev =>
      prev.map(med =>
        med.id === id ? { ...med, status: "taken" as MedicineStatus } : med
      )
    );
    toast({
      title: "दवा ली गई",
      description: "बहुत अच्छा! अपना शेड्यूल बनाए रखें।",
    });
  };

  const handleMarkAllTaken = () => {
    setMedicines(prev =>
      prev.map(med =>
        med.status === "due" ? { ...med, status: "taken" as MedicineStatus } : med
      )
    );
    toast({
      title: "सभी दवाइयां ली गईं",
      description: "बहुत बढ़िया! आप अपने इलाज पर ध्यान दे रहे हैं।",
    });
  };

  const handleSnooze = (id: string) => {
    toast({
      title: "याद दिलाएंगे",
      description: "हम आपको 30 मिनट में फिर से याद दिलाएंगे।",
    });
  };

  const dueMedicines = medicines.filter(m => m.status === "due");
  const firstDueMedicine = dueMedicines[0];

  const { isListening, startListening, stopListening, isSupported } = useVoiceControl({
    onMarkTaken: () => firstDueMedicine && handleMarkTaken(firstDueMedicine.id),
    onSnooze: () => firstDueMedicine && handleSnooze(firstDueMedicine.id),
    language: 'hi-IN',
  });

  const calculateProgress = () => {
    const total = medicines.length;
    const taken = medicines.filter(m => m.status === "taken").length;
    return (taken / total) * 100;
  };

  const getMedicinesByPeriod = (period: "morning" | "afternoon" | "night") => {
    return medicines.filter(m => m.period === period);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Medicine Tracker</h1>
            <p className="text-sm text-muted-foreground">Stay on track with your health</p>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Grid Layout */}
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - Progress & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progress Ring Card */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <ProgressRing progress={calculateProgress()} size={160} />
                <div className="text-center">
                  <p className="text-base md:text-lg font-medium text-foreground">
                    आज {medicines.filter(m => m.status === "taken").length} में से {medicines.length} दवाइयां ली
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(calculateProgress())}% पूर्ण
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <QuickActionButton 
                onMarkAllTaken={handleMarkAllTaken}
                dueCount={dueMedicines.length}
              />
            </div>

            {/* Stats Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <p className="text-sm text-success-foreground/70">Taken</p>
                <p className="text-2xl font-bold text-success">
                  {medicines.filter(m => m.status === "taken").length}
                </p>
              </div>
              <div className="bg-due/10 border border-due/20 rounded-lg p-4">
                <p className="text-sm text-due-foreground/70">Due</p>
                <p className="text-2xl font-bold text-due-foreground">
                  {dueMedicines.length}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Morning */}
            {getMedicinesByPeriod("morning").length > 0 && (
              <TimelineSection title="Morning" icon="🌅">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {getMedicinesByPeriod("morning").map(medicine => (
                    <MedicineCard
                      key={medicine.id}
                      {...medicine}
                      onMarkTaken={() => handleMarkTaken(medicine.id)}
                      onSnooze={() => handleSnooze(medicine.id)}
                    />
                  ))}
                </div>
              </TimelineSection>
            )}

            {/* Afternoon */}
            {getMedicinesByPeriod("afternoon").length > 0 && (
              <TimelineSection title="Afternoon" icon="☀️">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {getMedicinesByPeriod("afternoon").map(medicine => (
                    <MedicineCard
                      key={medicine.id}
                      {...medicine}
                      onMarkTaken={() => handleMarkTaken(medicine.id)}
                      onSnooze={() => handleSnooze(medicine.id)}
                    />
                  ))}
                </div>
              </TimelineSection>
            )}

            {/* Night */}
            {getMedicinesByPeriod("night").length > 0 && (
              <TimelineSection title="Night" icon="🌙">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {getMedicinesByPeriod("night").map(medicine => (
                    <MedicineCard
                      key={medicine.id}
                      {...medicine}
                      onMarkTaken={() => handleMarkTaken(medicine.id)}
                      onSnooze={() => handleSnooze(medicine.id)}
                    />
                  ))}
                </div>
              </TimelineSection>
            )}
          </div>
        </div>
      </div>

      {/* Voice Control Button */}
      <VoiceButton
        isListening={isListening}
        onStart={startListening}
        onStop={stopListening}
        isSupported={isSupported}
      />

      {/* Help Button */}
      <HelpButton />
    </div>
  );
};

export default Home;
