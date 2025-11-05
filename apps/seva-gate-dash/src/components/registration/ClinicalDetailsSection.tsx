import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mic, ChevronDown } from "lucide-react";

interface ClinicalDetailsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  selectedChips: string[];
  onChipToggle: (value: string) => void;
}

const symptomChips = [
  { label: "Fever 🌡️", value: "fever" },
  { label: "Cough 🤧", value: "cough" },
  { label: "Headache 🤕", value: "headache" },
  { label: "Fatigue 😴", value: "fatigue" },
  { label: "Body Pain 💪", value: "body_pain" },
];

const doctors = ["Dr. Sharma", "Dr. Patel", "Dr. Kumar", "Dr. Singh", "Dr. Reddy"];

export const ClinicalDetailsSection = ({ formData, onChange, selectedChips, onChipToggle }: ClinicalDetailsSectionProps) => {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="symptoms">
            Reason for Visit / Symptoms <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="symptoms"
            placeholder="Describe patient's symptoms and chief complaints..."
            rows={4}
            value={formData.symptoms || ""}
            onChange={(e) => onChange("symptoms", e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mic className="mr-2 h-4 w-4" />
            Voice Input (Hindi/Regional)
          </Button>
          <span className="text-xs text-muted-foreground">
            Click to record symptoms in your preferred language
          </span>
        </div>

        <div>
          <Label>Quick Symptom Selection</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {symptomChips.map((chip) => (
              <Badge
                key={chip.value}
                variant={selectedChips.includes(chip.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onChipToggle(chip.value)}
              >
                {chip.label}
              </Badge>
            ))}
          </div>
        </div>

        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span>Clinical History (Optional)</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <Textarea
              placeholder="Enter detailed clinical history, past conditions, allergies, medications..."
              rows={4}
              value={formData.clinicalHistory || ""}
              onChange={(e) => onChange("clinicalHistory", e.target.value)}
            />
          </CollapsibleContent>
        </Collapsible>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="doctor">
              Doctor Name <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.doctor || ""} onValueChange={(value) => onChange("doctor", value)}>
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assessmentDateTime">Initial Assessment Date/Time</Label>
            <Input
              id="assessmentDateTime"
              type="datetime-local"
              value={formData.assessmentDateTime || ""}
              onChange={(e) => onChange("assessmentDateTime", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
