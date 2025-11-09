import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Mic, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientRegistration = () => {
  const [step, setStep] = useState<"aadhaar" | "details" | "success">("aadhaar");
  const [aadhaar, setAadhaar] = useState("");
  const { toast } = useToast();

  const commonSymptoms = ["Fever", "Cough", "Headache", "Stomach Pain", "Injury", "Follow-up"];

  const handleFetchDetails = () => {
    if (aadhaar.length === 12) {
      toast({ title: "Details Fetched", description: "Patient information loaded from UIDAI" });
      setStep("details");
    }
  };

  const handleRegister = () => {
    toast({ title: "Success!", description: "Patient registered successfully" });
    setStep("success");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Patient Registration</h1>
        <p className="text-muted-foreground mb-6">Register new patients in under 3 minutes</p>

        {step === "aadhaar" && (
          <Card className="p-8">
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4">Step 1: Aadhaar Verification</h2>
              <p className="text-muted-foreground mb-6">Enter 12-digit Aadhaar number to auto-populate patient details</p>
              <div className="space-y-4">
                <Input
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  maxLength={12}
                  className="text-center text-lg"
                />
                <Button onClick={handleFetchDetails} className="w-full gap-2" size="lg">
                  <Search className="w-5 h-5" />
                  Fetch Details
                </Button>
                <p className="text-xs text-muted-foreground">Patient details will auto-populate from UIDAI</p>
              </div>
            </div>
          </Card>
        )}

        {step === "details" && (
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 2: Patient Details</h2>
                <p className="text-muted-foreground">Review and edit auto-filled information</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="Ramesh Kumar" />
                    <Badge variant="secondary">Auto-filled</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input defaultValue="45" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="flex gap-2 h-10 items-center">
                      <input type="radio" name="gender" id="male" defaultChecked />
                      <Label htmlFor="male" className="cursor-pointer">Male</Label>
                      <input type="radio" name="gender" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Female</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contact Number</Label>
                <div className="flex gap-2">
                  <Input defaultValue="+91 9876543210" />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "OTP Sent",
                        description: "OTP has been sent to +91 9876543210. Please enter the OTP to verify.",
                      });
                    }}
                  >
                    Verify OTP
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue="Village Kampli, Ballari, Karnataka" />
              </div>

              <div className="space-y-3 border-t pt-6">
                <h3 className="font-semibold text-lg">Health Information</h3>
                <div className="space-y-2">
                  <Label>Primary Symptoms (Required)</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Type symptoms or use voice input" />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Voice Input",
                          description: "Voice input feature will be available soon. Please type your symptoms.",
                        });
                      }}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Quick Select Common Symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Button 
                        key={symptom} 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Symptom Added",
                            description: `${symptom} has been added to the symptoms list.`,
                          });
                        }}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-6">
                <h3 className="font-semibold text-lg">Department Assignment</h3>
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Recommended Department: Internal Medicine</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assigned Doctor: Dr. Sharma (Available, Queue: 3 patients)
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Change Department",
                          description: "Department selection dialog will open here.",
                        });
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button onClick={handleRegister} className="flex-1" size="lg">
                  Register Patient
                </Button>
                <Button variant="outline" onClick={() => setStep("aadhaar")} size="lg">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === "success" && (
          <Card className="p-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Patient Registered Successfully</h2>
              <div className="bg-accent/50 rounded-lg p-6 text-left space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-semibold">VIMS-2025-12345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-semibold">Ramesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold">Internal Medicine - Ward B2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-semibold">Dr. Sharma</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Number:</span>
                  <span className="font-semibold text-2xl text-primary">15</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">📱 SMS sent to +91 9876543210</p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    window.print();
                  }}
                >
                  Print Token
                </Button>
                <Button onClick={() => setStep("aadhaar")} className="flex-1">Register Another</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientRegistration;
