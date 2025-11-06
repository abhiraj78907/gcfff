import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Calendar, User, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const prescriptions: Prescription[] = [
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

  const currentPrescriptions = prescriptions.filter(p => p.status === "current");
  const pastPrescriptions = prescriptions.filter(p => p.status === "past");
  const [showPast, setShowPast] = useState(false);

  const navigate = useNavigate();

  const handleDownload = (p: Prescription) => {
    const content = `Prescription\nDate: ${p.date}\nDoctor: ${p.doctorName}\nHospital: ${p.hospitalName}\nDiagnosis: ${p.diagnosis}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${p.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

        {/* Medicines (structured like sample prescription) */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">MEDICINES</h4>
          <div className="rounded-lg border">
            <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
              <div>Medicine</div>
              <div>Dosage</div>
              <div>Duration</div>
            </div>
            <div className="divide-y">
              {prescription.medicines.map((med, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 px-3 py-2 text-sm">
                  <div className="font-medium text-foreground">{med.name}</div>
                  <div className="text-muted-foreground text-xs">{med.dosage}</div>
                  <div className="text-muted-foreground text-xs">{med.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/prescriptions/${prescription.id}`, { state: { prescription } })} aria-label="View prescription details">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(prescription)} aria-label="Download prescription">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">View and manage your prescriptions</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Current Prescriptions */}
        {currentPrescriptions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Current Prescriptions</h2>
            {currentPrescriptions.map(prescription => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        )}

        {/* Past Prescriptions - collapsed section */}
        {pastPrescriptions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Past Prescriptions</h2>
              <Button variant="outline" size="sm" onClick={() => setShowPast(p => !p)}>
                {showPast ? "Hide" : "View Details"}
              </Button>
            </div>
            {showPast && (
              <div className="space-y-3">
                {pastPrescriptions.map(prescription => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
              </div>
            )}
          </div>
        )}

        {prescriptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No prescriptions available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
