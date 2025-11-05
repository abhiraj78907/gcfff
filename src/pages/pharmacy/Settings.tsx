import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PharmacySettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pharmacy Settings</h1>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Pharmacy Display Name</label>
          <Input placeholder="Enter display name" />
        </div>
        <div>
          <label className="text-sm font-medium">Notification Email</label>
          <Input type="email" placeholder="alerts@pharmacy.org" />
        </div>
        <Button>Save Changes</Button>
      </Card>
    </div>
  );
};

export default PharmacySettings;


