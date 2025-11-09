import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, User, Calendar, Filter, Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TodaysQueue = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const queue = [
    // Internal Medicine patients (General Medicine) - Increased count
    { token: 5, name: "Rajesh Kumar", id: "VIMS-2025-12335", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "08:30 AM" },
    { token: 6, name: "Sunita Devi", id: "VIMS-2025-12336", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "08:45 AM" },
    { token: 7, name: "Mohan Das", id: "VIMS-2025-12337", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "09:00 AM" },
    { token: 8, name: "Anjali Reddy", id: "VIMS-2025-12338", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "09:15 AM" },
    { token: 9, name: "Vikram Patel", id: "VIMS-2025-12339", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "09:20 AM" },
    { token: 10, name: "Ramesh Kumar", id: "VIMS-2025-12340", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "09:30 AM" },
    { token: 11, name: "Lakshmi Reddy", id: "VIMS-2025-12341", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "09:45 AM" },
    { token: 12, name: "Vikram Singh", id: "VIMS-2025-12342", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "10:00 AM" },
    { token: 13, name: "Priya Sharma", id: "VIMS-2025-12343", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "10:05 AM" },
    { token: 14, name: "Amit Kumar", id: "VIMS-2025-12344", doctor: "Dr. Sharma", department: "Internal Medicine", status: "completed", time: "10:10 AM" },
    { token: 15, name: "Ramesh Kumar", id: "VIMS-2025-12345", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:15 AM" },
    { token: 16, name: "Sita Patel", id: "VIMS-2025-12346", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:20 AM" },
    { token: 17, name: "Abdul Khan", id: "VIMS-2025-12347", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:25 AM" },
    { token: 18, name: "Meera Nair", id: "VIMS-2025-12348", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:30 AM" },
    { token: 19, name: "Kiran Reddy", id: "VIMS-2025-12349", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:35 AM" },
    { token: 20, name: "Ravi Kumar", id: "VIMS-2025-12350", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:40 AM" },
    { token: 21, name: "Meera Patel", id: "VIMS-2025-12351", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:45 AM" },
    { token: 22, name: "Suresh Nair", id: "VIMS-2025-12352", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "10:50 AM" },
    { token: 23, name: "Kavita Desai", id: "VIMS-2025-12353", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "11:00 AM" },
    { token: 24, name: "Deepak Singh", id: "VIMS-2025-12354", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "11:10 AM" },
    { token: 25, name: "Anita Reddy", id: "VIMS-2025-12355", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "11:20 AM" },
    { token: 26, name: "Prakash Kumar", id: "VIMS-2025-12356", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "11:30 AM" },
    { token: 27, name: "Shanti Devi", id: "VIMS-2025-12357", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "11:40 AM" },
    { token: 28, name: "Naveen Patel", id: "VIMS-2025-12358", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "11:50 AM" },
    { token: 29, name: "Geeta Sharma", id: "VIMS-2025-12359", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "12:00 PM" },
    { token: 30, name: "Manoj Kumar", id: "VIMS-2025-12360", doctor: "Dr. Sharma", department: "Internal Medicine", status: "waiting", time: "12:10 PM" },
    
    // Cardiology patients
    { token: 31, name: "Sita Devi", id: "VIMS-2025-12361", doctor: "Dr. Patil", department: "Cardiology", status: "in-consultation", time: "10:20 AM" },
    { token: 32, name: "Anita Singh", id: "VIMS-2025-12362", doctor: "Dr. Patil", department: "Cardiology", status: "waiting", time: "10:35 AM" },
    { token: 33, name: "Rajesh Iyer", id: "VIMS-2025-12363", doctor: "Dr. Patil", department: "Cardiology", status: "waiting", time: "11:10 AM" },
    { token: 34, name: "Priya Nair", id: "VIMS-2025-12364", doctor: "Dr. Patil", department: "Cardiology", status: "waiting", time: "11:20 AM" },
    
    // Pediatrics patients
    { token: 35, name: "Priya Menon", id: "VIMS-2025-12365", doctor: "Dr. Rao", department: "Pediatrics", status: "waiting", time: "10:30 AM" },
    { token: 36, name: "Arjun Menon", id: "VIMS-2025-12366", doctor: "Dr. Rao", department: "Pediatrics", status: "waiting", time: "11:30 AM" },
    { token: 37, name: "Ananya Kumar", id: "VIMS-2025-12367", doctor: "Dr. Rao", department: "Pediatrics", status: "waiting", time: "11:40 AM" },
    
    // Orthopedics patients
    { token: 38, name: "Rajesh Kumar", id: "VIMS-2025-12368", doctor: "Dr. Kumar", department: "Orthopedics", status: "completed", time: "10:00 AM" },
    { token: 39, name: "Mohan Das", id: "VIMS-2025-12369", doctor: "Dr. Kumar", department: "Orthopedics", status: "waiting", time: "11:50 AM" },
    { token: 40, name: "Sunita Reddy", id: "VIMS-2025-12370", doctor: "Dr. Kumar", department: "Orthopedics", status: "waiting", time: "12:00 PM" },
    
    // Dermatology patients
    { token: 41, name: "Ravi Shankar", id: "VIMS-2025-12371", doctor: "Dr. Mehta", department: "Dermatology", status: "waiting", time: "12:10 PM" },
    { token: 42, name: "Deepa Joshi", id: "VIMS-2025-12372", doctor: "Dr. Mehta", department: "Dermatology", status: "waiting", time: "12:20 PM" },
    
    // ENT patients
    { token: 43, name: "Kiran Malhotra", id: "VIMS-2025-12373", doctor: "Dr. Gupta", department: "ENT", status: "waiting", time: "12:30 PM" },
    { token: 44, name: "Rohit Verma", id: "VIMS-2025-12374", doctor: "Dr. Gupta", department: "ENT", status: "waiting", time: "12:40 PM" },
  ];

  const filteredQueue = queue.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || patient.status === selectedFilter;
    const matchesDepartment = selectedDepartment === "all" || patient.department === selectedDepartment;
    
    return matchesSearch && matchesFilter && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(queue.map(p => p.department))).sort();

  // Log to verify component is loading with updated data
  console.log("TodaysQueue loaded:", {
    totalPatients: queue.length,
    internalMedicine: queue.filter(p => p.department === "Internal Medicine").length,
    departments: departments.length
  });

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

  // Chart data - dynamically calculated from queue
  const departmentCounts = queue.reduce((acc, patient) => {
    acc[patient.department] = (acc[patient.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentCounts).map(([name, patients]) => ({
    name,
    patients,
  })).sort((a, b) => b.patients - a.patients);

  // Status data - dynamically calculated from queue
  const statusCounts = queue.reduce((acc, patient) => {
    const statusKey = patient.status === "in-consultation" ? "In Consultation" 
      : patient.status === "waiting" ? "Waiting" 
      : "Completed";
    acc[statusKey] = (acc[statusKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = [
    { name: "Waiting", value: statusCounts["Waiting"] || 0, color: "#f59e0b" },
    { name: "In Consultation", value: statusCounts["In Consultation"] || 0, color: "#3b82f6" },
    { name: "Completed", value: statusCounts["Completed"] || 0, color: "#10b981" },
  ].filter(item => item.value > 0);

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  const totalInQueue = queue.filter((p) => p.status === "waiting" || p.status === "in-consultation").length;
  const inConsultation = queue.filter((p) => p.status === "in-consultation").length;
  const completed = queue.filter((p) => p.status === "completed").length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Today's Queue</h1>
            <p className="text-muted-foreground">Real-time patient queue status</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const currentPath = window.location.pathname;
                const basePath = currentPath.includes("/dashboard/receptionist") 
                  ? "/dashboard/receptionist" 
                  : "/receptionist";
                navigate(`${basePath}/appointments`);
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Export queue data to CSV
                const csvContent = [
                  ["Token", "Patient Name", "Patient ID", "Doctor", "Department", "Status", "Time"],
                  ...queue.map(p => [
                    p.token.toString(),
                    p.name,
                    p.id,
                    p.doctor,
                    p.department,
                    p.status === "in-consultation" ? "In Consultation" : p.status === "waiting" ? "Waiting" : "Completed",
                    p.time
                  ])
                ].map(row => row.join(",")).join("\n");
                
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `queue-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total in Queue</p>
            <p className="text-3xl font-bold text-primary">{totalInQueue}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">In Consultation</p>
            <p className="text-3xl font-bold text-info">{inConsultation}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
            <p className="text-3xl font-bold text-success">{completed}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Average Wait Time</p>
            <p className="text-3xl font-bold text-warning">18 min</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Patients by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Queue Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by token, patient name, ID, doctor, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="in-consultation">In Consultation</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Internal Medicine Section */}
        {selectedDepartment === "all" || selectedDepartment === "Internal Medicine" ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Internal Medicine (General Medicine)</h2>
                <p className="text-muted-foreground">
                  {queue.filter(p => p.department === "Internal Medicine").length} patients total
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {queue.filter(p => p.department === "Internal Medicine" && (p.status === "waiting" || p.status === "in-consultation")).length} in queue
              </Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Card className="p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
                <p className="text-2xl font-bold text-primary">
                  {queue.filter(p => p.department === "Internal Medicine" && p.status === "completed").length}
                </p>
              </Card>
              <Card className="p-4 bg-warning/5">
                <p className="text-sm text-muted-foreground mb-1">Waiting</p>
                <p className="text-2xl font-bold text-warning">
                  {queue.filter(p => p.department === "Internal Medicine" && p.status === "waiting").length}
                </p>
              </Card>
              <Card className="p-4 bg-info/5">
                <p className="text-sm text-muted-foreground mb-1">In Consultation</p>
                <p className="text-2xl font-bold text-info">
                  {queue.filter(p => p.department === "Internal Medicine" && p.status === "in-consultation").length}
                </p>
              </Card>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-sm">Token</th>
                    <th className="p-3 text-left font-semibold text-sm">Patient Name</th>
                    <th className="p-3 text-left font-semibold text-sm">Patient ID</th>
                    <th className="p-3 text-left font-semibold text-sm">Time</th>
                    <th className="p-3 text-left font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue
                    .filter(p => p.department === "Internal Medicine")
                    .slice(0, 10)
                    .map((patient, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                        <td className="p-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-primary text-sm">{patient.token}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-sm">{patient.name}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm text-muted-foreground">{patient.id}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {patient.time}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status === "in-consultation"
                              ? "In Consultation"
                              : patient.status === "waiting"
                              ? "Waiting"
                              : "Completed"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {queue.filter(p => p.department === "Internal Medicine").length > 10 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDepartment("Internal Medicine")}
                >
                  View All {queue.filter(p => p.department === "Internal Medicine").length} Internal Medicine Patients
                </Button>
              </div>
            )}
          </Card>
        ) : null}

        {/* Queue Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-semibold">Token</th>
                  <th className="p-4 text-left font-semibold">Patient Details</th>
                  <th className="p-4 text-left font-semibold">Doctor</th>
                  <th className="p-4 text-left font-semibold">Department</th>
                  <th className="p-4 text-left font-semibold">Time</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No patients found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((patient, index) => (
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
                        <Badge variant="secondary">{patient.department}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {patient.time}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status === "in-consultation"
                            ? "In Consultation"
                            : patient.status === "waiting"
                            ? "Waiting"
                            : "Completed"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Navigate to patient details
                            console.log("View patient:", patient.id);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TodaysQueue;
