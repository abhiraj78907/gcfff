import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, User } from "lucide-react";

const TodaysQueue = () => {
  const queue = [
    { token: 15, name: "Ramesh Kumar", id: "VIMS-2025-12345", doctor: "Dr. Sharma", ward: "General Medicine", status: "waiting", time: "10:15 AM" },
    { token: 16, name: "Sita Devi", id: "VIMS-2025-12346", doctor: "Dr. Patil", ward: "Cardiology", status: "in-consultation", time: "10:20 AM" },
    { token: 17, name: "Abdul Khan", id: "VIMS-2025-12347", doctor: "Dr. Sharma", ward: "General Medicine", status: "waiting", time: "10:25 AM" },
    { token: 18, name: "Priya Menon", id: "VIMS-2025-12348", doctor: "Dr. Rao", ward: "Pediatrics", status: "waiting", time: "10:30 AM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-consultation":
        return "bg-primary text-primary-foreground";
      case "waiting":
        return "bg-warning text-warning-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Today's Queue</h1>
            <p className="text-muted-foreground">Real-time patient queue status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search patient..." className="pl-9 w-64" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total in Queue</p>
            <p className="text-3xl font-bold text-primary">12</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">In Consultation</p>
            <p className="text-3xl font-bold text-info">3</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Average Wait Time</p>
            <p className="text-3xl font-bold text-warning">18 min</p>
          </Card>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-semibold">Token</th>
                  <th className="p-4 text-left font-semibold">Patient Details</th>
                  <th className="p-4 text-left font-semibold">Doctor</th>
                  <th className="p-4 text-left font-semibold">Ward</th>
                  <th className="p-4 text-left font-semibold">Time</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((patient, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-primary">{patient.token}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{patient.doctor}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{patient.ward}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {patient.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status === "in-consultation" ? "In Consultation" : "Waiting"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TodaysQueue;
