/**
 * Settings Page
 * Full configuration management with validation and save functionality
 */

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Lock, Globe, Palette, Building2, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Switch } from "@admin/components/ui/switch";
import { Label } from "@admin/components/ui/label";
import { Input } from "@admin/components/ui/input";
import { Textarea } from "@admin/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import { useAdminSettings, useUpdateSettings } from "../hooks/useAdminSettings";
import { useToast } from "../hooks/use-toast";
import type { Settings } from "../lib/adminApi";

const Settings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, refetch } = useAdminSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [formData, setFormData] = useState<Partial<Settings>>({
    notifications: { email: true, sms: false, push: true },
    security: { twoFactor: true, autoLogout: true, sessionTimeout: 30 },
    regional: { language: "en", timezone: "IST" },
    appearance: { darkMode: false, compactView: false },
    clinic: {
      name: "",
      address: "",
      phone: "",
      email: "",
      hours: "9:00 AM - 6:00 PM",
    },
    features: {},
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings when data is available
  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setHasChanges(false);
    }
  }, [settings]);

  // Track changes
  const updateField = (path: string[], value: any) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current: any = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      setHasChanges(true);
      return newData;
    });
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      await updateSettingsMutation.mutateAsync(formData);
      setHasChanges(false);
      // Refetch to get latest settings
      await refetch();
    } catch (error: any) {
      // Error handled by mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change functionality will open in a modal.",
    });
    // TODO: Open password change modal
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and configuration</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving}
          className="bg-gradient-primary"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive critical alerts via email</p>
              </div>
              <Switch
                id="email-alerts"
                checked={formData.notifications?.email || false}
                onCheckedChange={(checked) => updateField(["notifications", "email"], checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-alerts">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Get SMS for urgent alerts</p>
              </div>
              <Switch
                id="sms-alerts"
                checked={formData.notifications?.sms || false}
                onCheckedChange={(checked) => updateField(["notifications", "sms"], checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-alerts">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser notifications</p>
              </div>
              <Switch
                id="push-alerts"
                checked={formData.notifications?.push || false}
                onCheckedChange={(checked) => updateField(["notifications", "push"], checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage security settings and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add extra layer of security</p>
              </div>
              <Switch
                id="2fa"
                checked={formData.security?.twoFactor || false}
                onCheckedChange={(checked) => updateField(["security", "twoFactor"], checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session">Auto-logout</Label>
                <p className="text-sm text-muted-foreground">After inactivity timeout</p>
              </div>
              <Switch
                id="session"
                checked={formData.security?.autoLogout || false}
                onCheckedChange={(checked) => updateField(["security", "autoLogout"], checked)}
              />
            </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="5"
                  max="120"
                  value={formData.security?.sessionTimeout || 30}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 30;
                    updateField(["security", "sessionTimeout"], value);
                  }}
                />
              </div>
            <Button variant="outline" className="w-full" onClick={handleChangePassword}>
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Regional Settings
            </CardTitle>
            <CardDescription>Language and timezone preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.regional?.language || "en"}
                onValueChange={(value) => updateField(["regional", "language"], value)}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="kn">Kannada</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="ur">Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.regional?.timezone || "IST"}
                onValueChange={(value) => updateField(["regional", "timezone"], value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IST">IST (GMT+5:30)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="EST">EST (GMT-5)</SelectItem>
                  <SelectItem value="PST">PST (GMT-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
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
              <Switch
                id="dark-mode"
                checked={formData.appearance?.darkMode || false}
                onCheckedChange={(checked) => updateField(["appearance", "darkMode"], checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact">Compact View</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing</p>
              </div>
              <Switch
                id="compact"
                checked={formData.appearance?.compactView || false}
                onCheckedChange={(checked) => updateField(["appearance", "compactView"], checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Clinic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Clinic Information
            </CardTitle>
            <CardDescription>Configure clinic details and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name *</Label>
                <Input
                  id="clinic-name"
                  value={formData.clinic?.name || ""}
                  onChange={(e) => updateField(["clinic", "name"], e.target.value)}
                  placeholder="Enter clinic name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-phone">Phone *</Label>
                <Input
                  id="clinic-phone"
                  type="tel"
                  value={formData.clinic?.phone || ""}
                  onChange={(e) => updateField(["clinic", "phone"], e.target.value)}
                  placeholder="+91 1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-email">Email *</Label>
                <Input
                  id="clinic-email"
                  type="email"
                  value={formData.clinic?.email || ""}
                  onChange={(e) => updateField(["clinic", "email"], e.target.value)}
                  placeholder="clinic@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-hours">Operating Hours</Label>
                <Input
                  id="clinic-hours"
                  value={formData.clinic?.hours || ""}
                  onChange={(e) => updateField(["clinic", "hours"], e.target.value)}
                  placeholder="9:00 AM - 6:00 PM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-address">Address *</Label>
              <Textarea
                id="clinic-address"
                value={formData.clinic?.address || ""}
                onChange={(e) => updateField(["clinic", "address"], e.target.value)}
                placeholder="Enter full address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
