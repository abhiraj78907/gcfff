import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HospitalDetailsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const units = ["UNIT A", "UNIT B", "UNIT C", "UNIT D", "UNIT E"];
const rooms = Array.from({ length: 30 }, (_, i) => `Room ${i + 1}`);
const billingTypes = ["General", "Private"];
const patientTypes = ["NON MLC", "MLC"];

export const HospitalDetailsSection = ({ formData, onChange }: HospitalDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="uhid">UHID / Registration Number</Label>
            <Input
              id="uhid"
              value={formData.uhid || ""}
              onChange={(e) => onChange("uhid", e.target.value)}
              placeholder="Auto-generated"
              className="bg-muted"
              disabled
            />
          </div>

          <div>
            <Label htmlFor="regDateTime">Date & Time of Registration</Label>
            <Input
              id="regDateTime"
              type="datetime-local"
              value={formData.regDateTime || ""}
              onChange={(e) => onChange("regDateTime", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="unit">
              Consulting Unit/Ward <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.unit || ""} onValueChange={(value) => onChange("unit", value)}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="room">
              Room/Consulting Number <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.room || ""} onValueChange={(value) => onChange("room", value)}>
              <SelectTrigger id="room">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="billingType">
              Billing Type <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.billingType || ""} onValueChange={(value) => onChange("billingType", value)}>
              <SelectTrigger id="billingType">
                <SelectValue placeholder="Select billing type" />
              </SelectTrigger>
              <SelectContent>
                {billingTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="patientType">
              Patient Type <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.patientType || ""} onValueChange={(value) => onChange("patientType", value)}>
              <SelectTrigger id="patientType">
                <SelectValue placeholder="Select patient type" />
              </SelectTrigger>
              <SelectContent>
                {patientTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fee">
              Fee (₹) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fee"
              type="number"
              placeholder="Enter fee amount"
              value={formData.fee || ""}
              onChange={(e) => onChange("fee", e.target.value)}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="preparedBy">Prepared By</Label>
            <Input
              id="preparedBy"
              value={formData.preparedBy || ""}
              placeholder="Logged-in user"
              className="bg-muted"
              disabled
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
