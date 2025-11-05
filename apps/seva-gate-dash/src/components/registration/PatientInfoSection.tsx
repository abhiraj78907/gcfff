import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientInfoSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const occupations = ["Farmer", "Student", "Labour", "Business", "Govt. Employee", "Private Employee", "Homemaker", "Retired", "Other"];

export const PatientInfoSection = ({ formData, onChange }: PatientInfoSectionProps) => {
  const formatMobile = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.substring(0, 10);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={formData.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>
              Gender <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.gender || ""}
              onValueChange={(value) => onChange("gender", value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="age">
              Age <span className="text-destructive">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={formData.age || ""}
              onChange={(e) => onChange("age", e.target.value)}
              min="0"
              max="120"
              required
            />
          </div>

          <div>
            <Label htmlFor="guardian">S/O, D/O, W/O</Label>
            <Input
              id="guardian"
              placeholder="Parent/Guardian name"
              value={formData.guardian || ""}
              onChange={(e) => onChange("guardian", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobile || ""}
              onChange={(e) => onChange("mobile", formatMobile(e.target.value))}
              maxLength={10}
            />
          </div>

          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Select value={formData.occupation || ""} onValueChange={(value) => onChange("occupation", value)}>
              <SelectTrigger id="occupation">
                <SelectValue placeholder="Select occupation" />
              </SelectTrigger>
              <SelectContent>
                {occupations.map((occ) => (
                  <SelectItem key={occ} value={occ.toLowerCase()}>
                    {occ}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="address">
            Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="Enter full address with city/locality"
            value={formData.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            rows={3}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
