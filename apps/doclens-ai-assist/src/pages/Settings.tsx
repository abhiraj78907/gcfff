import { Bell, Globe, Moon, Clock, FileSignature } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@doctor/components/ui/card";
import { Button } from "@doctor/components/ui/button";
import { Label } from "@doctor/components/ui/label";
import { Switch } from "@doctor/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@doctor/components/ui/radio-group";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doctor/components/ui/select";

export default function Settings() {
  const handleSaveChanges = () => {
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated",
    });
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
            <Select defaultValue="hindi">
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
            <Select defaultValue="standard">
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

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Auto-logout Timer
            </Label>
            <Select defaultValue="15">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
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
