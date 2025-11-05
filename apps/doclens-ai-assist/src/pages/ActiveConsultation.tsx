import { useState, useEffect } from "react";
import { Mic, MicOff, Loader2, Plus, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const patient = {
    name: "Ramesh Kumar",
    age: "45M",
    id: "VIMS-2025-12345",
    contact: "+91 9876543210",
    registered: "9:45 AM",
    symptoms: ["Fever since 2 days", "Headache", "Body pain"],
    pastVisits: [
      { date: "15 Oct 2025", diagnosis: "Viral Fever", medicines: "Paracetamol" },
      { date: "2 Sept 2025", diagnosis: "Stomach pain", medicines: "Antacid" },
    ],
  };

  const transcript = [
    { time: "9:15", speaker: "Doctor", text: "What problem?" },
    { time: "9:15", speaker: "Patient", text: "Fever 2 days, headache, body pain" },
    { time: "9:16", speaker: "Doctor", text: "Any vomiting?" },
    { time: "9:16", speaker: "Patient", text: "No, only fever" },
  ];

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          Consultation: {patient.name} ({patient.age})
        </h2>
        <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 h-[calc(100%-5rem)]">
        {/* Left Panel - Patient Context (40%) */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
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
              <CardTitle className="text-base">Today's Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {patient.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
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
        <div className="lg:col-span-3 space-y-4 overflow-y-auto">
          {/* AI Recording Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Live AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <Button
                  size="lg"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`h-32 w-32 rounded-full ${
                    isRecording
                      ? "bg-critical hover:bg-critical/90 animate-pulse"
                      : "bg-success hover:bg-success/90"
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-12 w-12" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </Button>
                <p className="mt-4 text-sm font-medium">
                  {isRecording ? `Recording: ${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}` : "Ready to listen"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Patient consent recorded
                </Badge>
              </div>

              {/* Live Transcript */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Live Transcript</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                  {transcript.map((entry, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded text-sm ${
                        entry.speaker === "Doctor"
                          ? "bg-accent text-accent-foreground"
                          : "bg-success-light"
                      }`}
                    >
                      <span className="font-medium text-xs">{entry.time} {entry.speaker}:</span>
                      <p className="mt-1">{entry.text}</p>
                    </div>
                  ))}
                </div>
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
                  Symptoms <Badge variant="secondary" className="ml-2 text-xs">AI filled</Badge>
                </Label>
                <Textarea
                  id="symptoms"
                  defaultValue="Fever since 2 days, headache, body pain"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">
                  Diagnosis <Badge variant="secondary" className="ml-2 text-xs">AI suggested</Badge>
                </Label>
                <Select defaultValue="viral-fever">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viral-fever">Viral Fever</SelectItem>
                    <SelectItem value="bacterial-infection">Bacterial Infection</SelectItem>
                    <SelectItem value="flu">Flu</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input
                  id="medicine-search"
                  placeholder="Search by name or symptom..."
                  className="mt-1.5"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Paracetamol
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Crocin
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Dolo 650
                  </Badge>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
