import { Plus, Search, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@doctor/components/ui/card";
import { Button } from "@doctor/components/ui/button";
import { Input } from "@doctor/components/ui/input";
import { Badge } from "@doctor/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doctor/components/ui/select";

const labTests = [
  {
    id: "VIMS-2025-12345",
    patient: "Ramesh Kumar",
    tests: ["CBC", "Blood Sugar (Fasting)"],
    ordered: "3 Nov 2025, 10:00 AM",
    status: "processing",
    expected: "4 Nov 2025, 2:00 PM",
  },
  {
    id: "VIMS-2025-12344",
    patient: "Sita Devi",
    tests: ["Urine Routine", "CBC"],
    ordered: "3 Nov 2025, 9:30 AM",
    status: "completed",
    completed: "3 Nov 2025, 11:30 AM",
    pathologist: "Dr. Rao",
  },
  {
    id: "VIMS-2025-12346",
    patient: "Abdul Khan",
    tests: ["HbA1c", "Lipid Profile"],
    ordered: "3 Nov 2025, 10:30 AM",
    status: "pending",
    expected: "4 Nov 2025, 10:00 AM",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Results Ready", color: "success", icon: CheckCircle };
    case "processing":
      return { label: "Processing", color: "warning", icon: Clock };
    case "pending":
      return { label: "Pending", color: "muted", icon: AlertCircle };
    default:
      return { label: status, color: "muted", icon: Clock };
  }
};

export default function LabRequests() {
  const handleOrderNewTest = () => {
    toast.info("Opening test order form");
  };

  const handleViewResults = (patientName: string) => {
    toast.success(`Opening lab results for ${patientName}`);
  };

  const handleDownloadPDF = (patientName: string) => {
    toast.success(`Downloading lab report for ${patientName}`);
  };

  const handleAddToPrescription = (patientName: string) => {
    toast.success(`Lab results added to ${patientName}'s prescription`);
  };

  const handleTrackStatus = (patientName: string) => {
    toast.info(`Tracking lab test status for ${patientName}`);
  };

  const handleCancelTest = (patientName: string) => {
    toast.error(`Test cancelled for ${patientName}`);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Lab Requests & Results</h2>
          <p className="text-muted-foreground">Manage and track laboratory tests</p>
        </div>
        <Button onClick={handleOrderNewTest}>
          <Plus className="h-4 w-4 mr-2" />
          Order New Test
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {labTests.map((test) => {
            const statusConfig = getStatusConfig(test.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={test.id} className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {test.patient}
                          </h3>
                          <p className="text-sm text-muted-foreground">{test.id}</p>
                        </div>
                        <Badge 
                          className={`ml-4 ${
                            test.status === "completed" 
                              ? "bg-success text-success-foreground" 
                              : test.status === "processing"
                              ? "bg-warning text-warning-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Tests Ordered:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {test.tests.map((testName, i) => (
                              <Badge key={i} variant="outline">{testName}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ordered:</span>
                            <span className="ml-2 text-foreground">{test.ordered}</span>
                          </div>
                          {test.status === "completed" ? (
                            <div>
                              <span className="text-muted-foreground">Completed:</span>
                              <span className="ml-2 text-foreground">{test.completed}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-muted-foreground">Expected:</span>
                              <span className="ml-2 text-foreground">{test.expected}</span>
                            </div>
                          )}
                        </div>

                        {test.pathologist && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Pathologist:</span>
                            <span className="ml-2 text-foreground">{test.pathologist}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:w-auto">
                      {test.status === "completed" ? (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleViewResults(test.patient)}
                          >
                            View Results
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadPDF(test.patient)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddToPrescription(test.patient)}
                          >
                            Add to Prescription
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTrackStatus(test.patient)}
                          >
                            Track Status
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-critical"
                            onClick={() => handleCancelTest(test.patient)}
                          >
                            Cancel Test
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
