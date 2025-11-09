/**
 * Reports Page
 * Report generation, templates, scheduling, and export functionality
 */

import { useState, useMemo } from "react";
import { FileText, Download, Plus, Calendar, Loader2, Clock, CheckCircle, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Badge } from "@admin/components/ui/badge";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import { ActivityChart } from "@admin/components/dashboard/ActivityChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchReports, generateReport } from "../lib/adminApi";
import { useAdminEntities } from "../hooks/useAdminEntities";
import { useToast } from "../hooks/use-toast";
import type { Report } from "../lib/adminApi";

const reportTemplates = [
  { id: 1, name: "Monthly Patient Report", description: "Patient registration and consultation trends", category: "analytics" },
  { id: 2, name: "Revenue Summary", description: "Financial overview across all entities", category: "financial" },
  { id: 3, name: "Inventory Status", description: "Pharmacy stock levels and reorder alerts", category: "inventory" },
  { id: 4, name: "Doctor Performance", description: "Consultation metrics and patient feedback", category: "performance" },
];

const Reports = () => {
  const { toast } = useToast();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isEntityReportDialogOpen, setIsEntityReportDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof reportTemplates[0] | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [reportFormat, setReportFormat] = useState<"PDF" | "CSV" | "Excel">("PDF");
  
  // Fetch entities for entity-level reports
  const { data: entities = [] } = useAdminEntities();

  // Fetch reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: fetchReports,
  });

  const stats = {
    total: reports.length,
    thisMonth: reports.filter(r => {
      const reportDate = new Date(r.generatedAt);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length,
    scheduled: 8, // TODO: Fetch from API
    templates: reportTemplates.length,
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    try {
      await generateReport({
        name: selectedTemplate.name,
        type: selectedTemplate.category as any,
        format: reportFormat,
        parameters: {},
      });

      toast({
        title: "Report generated",
        description: `${selectedTemplate.name} has been generated successfully.`,
      });

      setIsGenerateDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error: any) {
      toast({
        title: "Error generating report",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (report: Report) => {
    try {
      // Create a mock file content based on report format
      let content = "";
      let mimeType = "";
      let extension = "";
      
      if (report.format === "PDF") {
        // For PDF, we'll create a text representation (in production, use a PDF library)
        content = `Report: ${report.name}\nGenerated: ${new Date(report.generatedAt).toLocaleString()}\nFormat: ${report.format}\nSize: ${report.size}\n\nThis is a mock PDF report. In production, this would contain actual report data.`;
        mimeType = "text/plain";
        extension = "txt";
      } else if (report.format === "CSV") {
        content = `Report Name,Generated At,Format,Size\n"${report.name}","${new Date(report.generatedAt).toISOString()}","${report.format}","${report.size}"`;
        mimeType = "text/csv";
        extension = "csv";
      } else if (report.format === "Excel") {
        // For Excel, create CSV format (in production, use Excel library)
        content = `Report Name,Generated At,Format,Size\n"${report.name}","${new Date(report.generatedAt).toISOString()}","${report.format}","${report.size}"`;
        mimeType = "text/csv";
        extension = "xlsx";
      }
      
      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report.name.replace(/[^a-z0-9]/gi, "_")}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: `Downloading ${report.name}...`,
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate report generation trends
  const reportTrends = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        count: Math.floor(Math.random() * 10) + 1, // Mock data
      };
    });
    return last6Months;
  }, []);

  const handleGenerateEntityReport = async () => {
    if (!selectedEntity || selectedEntity === "all") {
      toast({
        title: "Validation error",
        description: "Please select an entity",
        variant: "destructive",
      });
      return;
    }

    try {
      const entity = entities.find(e => e.id === selectedEntity);
      await generateReport({
        name: `${entity?.name} - Performance Report`,
        type: "performance",
        format: reportFormat,
        parameters: { entityId: selectedEntity },
      });

      toast({
        title: "Report generated",
        description: `Entity report has been generated successfully.`,
      });

      setIsEntityReportDialogOpen(false);
      setSelectedEntity("all");
    } catch (error: any) {
      toast({
        title: "Error generating report",
        description: error.message || "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">Generate and manage custom reports</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setIsGenerateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">{stats.thisMonth}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats.scheduled}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-info mb-2">{stats.templates}</p>
              <p className="text-sm text-muted-foreground">Templates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Pre-configured report templates for quick generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsGenerateDialogOpen(true);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsGenerateDialogOpen(true);
                  }}
                >
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Generation Trends
          </CardTitle>
          <CardDescription>Monthly report generation statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityChart
            title="Reports Generated"
            description="Number of reports generated per month"
            data={reportTrends}
            type="bar"
            dataKey="count"
            xAxisKey="month"
            height={250}
          />
        </CardContent>
      </Card>

      {/* Entity-Level Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Entity-Level Reports</CardTitle>
          <CardDescription>Generate detailed reports for specific entities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name} ({entity.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsEntityReportDialogOpen(true)} disabled={selectedEntity === "all"}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Entity Report
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive reports for individual hospitals, clinics, pharmacies, or laboratories with detailed analytics and performance metrics.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No reports generated yet</p>
            </div>
          ) : (
          <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-success/10">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                          {new Date(report.generatedAt).toLocaleDateString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">{report.format}</Badge>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                    </div>
                  </div>
                </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownload(report)}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Configure report parameters and format</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Input value={selectedTemplate.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={reportFormat} onValueChange={(value) => setReportFormat(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={!selectedTemplate}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entity Report Dialog */}
      <Dialog open={isEntityReportDialogOpen} onOpenChange={setIsEntityReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Entity Report</DialogTitle>
            <DialogDescription>Create a detailed report for the selected entity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Entity</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name} ({entity.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Format</Label>
              <Select value={reportFormat} onValueChange={(value) => setReportFormat(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEntityReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateEntityReport} disabled={!selectedEntity || selectedEntity === "all"}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
