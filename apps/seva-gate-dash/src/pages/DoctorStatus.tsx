import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const departmentLoad = [
  { department: "General", load: 15 },
  { department: "Cardiology", load: 8 },
  { department: "Pediatrics", load: 6 },
  { department: "Orthopedics", load: 5 },
];

const doctors = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "General Medicine",
    status: "available",
    queueSize: 3,
    avgTime: "12 mins",
    nextAvailable: "Now",
    room: "203",
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    specialty: "Cardiology",
    status: "busy",
    queueSize: 5,
    avgTime: "18 mins",
    nextAvailable: "15 mins",
    room: "301",
  },
  {
    id: 3,
    name: "Dr. Amit Reddy",
    specialty: "Pediatrics",
    status: "break",
    queueSize: 2,
    avgTime: "10 mins",
    nextAvailable: "10 mins",
    room: "105",
  },
  {
    id: 4,
    name: "Dr. Sunita Kumar",
    specialty: "Orthopedics",
    status: "available",
    queueSize: 1,
    avgTime: "15 mins",
    nextAvailable: "Now",
    room: "402",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return <Badge className="bg-success">Available</Badge>;
    case "busy":
      return <Badge className="bg-warning">Busy</Badge>;
    case "break":
      return <Badge className="bg-muted">On Break</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const DoctorStatus = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Doctor Status</h2>
        <p className="text-muted-foreground">Real-time availability and workload monitoring</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Patient Load</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={departmentLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="load" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground">Room: {doctor.room}</p>
                  </div>
                  {getStatusBadge(doctor.status)}
                </div>

                <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Queue</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{doctor.queueSize}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Avg Time</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{doctor.avgTime}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Next Available</p>
                    <p className="text-lg font-semibold text-foreground">{doctor.nextAvailable}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Assign Patient
                  </Button>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorStatus;
