import { useState, useEffect } from "react";
import { Mic, MicOff, Loader2, Plus, Trash2, Edit } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@doctor/components/ui/card";
import { Button } from "@doctor/components/ui/button";
import { Badge } from "@doctor/components/ui/badge";
import { Input } from "@doctor/components/ui/input";
import { Label } from "@doctor/components/ui/label";
import { Textarea } from "@doctor/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doctor/components/ui/select";
import { Checkbox } from "@doctor/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@doctor/components/ui/radio-group";

export default function ActiveConsultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [medicines, setMedicines] = useState([
    {
      id: "1",
      name: "Paracetamol 500mg Tablet",
      timing: ["morning", "afternoon", "night"],
      food: "after",
      duration: 5,
      quantity: 15,
    },
  ]);

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast.success("AI listening started", {
      description: "Transcribing conversation in real-time",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.info("AI listening stopped", {
      description: `Recorded ${recordingTime} seconds`,
    });
  };

  const handleAddMedicine = () => {
    toast.success("Medicine added to prescription");
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id));
    toast.success("Medicine removed from prescription");
  };

  const handlePreviewPrescription = () => {
    toast.info("Prescription preview", {
      description: "Opening prescription preview...",
    });
  };

  const handleSaveAndSign = () => {
    toast.success("Prescription saved successfully", {
      description: "Patient will receive prescription via SMS",
    });
    setTimeout(() => {
      navigate("/completed");
    }, 1500);
  };

  const routePatient = (location.state as any)?.patient;
  const patient = routePatient ?? {
    name: "Ramesh Kumar",
    age: "45M",
    id: "VIMS-2025-12345",
    contact: "+91 9876543210",
    registered: "9:45 AM",
    pastVisits: [
      { date: "15 Oct 2025", diagnosis: "Viral Fever", medicines: "Paracetamol" },
      { date: "2 Sept 2025", diagnosis: "Stomach pain", medicines: "Antacid" },
    ],
  };

  const [baseProblem, setBaseProblem] = useState("");

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div className="mb-4 px-1 md:px-0">
        <h2 className="text-2xl font-bold text-foreground">
          Consultation: {patient.name} ({patient.age})
        </h2>
        <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
      </div>

      <div className="lg:grid grid-cols-5 gap-4 md:gap-6 flex-1 min-h-0 px-1 md:px-0">
        {/* Left Panel - Patient Context (40%) */}
        <div className="lg:col-span-2 space-y-4 lg:overflow-y-auto min-h-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-medium">{patient.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{patient.contact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Base Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter the patient's base problem in one line"
                value={baseProblem}
                onChange={(e) => setBaseProblem(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Past Visits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.pastVisits.map((visit, i) => (
                <div key={i} className="border-l-2 border-primary pl-3 text-sm">
                  <p className="font-medium">{visit.date}</p>
                  <p className="text-muted-foreground">Diagnosis: {visit.diagnosis}</p>
                  <p className="text-muted-foreground">Medicines: {visit.medicines}</p>
                </div>
              ))}
              <Button variant="link" size="sm" className="px-0">
                View Complete History →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - AI Interface (60%) */}
        <div className="lg:col-span-3 space-y-4 lg:overflow-y-auto min-h-0">
          {/* AI Section simplified */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <Button
                  size="lg"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`h-20 px-6 rounded-full ${
                    isRecording
                      ? "bg-critical hover:bg-critical/90 animate-pulse"
                      : "bg-success hover:bg-success/90"
                  }`}
                >
                  {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                <p className="mt-3 text-sm font-medium">
                  {isRecording ? `Recording: ${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}` : "Ready to listen"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Structured Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms">
                  Symptoms <Badge variant="secondary" className="ml-2 text-xs">AI generated</Badge>
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="AI will populate, you can edit freely"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">
                  Diagnosis <Badge variant="secondary" className="ml-2 text-xs">AI generated</Badge>
                </Label>
                <Textarea id="diagnosis" placeholder="AI will suggest here; edit as needed" className="mt-1.5" />
              </div>

              <div>
                <Label htmlFor="advice">Advice</Label>
                <Textarea
                  id="advice"
                  defaultValue="Rest, drink fluids, avoid oily food"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="followup">Follow-up Date</Label>
                <Input type="date" id="followup" className="mt-1.5" defaultValue="2025-11-06" />
              </div>
            </CardContent>
          </Card>

          {/* Medicine Entry */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add Medicines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="medicine-search">Search Medicine</Label>
                <Input id="medicine-search" placeholder="Type to search, select multiple" className="mt-1.5" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm">
                  {['Paracetamol', 'Dolo 650', 'Azithromycin', 'Cetirizine', 'Metformin', 'Pantoprazole'].map((name) => (
                    <label key={name} className="flex items-center gap-2 rounded border p-2 cursor-pointer hover:bg-accent">
                      <Checkbox />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medicine Form */}
              <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <p className="font-medium text-sm">Paracetamol 500mg Tablet</p>
                
                <div>
                  <Label className="text-sm">Timing</Label>
                  <div className="flex gap-4 mt-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="morning" defaultChecked />
                      <label htmlFor="morning" className="text-sm">Morning</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="afternoon" defaultChecked />
                      <label htmlFor="afternoon" className="text-sm">Afternoon</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="night" defaultChecked />
                      <label htmlFor="night" className="text-sm">Night</label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Food</Label>
                  <RadioGroup defaultValue="after" className="flex gap-4 mt-1.5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="before" id="before" />
                      <label htmlFor="before" className="text-sm">Before</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after" id="after" />
                      <label htmlFor="after" className="text-sm">After</label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="duration" className="text-sm">Duration (days)</Label>
                    <Input id="duration" type="number" defaultValue="5" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-sm">Quantity</Label>
                    <Input id="quantity" type="number" defaultValue="15" className="mt-1.5" />
                  </div>
                </div>

                <Button size="sm" className="w-full" onClick={handleAddMedicine}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Prescription
                </Button>
              </div>

              {/* Added Medicines */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 border-b">
                  <p className="font-medium text-sm">Added Medicines ({medicines.length})</p>
                </div>
                <div className="divide-y">
                  {medicines.map((medicine) => (
                    <div key={medicine.id} className="p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-muted-foreground text-xs mt-1">
                            {medicine.timing.length}x/day ({medicine.timing.map(t => t.charAt(0).toUpperCase()).join('-')}) • 
                            {medicine.food === "after" ? " After" : " Before"} food • 
                            {medicine.duration} days • {medicine.quantity} tablets
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Edit functionality coming soon")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-critical"
                            onClick={() => handleRemoveMedicine(medicine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={handlePreviewPrescription}>
                  Preview Prescription
                </Button>
                <Button className="flex-1" onClick={handleSaveAndSign}>
                  Save & Sign
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => navigate('/lab-requests')}>
                  Order Lab Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
