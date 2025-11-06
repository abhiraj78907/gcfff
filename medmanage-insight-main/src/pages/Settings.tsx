import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Building2, Bell, DollarSign } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Preferences</h1>
        <p className="text-muted-foreground">Configure your pharmacy dashboard</p>
      </div>

      {/* Shop Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Shop Profile</CardTitle>
          </div>
          <CardDescription>Manage your pharmacy information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shopName">Pharmacy Name</Label>
              <Input id="shopName" defaultValue="PharmaCare Medical Store" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input id="license" defaultValue="DL-2024-12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="pharmacare@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123, Medical Complex, MG Road, Mumbai - 400001" />
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            <CardTitle>Pricing Configuration</CardTitle>
          </div>
          <CardDescription>Set default pricing and markup rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="markup">Default Markup (%)</Label>
              <Input id="markup" type="number" defaultValue="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rounding">Bill Rounding</Label>
              <Input id="rounding" defaultValue="Nearest ₹5" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GST Calculation</Label>
              <p className="text-sm text-muted-foreground">Automatically calculate GST on medicines</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-warning" />
            <CardTitle>Alerts & Notifications</CardTitle>
          </div>
          <CardDescription>Configure alert thresholds and notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lowStock">Low Stock Alert (days)</Label>
              <Input id="lowStock" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Alert (days)</Label>
              <Input id="expiry" type="number" defaultValue="90" />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dashboard Alerts</Label>
                <p className="text-sm text-muted-foreground">Show alerts on dashboard</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
