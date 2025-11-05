import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-6">Manage your profile and preferences</p>
        
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Sita" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="sita@vims.hospital" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" defaultValue="+91 9876543210" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="notifications" defaultChecked />
                  <Label htmlFor="notifications" className="font-normal cursor-pointer">
                    Enable desktop notifications
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button className="flex-1">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
