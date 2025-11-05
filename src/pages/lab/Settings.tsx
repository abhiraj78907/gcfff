import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function LabSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lab Settings</h1>
        <p className="text-muted-foreground mt-1">Configuration specific to the Lab module</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Result Validation</CardTitle>
          <CardDescription>Control validation rules and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="block">Require senior validation</Label>
              <p className="text-xs text-muted-foreground">Mandatory sign-off for critical tests</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tatTarget">Target TAT (hours)</Label>
              <Input id="tatTarget" type="number" placeholder="6" />
            </div>
            <div>
              <Label htmlFor="notifEmail">Notification email</Label>
              <Input id="notifEmail" type="email" placeholder="lab@medichain.health" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button>Save Settings</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruments</CardTitle>
          <CardDescription>Instrument IDs and integration keys</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cbcId">CBC Analyzer ID</Label>
            <Input id="cbcId" placeholder="CBC-ANR-001" />
          </div>
          <div>
            <Label htmlFor="lftId">LFT Analyzer ID</Label>
            <Input id="lftId" placeholder="LFT-ANR-002" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="apiKey">Integration API Key</Label>
            <Input id="apiKey" type="password" placeholder="••••••••" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


