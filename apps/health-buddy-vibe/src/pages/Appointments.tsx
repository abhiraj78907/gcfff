import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  reason: string;
  status: "upcoming" | "completed" | "cancelled";
}

const Appointments = () => {
  const appointments: Appointment[] = [
    {
      id: "1",
      date: "2025-11-05",
      time: "10:00 AM",
      doctorName: "Dr. Sharma",
      specialty: "General Medicine",
      hospitalName: "VIMS Hospital",
      reason: "Follow-up consultation",
      status: "upcoming",
    },
    {
      id: "2",
      date: "2025-11-10",
      time: "2:30 PM",
      doctorName: "Dr. Patil",
      specialty: "Cardiology",
      hospitalName: "VIMS Hospital",
      reason: "Heart checkup",
      status: "upcoming",
    },
    {
      id: "3",
      date: "2025-10-28",
      time: "11:00 AM",
      doctorName: "Dr. Kumar",
      specialty: "ENT",
      hospitalName: "VIMS Hospital",
      reason: "Throat infection",
      status: "completed",
    },
  ];

  const upcomingAppointments = appointments.filter(a => a.status === "upcoming");
  const pastAppointments = appointments.filter(a => a.status === "completed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const appointmentDate = new Date(dateStr);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 0) return `In ${diffDays} days`;
    return "Past";
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="p-5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">
                {new Date(appointment.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{appointment.time}</span>
              {appointment.status === "upcoming" && (
                <Badge variant="outline" className="ml-2">
                  {getDaysUntil(appointment.date)}
                </Badge>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        <Separator />

        {/* Doctor Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">{appointment.doctorName}</p>
              <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{appointment.hospitalName}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">REASON FOR VISIT</p>
          <p className="text-sm text-foreground">{appointment.reason}</p>
        </div>

        {/* Action Buttons */}
        {appointment.status === "upcoming" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MapPin className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Reschedule
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground">Manage your doctor visits</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
            {upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Past Appointments</h2>
            {pastAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No appointments scheduled</p>
            <Button className="mt-4">Book Appointment</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
