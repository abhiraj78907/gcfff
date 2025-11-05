import { Clock, Users, TestTube, TrendingUp, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@doctor/components/ui/card";
import { Button } from "@doctor/components/ui/button";
import { Badge } from "@doctor/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Completed Today", value: "12", icon: Users, trend: "+2 from yesterday" },
  { label: "In Queue", value: "5", icon: Clock, status: "warning" },
  { label: "Lab Tests Ordered", value: "3", icon: TestTube },
  { label: "Avg Time", value: "45 min", icon: TrendingUp, trend: "-5 min" },
];

const patientsInQueue = [
  {
    token: "13",
    name: "Ramesh Kumar",
    age: "45M",
    id: "VIMS-2025-12345",
    symptoms: "Fever since 2 days, headache, body pain",
    waiting: "25 minutes",
    registered: "9:45 AM",
    priority: "high",
  },
  {
    token: "14",
    name: "Sita Devi",
    age: "38F",
    id: "VIMS-2025-12344",
    symptoms: "Cough, cold",
    waiting: "15 minutes",
    registered: "10:00 AM",
    priority: "medium",
  },
  {
    token: "15",
    name: "Abdul Khan",
    age: "52M",
    id: "VIMS-2025-12346",
    symptoms: "Diabetes follow-up",
    waiting: "8 minutes",
    registered: "10:15 AM",
    priority: "low",
  },
];

const getPriorityColor = (waiting: string) => {
  const minutes = parseInt(waiting);
  if (minutes > 20) return "critical";
  if (minutes > 10) return "warning";
  return "success";
};

// Consultation trend data (hourly for today)
const consultationData = [
  { hour: "9 AM", patients: 2 },
  { hour: "10 AM", patients: 3 },
  { hour: "11 AM", patients: 4 },
  { hour: "12 PM", patients: 2 },
  { hour: "1 PM", patients: 1 },
  { hour: "2 PM", patients: 0 },
  { hour: "3 PM", patients: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, Dr. Sharma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              {stat.trend && (
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Patients in Queue</h3>
          <Badge variant="secondary">{patientsInQueue.length} waiting</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {patientsInQueue.map((patient, index) => {
            const priorityColor = getPriorityColor(patient.waiting);
            const isNext = index === 0;
            
            return (
              <Card 
                key={patient.token} 
                className={`border-2 transition-all hover:shadow-md ${
                  isNext 
                    ? "border-success bg-success-light animate-pulse" 
                    : "border-border"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {patient.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {patient.age} • Token: {patient.token}
                      </p>
                      <p className="text-xs text-muted-foreground">{patient.id}</p>
                    </div>
                    {isNext && (
                      <Badge className="bg-success text-success-foreground">
                        Next
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Symptoms:</p>
                    <p className="text-sm text-muted-foreground">{patient.symptoms}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Waiting: <span className={`font-medium text-${priorityColor}`}>{patient.waiting}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Registered: {patient.registered}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      variant={isNext ? "default" : "outline"}
                      onClick={() => navigate("/consultation")}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Consultation
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate("/patient-history")}>
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Consultation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Trend - Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consultationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hour" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  label={{ value: 'Patients', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
