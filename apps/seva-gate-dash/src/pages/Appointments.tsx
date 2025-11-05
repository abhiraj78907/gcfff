import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Search, Calendar as CalendarIcon, Clock, User, Phone, Edit, X, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data
const weeklyAppointmentData = [
  { day: "Mon", appointments: 25, noShows: 2 },
  { day: "Tue", appointments: 28, noShows: 1 },
  { day: "Wed", appointments: 32, noShows: 3 },
  { day: "Thu", appointments: 30, noShows: 2 },
  { day: "Fri", appointments: 27, noShows: 1 },
  { day: "Sat", appointments: 15, noShows: 0 },
  { day: "Sun", appointments: 8, noShows: 0 },
];

const upcomingAppointments = [
  {
    id: 1,
    time: "10:00 AM",
    date: "Nov 4, 2025",
    patient: "Rajesh Kumar",
    age: 45,
    phone: "+91 98765 43210",
    doctor: "Dr. Sharma",
    department: "General Medicine",
    type: "Follow-up",
    status: "confirmed",
  },
  {
    id: 2,
    time: "11:00 AM",
    date: "Nov 4, 2025",
    patient: "Priya Singh",
    age: 32,
    phone: "+91 98765 43211",
    doctor: "Dr. Patel",
    department: "Cardiology",
    type: "New",
    status: "confirmed",
  },
  {
    id: 3,
    time: "02:00 PM",
    date: "Nov 4, 2025",
    patient: "Amit Verma",
    age: 58,
    phone: "+91 98765 43212",
    doctor: "Dr. Reddy",
    department: "Orthopedics",
    type: "Follow-up",
    status: "pending",
  },
  {
    id: 4,
    time: "03:30 PM",
    date: "Nov 5, 2025",
    patient: "Sunita Devi",
    age: 41,
    phone: "+91 98765 43213",
    doctor: "Dr. Kumar",
    department: "Pediatrics",
    type: "New",
    status: "confirmed",
  },
];

const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-success">Confirmed</Badge>;
    case "pending":
      return <Badge className="bg-warning">Pending</Badge>;
    case "cancelled":
      return <Badge className="bg-danger">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Appointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState("week");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredAppointments = upcomingAppointments.filter(
    (apt) =>
      apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Appointment Management</h2>
          <p className="text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full md:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Book New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>Fill in the details to schedule a new appointment</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient Name</Label>
                  <Input id="patient" placeholder="Search or enter patient name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Medicine</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sharma">Dr. Sharma</SelectItem>
                      <SelectItem value="patel">Dr. Patel</SelectItem>
                      <SelectItem value="reddy">Dr. Reddy</SelectItem>
                      <SelectItem value="kumar">Dr. Kumar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input id="date" type="date" min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time Slot</Label>
                  <Select>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Appointment Type</Label>
                <RadioGroup defaultValue="new">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className="font-normal">
                      New Consultation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="followup" id="followup" />
                    <Label htmlFor="followup" className="font-normal">
                      Follow-up Visit
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea id="notes" placeholder="Enter any special requirements or notes..." rows={3} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsBookingModalOpen(false)}>Confirm Booking</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyAppointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line type="monotone" dataKey="appointments" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No-Show Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyAppointmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="noShows" fill="hsl(var(--danger))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and List View */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Appointment Schedule</CardTitle>
            <Tabs value={selectedView} onValueChange={setSelectedView}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Calendar Grid - Week View */}
          {selectedView === "week" && (
            <div className="mb-6 hidden overflow-x-auto lg:block">
              <div className="grid min-w-[800px] grid-cols-8 gap-2">
                {/* Header */}
                <div className="p-2 text-sm font-medium text-muted-foreground">Time</div>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="rounded-t-lg bg-primary/10 p-2 text-center text-sm font-medium text-primary">
                    {day}
                  </div>
                ))}

                {/* Time Slots */}
                {timeSlots.map((slot) => (
                  <>
                    <div key={slot} className="border-r border-border p-2 text-sm text-muted-foreground">
                      {slot}
                    </div>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={`${slot}-${day}`}
                        className="min-h-[60px] rounded border border-dashed border-border bg-muted/20 p-2 hover:bg-muted/50"
                      >
                        {/* Appointments would appear here based on time/day */}
                        {slot === "10:00 AM" && day === 1 && (
                          <div className="rounded bg-success/90 p-2 text-xs text-success-foreground">
                            <p className="font-medium">Rajesh Kumar</p>
                            <p className="text-[10px]">Dr. Sharma</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          )}

          {/* Appointment List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Appointments</h3>
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-start md:gap-6">
                      {/* Time & Date */}
                      <div className="flex items-center gap-3 md:w-40">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{appointment.date}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{appointment.patient}</h4>
                          <Badge variant="outline">{appointment.age}Y</Badge>
                          <Badge variant="secondary">{appointment.type}</Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:flex-row md:gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {appointment.doctor} - {appointment.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appointment.phone}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center md:w-32">{getStatusBadge(appointment.status)}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="mr-1 h-3 w-3" />
                        Reminder
                      </Button>
                      <Button size="sm" variant="outline" className="text-danger hover:bg-danger-light">
                        <X className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
