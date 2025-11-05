import { FileText, Download, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Badge } from "@admin/components/ui/badge";

const reportTemplates = [
  { id: 1, name: "Monthly Patient Report", description: "Patient registration and consultation trends", category: "Analytics" },
  { id: 2, name: "Revenue Summary", description: "Financial overview across all entities", category: "Financial" },
  { id: 3, name: "Inventory Status", description: "Pharmacy stock levels and reorder alerts", category: "Inventory" },
  { id: 4, name: "Doctor Performance", description: "Consultation metrics and patient feedback", category: "Performance" },
];

const recentReports = [
  { id: 1, name: "Q2 2025 Summary", generated: "June 30, 2025", size: "2.4 MB", format: "PDF" },
  { id: 2, name: "May Operations", generated: "June 1, 2025", size: "1.8 MB", format: "PDF" },
  { id: 3, name: "Weekly Analytics", generated: "Today", size: "890 KB", format: "CSV" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">Generate and manage custom reports</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">48</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">12</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">8</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-info mb-2">24</p>
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
              <div key={template.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
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
                <Button variant="outline" size="sm" className="w-full">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-success/10">
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.generated}
                      </span>
                      <Badge variant="secondary" className="text-xs">{report.format}</Badge>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
