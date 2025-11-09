import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Search, Plus, Clock, User, Stethoscope, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Appointments = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    phone: "",
    doctor: "",
    department: "",
    date: "",
    time: "",
    reason: "",
  });

  const appointments = [
    {
      id: "APT-001",
      patientName: "Ramesh Kumar",
      patientId: "VIMS-2025-12345",
      phone: "+91 9876543210",
      doctor: "Dr. Sharma",
      department: "General Medicine",
      date: "2025-01-15",
      time: "10:00 AM",
      status: "confirmed",
      reason: "Follow-up consultation",
    },
    {
      id: "APT-002",
      patientName: "Sita Devi",
      patientId: "VIMS-2025-12344",
      phone: "+91 9876543211",
      doctor: "Dr. Patil",
      department: "Cardiology",
      date: "2025-01-15",
      time: "11:30 AM",
      status: "pending",
      reason: "Regular checkup",
    },
    {
      id: "APT-003",
      patientName: "Abdul Khan",
      patientId: "VIMS-2025-12343",
      phone: "+91 9876543212",
      doctor: "Dr. Rao",
      department: "Pediatrics",
      date: "2025-01-16",
      time: "02:00 PM",
      status: "confirmed",
      reason: "Child vaccination",
    },
    {
      id: "APT-004",
      patientName: "Priya Menon",
      patientId: "VIMS-2025-12348",
      phone: "+91 9876543213",
      doctor: "Dr. Kumar",
      department: "Orthopedics",
      date: "2025-01-16",
      time: "03:30 PM",
      status: "cancelled",
      reason: "Knee pain consultation",
    },
  ];

  const doctors = [
    { name: "Dr. Sharma", department: "General Medicine" },
    { name: "Dr. Patil", department: "Cardiology" },
    { name: "Dr. Rao", department: "Pediatrics" },
    { name: "Dr. Kumar", department: "Orthopedics" },
  ];

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted";
    }
  };

  const handleCreateAppointment = () => {
    if (!formData.patientName || !formData.doctor || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success!",
      description: "Appointment created successfully",
    });
    setIsDialogOpen(false);
    setFormData({
      patientName: "",
      patientId: "",
      phone: "",
      doctor: "",
      department: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  const handleCancelAppointment = (id: string) => {
    toast({
      title: "Appointment Cancelled",
      description: `Appointment ${id} has been cancelled`,
    });
  };

  const handleConfirmAppointment = (id: string) => {
    toast({
      title: "Appointment Confirmed",
      description: `Appointment ${id} has been confirmed`,
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Schedule and manage patient appointments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogDescription>Fill in the details to schedule a new appointment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      placeholder="VIMS-2025-XXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Doctor *</Label>
                    <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doc) => (
                          <SelectItem key={doc.name} value={doc.name}>
                            {doc.name} - {doc.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Auto-filled from doctor"
                      disabled
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Enter reason for appointment"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAppointment}>Create Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, ID, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Appointments Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Doctor:</span>
                        <span className="font-medium">{appointment.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{appointment.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                    </div>
                    {appointment.reason && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Reason: </span>
                          <span className="font-medium">{appointment.reason}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === "pending" && (
                      <Button size="sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    {appointment.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Appointment Details",
                          description: `${appointment.patientName} - ${appointment.doctor} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
