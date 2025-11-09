import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, Upload as UploadIcon, Eye } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";

type TestStatus = "new" | "inProgress" | "completed";

interface TestRequest {
  id: string;
  patientName: string;
  patientId: string;
  tests: string[];
  requestDate: string;
  urgency: "routine" | "urgent";
  doctor: string;
  status: TestStatus;
}

const initialTests: TestRequest[] = [
  {
    id: "TR-001",
    patientName: "Rajesh Kumar",
    patientId: "P-12345",
    tests: ["Complete Blood Count", "ESR"],
    requestDate: "2025-11-03",
    urgency: "urgent",
    doctor: "Dr. Sharma",
    status: "new",
  },
  {
    id: "TR-002",
    patientName: "Priya Patel",
    patientId: "P-12346",
    tests: ["Fasting Blood Sugar", "HbA1c"],
    requestDate: "2025-11-03",
    urgency: "routine",
    doctor: "Dr. Mehta",
    status: "new",
  },
  {
    id: "TR-003",
    patientName: "Amit Singh",
    patientId: "P-12347",
    tests: ["Lipid Profile"],
    requestDate: "2025-11-02",
    urgency: "urgent",
    doctor: "Dr. Verma",
    status: "inProgress",
  },
  {
    id: "TR-004",
    patientName: "Sneha Reddy",
    patientId: "P-12348",
    tests: ["Liver Function Test"],
    requestDate: "2025-11-02",
    urgency: "routine",
    doctor: "Dr. Rao",
    status: "inProgress",
  },
  {
    id: "TR-005",
    patientName: "Vikram Joshi",
    patientId: "P-12349",
    tests: ["Kidney Function Test"],
    requestDate: "2025-11-01",
    urgency: "routine",
    doctor: "Dr. Khan",
    status: "completed",
  },
];

function TestCard({ test }: { test: TestRequest }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: test.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-3 hover:shadow-md transition-shadow cursor-move">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">{test.patientName}</CardTitle>
              <CardDescription className="text-xs">{test.patientId}</CardDescription>
            </div>
            <Badge variant={test.urgency === "urgent" ? "destructive" : "secondary"}>
              {test.urgency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Tests Ordered:</p>
            <div className="flex flex-wrap gap-1">
              {test.tests.map((t, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Dr. {test.doctor}</span>
            <span>{test.requestDate}</span>
          </div>
          <div className="flex gap-2 pt-2">
            {test.status === "new" && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  const updatedTests = tests.map(t => 
                    t.id === test.id ? { ...t, status: "inProgress" as TestStatus } : t
                  );
                  setTests(updatedTests);
                }}
              >
                <Play className="h-3 w-3 mr-1" />
                Start Test
              </Button>
            )}
            {test.status === "inProgress" && (
              <Button size="sm" className="flex-1" onClick={() => navigate("/upload")}>
                <UploadIcon className="h-3 w-3 mr-1" />
                Upload Results
              </Button>
            )}
            {test.status === "completed" && (
              <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/completed")}>
                <Eye className="h-3 w-3 mr-1" />
                View Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TestRequests() {
  const [tests, setTests] = useState<TestRequest[]>(initialTests);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = tests.filter(
    (test) =>
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.tests.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTest = tests.find((t) => t.id === active.id);
    if (!activeTest) return;

    // Simple status update based on column
    const newStatus = over.id as TestStatus;
    if (activeTest.status !== newStatus) {
      setTests(tests.map((t) => (t.id === activeTest.id ? { ...t, status: newStatus } : t)));
    }
  };

  const getTestsByStatus = (status: TestStatus) =>
    filteredTests.filter((test) => test.status === status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Test Requests Kanban Board</h1>
        <p className="text-muted-foreground mt-1">Track and manage test progress</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient name, ID, or test type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="mb-4 px-4 py-2 bg-secondary rounded-lg">
              <h2 className="font-semibold text-foreground">New Requests</h2>
              <p className="text-xs text-muted-foreground">{getTestsByStatus("new").length} tests</p>
            </div>
            <SortableContext items={getTestsByStatus("new").map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {getTestsByStatus("new").map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </SortableContext>
          </div>

          <div>
            <div className="mb-4 px-4 py-2 bg-warning/20 rounded-lg">
              <h2 className="font-semibold text-foreground">In Progress</h2>
              <p className="text-xs text-muted-foreground">{getTestsByStatus("inProgress").length} tests</p>
            </div>
            <SortableContext items={getTestsByStatus("inProgress").map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {getTestsByStatus("inProgress").map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </SortableContext>
          </div>

          <div>
            <div className="mb-4 px-4 py-2 bg-success/20 rounded-lg">
              <h2 className="font-semibold text-foreground">Completed</h2>
              <p className="text-xs text-muted-foreground">{getTestsByStatus("completed").length} tests</p>
            </div>
            <SortableContext items={getTestsByStatus("completed").map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {getTestsByStatus("completed").map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
