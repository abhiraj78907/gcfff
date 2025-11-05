import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Send } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CompletedTest {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  completedDate: string;
  validationStatus: "validated" | "pending";
  technician: string;
}

const completedTests: CompletedTest[] = [
  {
    id: "TR-005",
    patientName: "Vikram Joshi",
    patientId: "P-12349",
    testType: "Kidney Function Test",
    completedDate: "2025-11-01",
    validationStatus: "validated",
    technician: "Lab Tech 1",
  },
  {
    id: "TR-006",
    patientName: "Anjali Desai",
    patientId: "P-12350",
    testType: "Complete Blood Count",
    completedDate: "2025-11-01",
    validationStatus: "validated",
    technician: "Lab Tech 2",
  },
  {
    id: "TR-007",
    patientName: "Karthik Menon",
    patientId: "P-12351",
    testType: "Lipid Profile",
    completedDate: "2025-10-31",
    validationStatus: "pending",
    technician: "Lab Tech 1",
  },
  {
    id: "TR-008",
    patientName: "Neha Gupta",
    patientId: "P-12352",
    testType: "Liver Function Test",
    completedDate: "2025-10-31",
    validationStatus: "validated",
    technician: "Lab Tech 3",
  },
  {
    id: "TR-009",
    patientName: "Suresh Rao",
    patientId: "P-12353",
    testType: "Fasting Blood Sugar",
    completedDate: "2025-10-30",
    validationStatus: "validated",
    technician: "Lab Tech 2",
  },
];

export default function CompletedTests() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = completedTests.filter(
    (test) =>
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Completed Tests</h1>
        <p className="text-muted-foreground mt-1">Archive and review finalized blood test reports</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, ID, or test type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Batch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{test.patientName}</p>
                      <p className="text-xs text-muted-foreground">{test.patientId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>{test.completedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={test.validationStatus === "validated" ? "default" : "secondary"}
                      className={
                        test.validationStatus === "validated"
                          ? "bg-success text-success-foreground"
                          : ""
                      }
                    >
                      {test.validationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.technician}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


