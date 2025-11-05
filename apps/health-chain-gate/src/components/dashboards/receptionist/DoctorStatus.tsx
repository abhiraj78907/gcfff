import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";

const DoctorStatus = () => {
  const doctors = [
    { name: "Dr. Sharma", dept: "General Medicine", status: "available", queue: 3, avgTime: "12 min" },
    { name: "Dr. Patil", dept: "Cardiology", status: "busy", queue: 5, avgTime: "18 min" },
    { name: "Dr. Rao", dept: "Pediatrics", status: "available", queue: 2, avgTime: "10 min" },
    { name: "Dr. Kumar", dept: "Orthopedics", status: "break", queue: 0, avgTime: "-" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success text-success-foreground";
      case "busy":
        return "bg-warning text-warning-foreground";
      case "break":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Doctor Status</h1>
        <p className="text-muted-foreground mb-6">Real-time availability and queue information</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {doctors.map((doctor, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.dept}</p>
                </div>
                <Badge className={getStatusColor(doctor.status)}>
                  {doctor.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Queue</span>
                  </div>
                  <p className="text-2xl font-bold">{doctor.queue}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Avg Time</span>
                  </div>
                  <p className="text-2xl font-bold">{doctor.avgTime}</p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">View Details</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorStatus;
