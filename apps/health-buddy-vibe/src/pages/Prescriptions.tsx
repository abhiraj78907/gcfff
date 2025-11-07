import { Card } from "@patient/components/ui/card";
import { Button } from "@patient/components/ui/button";
import { Badge } from "@patient/components/ui/badge";
import { Download, Share2, Eye, Calendar, User, Building2 } from "lucide-react";
import { Separator } from "@patient/components/ui/separator";
import { usePatientPrescriptions } from "../hooks/usePatientPrescriptions";

interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  hospitalName: string;
  diagnosis: string;
  medicines: {
    name: string;
    dosage: string;
    duration: string;
  }[];
  status: "current" | "past";
}

const Prescriptions = () => {
  const mockPrescriptions: Prescription[] = [
    {
      id: "1",
      date: "2025-11-01",
      doctorName: "Dr. Sharma",
      hospitalName: "VIMS Hospital",
      diagnosis: "Upper Respiratory Infection",
      medicines: [
        { name: "Paracetamol 500mg", dosage: "1 tablet 3 times daily", duration: "5 days" },
        { name: "Amoxicillin 250mg", dosage: "1 capsule 2 times daily", duration: "7 days" },
        { name: "Cough Syrup", dosage: "2 spoons 3 times daily", duration: "5 days" },
      ],
      status: "current",
    },
    {
      id: "2",
      date: "2025-10-15",
      doctorName: "Dr. Patil",
      hospitalName: "VIMS Hospital",
      diagnosis: "Seasonal Allergies",
      medicines: [
        { name: "Cetirizine 10mg", dosage: "1 tablet once daily", duration: "10 days" },
      ],
      status: "past",
    },
  ];

  const { prescriptions } = usePatientPrescriptions(mockPrescriptions);
  const currentPrescriptions = prescriptions.filter(p => p.status === "current");
  const pastPrescriptions = prescriptions.filter(p => p.status === "past");

  const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => (
    <Card className="p-5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date(prescription.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{prescription.doctorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{prescription.hospitalName}</span>
            </div>
          </div>
          <Badge variant={prescription.status === "current" ? "default" : "secondary"}>
            {prescription.status === "current" ? "Active" : "Completed"}
          </Badge>
        </div>

        <Separator />

        {/* Diagnosis */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1">DIAGNOSIS</h4>
          <p className="text-sm font-medium text-foreground">{prescription.diagnosis}</p>
        </div>

        {/* Medicines */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">MEDICINES</h4>
          <div className="space-y-2">
            {prescription.medicines.map((med, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-sm text-foreground">{med.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{med.dosage}</p>
                <p className="text-xs text-muted-foreground">Duration: {med.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">View and manage your prescriptions</p>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Current Prescriptions */}
          {currentPrescriptions.length > 0 && (
            <div className="space-y-4 lg:col-span-2">
              <h2 className="text-base md:text-lg font-semibold text-foreground">Current Prescriptions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentPrescriptions.map(prescription => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            </div>
          )}

          {/* Past Prescriptions */}
          {pastPrescriptions.length > 0 && (
            <div className="space-y-4 lg:col-span-2">
              <h2 className="text-base md:text-lg font-semibold text-foreground">Past Prescriptions</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pastPrescriptions.map(prescription => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            </div>
          )}

          {prescriptions.length === 0 && (
            <div className="lg:col-span-2 text-center py-12">
              <p className="text-muted-foreground">No prescriptions available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
