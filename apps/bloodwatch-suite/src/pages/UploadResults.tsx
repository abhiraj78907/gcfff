import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface TestParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "low" | "high";
}

const testParameters: TestParameter[] = [
  { name: "Hemoglobin", value: "", unit: "g/dL", normalRange: "13-17", status: "normal" },
  { name: "WBC Count", value: "", unit: "cells/μL", normalRange: "4000-11000", status: "normal" },
  { name: "RBC Count", value: "", unit: "million/μL", normalRange: "4.5-5.5", status: "normal" },
  { name: "Platelet Count", value: "", unit: "cells/μL", normalRange: "150000-450000", status: "normal" },
  { name: "Hematocrit", value: "", unit: "%", normalRange: "40-50", status: "normal" },
];

export default function UploadResults() {
  const { toast } = useToast();
  const [parameters, setParameters] = useState<TestParameter[]>(testParameters);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleParameterChange = (index: number, value: string) => {
    const newParameters = [...parameters];
    newParameters[index].value = value;
    
    // Simple validation logic
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const [min, max] = newParameters[index].normalRange.split("-").map(Number);
      if (numValue < min) {
        newParameters[index].status = "low";
      } else if (numValue > max) {
        newParameters[index].status = "high";
      } else {
        newParameters[index].status = "normal";
      }
    }
    
    setParameters(newParameters);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Results Submitted",
      description: "Test results have been saved and sent for validation.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-warning";
      case "high":
        return "bg-destructive";
      default:
        return "bg-success";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "low":
        return <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning">Low</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-destructive/20 text-destructive-foreground border-destructive">High</Badge>;
      default:
        return <Badge variant="outline" className="bg-success/20 text-success-foreground border-success">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Test Results</h1>
        <p className="text-muted-foreground mt-1">Enter blood test parameters and upload reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="patient">Select Patient</Label>
          <Select>
            <SelectTrigger id="patient">
              <SelectValue placeholder="Search for patient..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p1">Rajesh Kumar - P-12345</SelectItem>
              <SelectItem value="p2">Priya Patel - P-12346</SelectItem>
              <SelectItem value="p3">Amit Singh - P-12347</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="test">Select Test Type</Label>
          <Select>
            <SelectTrigger id="test">
              <SelectValue placeholder="Choose test..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cbc">Complete Blood Count</SelectItem>
              <SelectItem value="lft">Liver Function Test</SelectItem>
              <SelectItem value="kft">Kidney Function Test</SelectItem>
              <SelectItem value="lipid">Lipid Profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
          <CardDescription>Enter measured values for each parameter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {parameters.map((param, index) => (
            <div key={param.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{param.name}</Label>
                {param.value && getStatusBadge(param.status)}
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={param.value}
                    onChange={(e) => handleParameterChange(index, e.target.value)}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-muted-foreground w-24">{param.unit}</span>
                <span className="text-xs text-muted-foreground w-32">Normal: {param.normalRange}</span>
              </div>
              {param.value && (
                <div className="flex items-center gap-2">
                  <Progress 
                    value={param.status === "normal" ? 100 : param.status === "low" ? 30 : 70} 
                    className="h-2" 
                  />
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(param.status)}`} />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Lab Report</CardTitle>
          <CardDescription>Attach scanned report (PDF, JPG, PNG)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any additional notes or observations..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSubmit} size="lg" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save & Send for Validation
        </Button>
        <Button variant="outline" size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}
