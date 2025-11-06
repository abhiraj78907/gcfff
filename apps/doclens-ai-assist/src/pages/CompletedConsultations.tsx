import { Search, Download, RotateCcw, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@doctor/components/ui/card";
import { Button } from "@doctor/components/ui/button";
import { Input } from "@doctor/components/ui/input";
import { Badge } from "@doctor/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doctor/components/ui/select";

const completedConsultations = [
  {
    id: "VIMS-2025-12345",
    name: "Ramesh Kumar",
    age: "45M",
    time: "10:45 AM",
    diagnosis: "Viral Fever",
    medicines: "Paracetamol 500mg (3x5 days)",
    followUp: "6 Nov 2025",
  },
  {
    id: "VIMS-2025-12344",
    name: "Sita Devi",
    age: "38F",
    time: "10:30 AM",
    diagnosis: "Upper Respiratory Infection",
    medicines: "Azithromycin, Cetirizine",
    followUp: "8 Nov 2025",
  },
  {
    id: "VIMS-2025-12343",
    name: "Abdul Khan",
    age: "52M",
    time: "10:15 AM",
    diagnosis: "Diabetes Follow-up",
    medicines: "Metformin 500mg (2x daily)",
    followUp: "10 Nov 2025",
  },
];

export default function CompletedConsultations() {
  const navigate = useNavigate();

  const handleViewPrescription = (patientName: string) => {
    toast.info(`Viewing prescription for ${patientName}`);
  };

  const handleReopen = (patientName: string) => {
    toast.success(`Reopening consultation for ${patientName}`);
    navigate("/consultation");
  };

  const handleDownload = (patientName: string) => {
    toast.success(`Downloading prescription for ${patientName}`);
  };

  const handleExportCsv = () => toast.success("Exporting CSV");
  const handleExportXls = () => toast.success("Exporting Excel");
  const handleExportPdf = () => toast.success("Exporting PDF");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Completed Consultations</h2>
        <p className="text-muted-foreground">Today, 3 Nov 2025</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8 min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lab Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="today">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="absolute right-0 mt-2 w-36 rounded-md border bg-popover shadow-sm p-1 text-sm">
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent" onClick={handleExportCsv}>CSV</button>
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent" onClick={handleExportXls}>Excel</button>
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent" onClick={handleExportPdf}>PDF</button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {completedConsultations.map((consultation) => (
            <Card key={consultation.id} className="border border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {consultation.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {consultation.age} • {consultation.id}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        ✓ Completed at {consultation.time}
                      </Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Diagnosis:</span>
                        <span className="ml-2 font-medium text-foreground">{consultation.diagnosis}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Follow-up:</span>
                        <span className="ml-2 font-medium text-foreground">{consultation.followUp}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Medicines:</span>
                      <span className="ml-2 text-foreground">{consultation.medicines}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleViewPrescription(consultation.name)}
                    >
                      View Prescription
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleReopen(consultation.name)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reopen
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(consultation.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
