import { Card, CardContent, CardHeader, CardTitle } from "@seva/components/ui/card";
import { Badge } from "@seva/components/ui/badge";
import { Button } from "@seva/components/ui/button";
import { Input } from "@seva/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@seva/components/ui/select";
import { Clock, Search, User, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { useSubEntry } from "../../../../src/contexts/SubEntryContext";
import { mockVisits } from "../../../../src/lib/mocks/queue";
import { mockPatients } from "../../../../src/lib/mocks/patients";
import { filterBySubEntry } from "../../../../src/lib/api-utils";

// Departments mocked for visualization
const departments = ["General Medicine", "Cardiology", "Pediatrics", "Orthopedics"] as const;

const getWaitTimeBadge = (minutes: number) => {
  if (minutes < 10) return "success";
  if (minutes < 30) return "warning";
  return "danger";
};

const Queue = () => {
  const { currentSubEntry } = useSubEntry();

  const scopedVisits = useMemo(() => {
    return currentSubEntry ? filterBySubEntry(mockVisits, currentSubEntry.id) : [];
  }, [currentSubEntry]);

  const scopedPatients = useMemo(() => {
    return currentSubEntry ? mockPatients.filter(p => p.subEntryId === currentSubEntry.id) : [];
  }, [currentSubEntry]);

  // Combine patients and visits for queue cards
  const queueCards = useMemo(() => {
    return scopedVisits.map(v => {
      const patient = scopedPatients.find(p => p.id === v.patientId);
      return {
        token: v.token,
        name: patient?.name || "Patient",
        age: patient?.age || 0,
        gender: (patient?.gender || "").toString().toUpperCase().slice(0,1),
        department: "General Medicine",
        doctor: "Dr. Sharma",
        waitTime: 10,
        symptoms: patient?.symptoms || "",
      };
    });
  }, [scopedVisits, scopedPatients]);

  const queueData = useMemo(() => {
    return departments.map(dep => ({
      department: dep.replace(" Medicine", ""),
      count: queueCards.filter(q => q.department === dep).length,
    }));
  }, [queueCards]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Today's Queue</h2>
        <p className="text-muted-foreground">Manage active patients waiting for consultation</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by token or patient name..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="general">General Medicine</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Load by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={queueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">General Medicine</h3>
        {queueCards
          .filter((p) => p.department === "General Medicine")
          .map((patient) => (
            <Card key={patient.token}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-lg font-bold text-primary">{patient.token}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{patient.name}</h4>
                        <Badge variant="outline">
                          {patient.age}Y / {patient.gender}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Symptoms:</span> {patient.symptoms}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Assigned to:</span> {patient.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Waiting:</span>
                      <Badge variant={getWaitTimeBadge(patient.waitTime) as any}>
                        {patient.waitTime} mins
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <User className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="mr-1 h-3 w-3" />
                        Call Patient
                      </Button>
                      <Button size="sm">Transfer</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {queueCards.filter((p) => p.department === "Cardiology").length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Cardiology</h3>
          {queueCards
            .filter((p) => p.department === "Cardiology")
            .map((patient) => (
              <Card key={patient.token}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <span className="text-lg font-bold text-primary">{patient.token}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{patient.name}</h4>
                          <Badge variant="outline">
                            {patient.age}Y / {patient.gender}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Symptoms:</span> {patient.symptoms}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Assigned to:</span> {patient.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Waiting:</span>
                        <Badge variant={getWaitTimeBadge(patient.waitTime) as any}>
                          {patient.waitTime} mins
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <User className="mr-1 h-3 w-3" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="mr-1 h-3 w-3" />
                          Call Patient
                        </Button>
                        <Button size="sm">Transfer</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default Queue;
