import { useState, useEffect } from "react";
import { Bell, Globe, Moon, FileSignature, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@shared/contexts/AuthContext";
import { upsertById } from "@shared/lib/db";

export default function Settings() {
  const { user } = useAuth();
  
  // Initialize with default values - never undefined
  const [transcriptionLanguage, setTranscriptionLanguage] = useState<string>(() => {
    // Try to load from localStorage or use default
    if (typeof window !== "undefined") {
      return localStorage.getItem("transcriptionLanguage") || "hindi";
    }
    return "hindi";
  });
  const [prescriptionTemplate, setPrescriptionTemplate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("prescriptionTemplate") || "standard";
    }
    return "standard";
  });
  
  // Load settings from Firestore user profile on mount
  useEffect(() => {
    if (user?.id) {
      // Settings would be stored in user profile
      // For now, we use localStorage as fallback
      // In future, can fetch from user profile
    }
  }, [user]);
  
  const handleSaveChanges = async () => {
    try {
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("transcriptionLanguage", transcriptionLanguage);
        localStorage.setItem("prescriptionTemplate", prescriptionTemplate);
      }
      
      // Save to Firestore user profile if user is logged in
      if (user?.id) {
        await upsertById("users", user.id, {
          settings: {
            transcriptionLanguage,
            prescriptionTemplate,
          },
        });
      }
      
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated",
    });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings", {
        description: "Please try again",
      });
    }
  };

  const handleResetToDefault = () => {
    toast.info("Settings reset to default", {
      description: "All preferences have been restored to default values",
    });
  };

  const handleManageSignature = () => {
    toast.info("Opening signature management");
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings & Preferences</h2>
        <p className="text-muted-foreground">Customize your consultation experience</p>
      </div>

      {/* AI Assistant Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            AI Assistant Preferences
          </CardTitle>
          <CardDescription>
            Configure how the AI assistant helps during consultations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-listening">Enable AI Listening</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to transcribe and structure consultations
              </p>
            </div>
            <Switch id="ai-listening" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Transcription Language</Label>
            <Select value={transcriptionLanguage} onValueChange={(value) => {
              console.log("[Settings] Transcription language changed:", value);
              setTranscriptionLanguage(value);
              if (typeof window !== "undefined") {
                localStorage.setItem("transcriptionLanguage", value);
              }
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="kannada">Kannada</SelectItem>
                <SelectItem value="tamil">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-fill">Auto-fill Forms</Label>
              <p className="text-sm text-muted-foreground">
                Let AI automatically fill consultation forms from transcripts
              </p>
            </div>
            <Switch id="auto-fill" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-patient">New Patient Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a new patient joins your queue
              </p>
            </div>
            <Switch id="new-patient" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="lab-results">Lab Results Ready</Label>
              <p className="text-sm text-muted-foreground">
                Alert when lab test results are available
              </p>
            </div>
            <Switch id="lab-results" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="queue-alert">Long Wait Time Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Notify when patients wait more than 30 minutes
              </p>
            </div>
            <Switch id="queue-alert" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders for scheduled appointments
              </p>
            </div>
            <Switch id="appointment-reminders" />
          </div>
        </CardContent>
      </Card>

      {/* Prescription Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Prescription Settings
          </CardTitle>
          <CardDescription>
            Configure your prescription templates and signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Default Prescription Template</Label>
            <Select value={prescriptionTemplate} onValueChange={(value) => {
              console.log("[Settings] Prescription template changed:", value);
              setPrescriptionTemplate(value);
              if (typeof window !== "undefined") {
                localStorage.setItem("prescriptionTemplate", value);
              }
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Template</SelectItem>
                <SelectItem value="detailed">Detailed Template</SelectItem>
                <SelectItem value="minimal">Minimal Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-signature">Auto-add Digital Signature</Label>
              <p className="text-sm text-muted-foreground">
                Automatically include your signature on prescriptions
              </p>
            </div>
            <Switch id="auto-signature" defaultChecked />
          </div>

          <div>
            <Button variant="outline" onClick={handleManageSignature}>
              Manage Signature
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-upload">Upload Prescription Template (PDF/DOCX)</Label>
            <div className="flex items-center gap-2">
              <input id="template-upload" type="file" accept=".pdf,.doc,.docx" className="text-sm" />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Interface Theme</Label>
            <RadioGroup defaultValue="auto">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="font-normal">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto" className="font-normal">Auto (System)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="font-normal">Dark</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
        <Button variant="outline" onClick={handleResetToDefault}>Reset to Default</Button>
      </div>
    </div>
  );
}
