import { Settings as SettingsIcon, Bell, Lock, Globe, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Switch } from "@admin/components/ui/switch";
import { Label } from "@admin/components/ui/label";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive critical alerts via email</p>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-alerts">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Get SMS for urgent alerts</p>
              </div>
              <Switch id="sms-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-alerts">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser notifications</p>
              </div>
              <Switch id="push-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add extra layer of security</p>
              </div>
              <Switch id="2fa" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session">Auto-logout</Label>
                <p className="text-sm text-muted-foreground">After 30 minutes of inactivity</p>
              </div>
              <Switch id="session" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Regional Settings
            </CardTitle>
            <CardDescription>Language and timezone preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Language</Label>
              <select className="w-full mt-2 p-2 border border-border rounded-md bg-background">
                <option>English</option>
                <option>Hindi</option>
                <option>Kannada</option>
                <option>Tamil</option>
              </select>
            </div>
            <div>
              <Label>Timezone</Label>
              <select className="w-full mt-2 p-2 border border-border rounded-md bg-background">
                <option>IST (GMT+5:30)</option>
                <option>UTC (GMT+0)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize interface appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact">Compact View</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing</p>
              </div>
              <Switch id="compact" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
