import { useState, useMemo } from "react";
import { Search, Download, RotateCcw, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompletedConsultations } from "@shared/hooks/useCompletedConsultations";

export default function CompletedConsultations() {
  const navigate = useNavigate();
  // Initialize with default - never undefined
  const [filterPeriod, setFilterPeriod] = useState<string>("today");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Use real Firebase data
  const { consultations, loading, stats } = useCompletedConsultations();
  
  // Filter consultations by period and search
  const filteredConsultations = useMemo(() => {
    let filtered = consultations;
    
    // Filter by period
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    if (filterPeriod === "today") {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      filtered = filtered.filter(c => c.createdAt >= todayStart);
    } else if (filterPeriod === "yesterday") {
      const yesterdayStart = new Date().setHours(0, 0, 0, 0) - dayMs;
      const todayStart = new Date().setHours(0, 0, 0, 0);
      filtered = filtered.filter(c => c.createdAt >= yesterdayStart && c.createdAt < todayStart);
    } else if (filterPeriod === "week") {
      const weekStart = now - (7 * dayMs);
      filtered = filtered.filter(c => c.createdAt >= weekStart);
    } else if (filterPeriod === "month") {
      const monthStart = now - (30 * dayMs);
      filtered = filtered.filter(c => c.createdAt >= monthStart);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        (c.patientName?.toLowerCase().includes(query)) ||
        (c.patientId?.toLowerCase().includes(query)) ||
        (c.diagnosis?.toLowerCase().includes(query))
      );
    }
    
    return filtered.sort((a, b) => b.createdAt - a.createdAt); // Latest first
  }, [consultations, filterPeriod, searchQuery]);

  const handleViewPrescription = (patientId: string, patientName: string) => {
    toast.info(`Viewing prescription for ${patientName}`);
    // Could navigate to prescription view
  };

  const handleReopen = (consultation: any) => {
    toast.success(`Reopening consultation for ${consultation.patientName || consultation.patientId}`);
    navigate("/consultation", { state: { patient: { id: consultation.patientId } } });
  };

  const handleDownload = (patientName: string) => {
    toast.success(`Downloading prescription for ${patientName}`);
  };

  const handleExportCsv = () => toast.success("Exporting CSV");
  const handleExportXls = () => toast.success("Exporting Excel");
  const handleExportPdf = () => toast.success("Exporting PDF");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Completed Consultations</h2>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-IN", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgTime} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.prescriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lab Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.labTests}</div>
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
            <div className="flex gap-2">
              <Select value={filterPeriod} onValueChange={(value) => {
                console.log("[CompletedConsultations] Filter period changed:", value);
                setFilterPeriod(value);
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="absolute right-0 mt-2 w-36 rounded-md border bg-popover shadow-sm p-1 text-sm">
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent" onClick={handleExportCsv}>CSV</button>
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent" onClick={handleExportXls}>Excel</button>
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent" onClick={handleExportPdf}>PDF</button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading consultations...</span>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No completed consultations found
            </div>
          ) : (
            filteredConsultations.map((consultation) => {
              const consultationDate = new Date(consultation.createdAt);
              const timeStr = consultationDate.toLocaleTimeString("en-IN", { 
                hour: "2-digit", 
                minute: "2-digit" 
              });
              
              return (
            <Card key={consultation.id} className="border border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                              {consultation.patientName || consultation.patientId || "Unknown Patient"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                              {consultation.patientId} • {consultation.visitId}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                            ✓ Completed at {timeStr}
                      </Badge>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Diagnosis:</span>
                            <span className="ml-2 font-medium text-foreground">
                              {consultation.diagnosis || "N/A"}
                            </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Follow-up:</span>
                            <span className="ml-2 font-medium text-foreground">
                              {consultation.followUpDate 
                                ? new Date(consultation.followUpDate).toLocaleDateString("en-IN")
                                : "N/A"}
                            </span>
                      </div>
                    </div>
                    
                        {consultation.medicines && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Medicines:</span>
                      <span className="ml-2 text-foreground">{consultation.medicines}</span>
                    </div>
                        )}
                  </div>

                  <div className="flex flex-col gap-2 sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                          onClick={() => handleViewPrescription(consultation.patientId, consultation.patientName || "")}
                    >
                      View Prescription
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1"
                            onClick={() => handleReopen(consultation)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reopen
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                            onClick={() => handleDownload(consultation.patientName || consultation.patientId)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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
