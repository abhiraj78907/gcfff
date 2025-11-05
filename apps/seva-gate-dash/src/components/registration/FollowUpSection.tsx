import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FollowUpSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  showFollowUpAlert: boolean;
}

export const FollowUpSection = ({ formData, onChange, showFollowUpAlert }: FollowUpSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up & Consent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="followUp">Next Appointment / Follow-up (Optional)</Label>
          <Input
            id="followUp"
            type="date"
            value={formData.followUp || ""}
            onChange={(e) => onChange("followUp", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
          {showFollowUpAlert && (
            <Alert className="mt-2 border-amber-500 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Follow-up scheduled within 7 days
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="consent"
            checked={formData.consent || false}
            onCheckedChange={(checked) => onChange("consent", checked)}
          />
          <Label htmlFor="consent" className="cursor-pointer leading-relaxed">
            Patient informed about digital records and consents to data storage as per hospital policy
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
