import { Search, Download, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@doctor/components/ui/card";
import { Button } from "@doctor/components/ui/button";
import { Input } from "@doctor/components/ui/input";
import { Badge } from "@doctor/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@doctor/components/ui/dialog";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useState } from "react";

const patientHistory = [
  {
    date: "3 Nov 2025",
    doctor: "Dr. Sharma",
    department: "General Medicine",
    diagnosis: "Viral Fever",
    symptoms: "Fever, headache, body pain (2 days)",
    medicines: "Paracetamol 500mg (3x5 days)",
    followUp: "6 Nov 2025",
  },
  {
    date: "15 Oct 2025",
    doctor: "Dr. Sharma",
    department: "General Medicine",
    diagnosis: "Viral Fever",
    symptoms: "Fever, cough",
    medicines: "Paracetamol, Azithromycin",
    followUp: "20 Oct 2025",
  },
  {
    date: "2 Sept 2025",
    doctor: "Dr. Patil",
    department: "Gastroenterology",
    diagnosis: "Gastritis",
    symptoms: "Stomach pain, acidity",
    medicines: "Pantoprazole, Antacid",
    followUp: "9 Sept 2025",
  },
];

export default function PatientHistory() {
  const [open, setOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<typeof patientHistory[0] | null>(null);
  const handleExportHistory = () => {
    toast.success("Exporting complete medical history for Ramesh Kumar");
  };

  const handleViewPrescription = (date: string) => {
    toast.info(`Viewing prescription from ${date}`);
  };

  const handleOpenDetails = (visit: typeof patientHistory[0]) => {
    setSelectedVisit(visit);
    setOpen(true);
  };

  const handleDownloadPDF = (date: string) => {
    toast.success(`Downloading prescription from ${date}`);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Patient History</h2>
        <p className="text-muted-foreground">Complete medical records and chronological view</p>
      </div>

      {/* Search Patient */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter patient ID or name..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Info */}
      <Card className="border-primary/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Ramesh Kumar</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Age: 45M • ID: VIMS-2025-12345
              </p>
              <p className="text-sm text-muted-foreground">
                Contact: +91 9876543210 • Aadhaar: XXXX XXXX 9012
              </p>
            </div>
            <Button variant="outline" onClick={handleExportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export Full History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Timeline View (Latest First)</span>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {patientHistory.map((visit, index) => (
              <div key={index} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 h-5 w-5 rounded-full border-4 border-primary bg-card" />

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {visit.date}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {visit.doctor} • {visit.department}
                        </p>
                      </div>
                      <Badge variant="secondary">Visit #{patientHistory.length - index}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-4 cursor-pointer" onClick={() => handleOpenDetails(visit)}>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Diagnosis</p>
                        <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Follow-up</p>
                        <p className="text-sm text-muted-foreground">{visit.followUp}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Symptoms</p>
                      <p className="text-sm text-muted-foreground">{visit.symptoms}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Medicines Prescribed</p>
                      <p className="text-sm text-muted-foreground">{visit.medicines}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPrescription(visit.date)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Prescription
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadPDF(visit.date)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
          </DialogHeader>
          {selectedVisit && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedVisit.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedVisit.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedVisit.department}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Diagnosis</p>
                <p className="font-medium">{selectedVisit.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Symptoms</p>
                <p className="font-medium">{selectedVisit.symptoms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medicines</p>
                <p className="font-medium">{selectedVisit.medicines}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Monthly Consultations</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: "Jul", count: 8 },
                      { month: "Aug", count: 10 },
                      { month: "Sep", count: 9 },
                      { month: "Oct", count: 12 },
                      { month: "Nov", count: 14 },
                      { month: "Dec", count: 15 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
