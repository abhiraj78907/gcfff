import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, Upload as UploadIcon, Eye } from "lucide-react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";
import { useLabRequests } from "@/hooks/useLabRequests";
import { toast } from "@/components/ui/use-toast";
import type { LabRequestDoc } from "@/lib/firebaseTypes";

type TestStatus = "ordered" | "in_progress" | "completed" | "cancelled";

interface TestRequest {
  id: string;
  patientName?: string;
  patientId: string;
  testType: string;
  requestDate?: string;
  urgency?: "routine" | "urgent";
  doctor?: string;
  doctorId?: string;
  status: TestStatus;
}

// Map Firestore LabRequestDoc to TestRequest UI format
function mapLabRequestToTestRequest(doc: LabRequestDoc): TestRequest {
  return {
    id: doc.id,
    patientId: doc.patientId,
    testType: doc.testType,
    status: doc.status,
    doctorId: doc.doctorId,
    requestDate: doc.createdAt ? new Date(doc.createdAt).toISOString().split("T")[0] : undefined,
  };
}

function TestCard({ test, onStatusChange }: { test: TestRequest; onStatusChange: (id: string, status: TestStatus) => void }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: test.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-3 hover:shadow-md transition-shadow cursor-move">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base">{test.patientName || `Patient ${test.patientId}`}</CardTitle>
              <CardDescription className="text-xs">{test.patientId}</CardDescription>
            </div>
            {test.urgency && (
              <Badge variant={test.urgency === "urgent" ? "destructive" : "secondary"}>
                {test.urgency}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Test Type:</p>
            <Badge variant="outline" className="text-xs">
              {test.testType}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {test.doctor && <span>Dr. {test.doctor}</span>}
            <span>{test.requestDate || "N/A"}</span>
          </div>
          <div className="flex gap-2 pt-2">
            {test.status === "ordered" && (
              <Button size="sm" className="flex-1" onClick={() => onStatusChange(test.id, "in_progress")}>
                <Play className="h-3 w-3 mr-1" />
                Start Test
              </Button>
            )}
            {test.status === "in_progress" && (
              <Button size="sm" className="flex-1" onClick={() => navigate("/lab/upload")}>
                <UploadIcon className="h-3 w-3 mr-1" />
                Upload Results
              </Button>
            )}
            {test.status === "completed" && (
              <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate("/lab/completed")}>
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
  const { requests, loading, updateStatus } = useLabRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const tests = useMemo(() => requests.map(mapLabRequestToTestRequest), [requests]);

  const filteredTests = tests.filter(
    (test) =>
      (test.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      test.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (testId: string, newStatus: TestStatus) => {
    try {
      await updateStatus(testId, newStatus);
      toast({
        title: "Status updated",
        description: `Test request moved to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTest = tests.find((t) => t.id === active.id);
    if (!activeTest) return;

    const newStatus = over.id as TestStatus;
    if (activeTest.status !== newStatus) {
      await handleStatusChange(activeTest.id, newStatus);
    }
  };

  const getTestsByStatus = (status: TestStatus) => {
    const statusMap: Record<string, TestStatus> = {
      new: "ordered",
      inProgress: "in_progress",
      completed: "completed",
    };
    const mappedStatus = statusMap[status] ?? status;
    return filteredTests.filter((test) => test.status === mappedStatus);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Test Requests Kanban Board</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-xs text-muted-foreground">{getTestsByStatus("ordered").length} tests</p>
            </div>
            <SortableContext items={getTestsByStatus("ordered").map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {getTestsByStatus("ordered").map((test) => (
                <TestCard key={test.id} test={test} onStatusChange={handleStatusChange} />
              ))}
            </SortableContext>
          </div>

          <div>
            <div className="mb-4 px-4 py-2 bg-warning/20 rounded-lg">
              <h2 className="font-semibold text-foreground">In Progress</h2>
              <p className="text-xs text-muted-foreground">{getTestsByStatus("in_progress").length} tests</p>
            </div>
            <SortableContext items={getTestsByStatus("in_progress").map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {getTestsByStatus("in_progress").map((test) => (
                <TestCard key={test.id} test={test} onStatusChange={handleStatusChange} />
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
                <TestCard key={test.id} test={test} onStatusChange={handleStatusChange} />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}


