import { useState, useMemo } from "react";
import { Plus, Search, Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLabRequests } from "@shared/hooks/useLabRequests";
import { Loader2 } from "lucide-react";

// Mock data removed - using real Firebase data via useLabRequests hook

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
  // Initialize with default - never undefined
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Use real Firebase data
  const { requests, loading, updateStatus } = useLabRequests();
  
  // Filter and search lab requests
  const filteredRequests = useMemo(() => {
    let filtered = requests;
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(req => req.status === filterStatus);
    }
    
    // Search by patient name or test type
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        (req.patientName?.toLowerCase().includes(query)) ||
        (req.testType?.toLowerCase().includes(query)) ||
        (req.patientId?.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [requests, filterStatus, searchQuery]);
  
  // Calculate stats from real data
  const stats = useMemo(() => {
    const pending = requests.filter(r => r.status === "ordered" || r.status === "pending").length;
    const processing = requests.filter(r => r.status === "in_progress" || r.status === "processing").length;
    const completed = requests.filter(r => r.status === "completed").length;
    return { pending, processing, completed };
  }, [requests]);
  
  const handleOrderNewTest = () => {
    toast.info("Opening test order form");
  };

  const handleViewResults = async (requestId: string, patientName: string) => {
    toast.success(`Opening lab results for ${patientName}`);
  };

  const handleDownloadPDF = (patientName: string) => {
    toast.success(`Downloading lab report for ${patientName}`);
  };

  const handleAddToPrescription = (patientName: string) => {
    toast.success(`Lab results added to ${patientName}'s prescription`);
  };

  const handleTrackStatus = async (requestId: string, status: string) => {
    try {
      await updateStatus(requestId, status as any);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleCancelTest = async (requestId: string, patientName: string) => {
    try {
      await updateStatus(requestId, "cancelled" as any);
      toast.success(`Test cancelled for ${patientName}`);
    } catch (error) {
      toast.error("Failed to cancel test");
      console.error(error);
    }
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
            <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
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
            <div className="text-2xl font-bold text-warning">{stats.processing}</div>
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
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={(value) => {
              console.log("[LabRequests] Filter status changed:", value);
              setFilterStatus(value);
            }}>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading lab requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No lab requests found
            </div>
          ) : (
            filteredRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status || "pending");
            const StatusIcon = statusConfig.icon;
            
            return (
                <Card key={request.id} className="border border-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                              {request.patientName || request.patientId || "Unknown Patient"}
                          </h3>
                            <p className="text-sm text-muted-foreground">{request.id}</p>
                        </div>
                        <Badge 
                          className={`ml-4 ${
                              request.status === "completed" 
                              ? "bg-success text-success-foreground" 
                                : request.status === "in_progress" || request.status === "processing"
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
                            <span className="text-sm text-muted-foreground">Test Type:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline">{request.testType || "N/A"}</Badge>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ordered:</span>
                              <span className="ml-2 text-foreground">
                                {request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}
                              </span>
                          </div>
                            {request.status === "completed" && request.resultUrl ? (
                            <div>
                                <span className="text-muted-foreground">Results Ready</span>
                            </div>
                          ) : (
                            <div>
                                <span className="text-muted-foreground">Status:</span>
                                <span className="ml-2 text-foreground capitalize">{request.status || "pending"}</span>
                            </div>
                          )}
                          </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:w-auto">
                        {request.status === "completed" ? (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                              onClick={() => handleViewResults(request.id, request.patientName || "")}
                          >
                            View Results
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                              onClick={() => handleDownloadPDF(request.patientName || "")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                              onClick={() => handleAddToPrescription(request.patientName || "")}
                          >
                            Add to Prescription
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                              onClick={() => handleTrackStatus(request.id, "in_progress")}
                          >
                            Track Status
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-critical"
                              onClick={() => handleCancelTest(request.id, request.patientName || "")}
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
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
