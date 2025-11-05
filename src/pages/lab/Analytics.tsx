import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const throughputData = [
  { day: "Mon", completed: 18, turnaround: 6.2 },
  { day: "Tue", completed: 24, turnaround: 5.8 },
  { day: "Wed", completed: 22, turnaround: 6.5 },
  { day: "Thu", completed: 27, turnaround: 5.3 },
  { day: "Fri", completed: 25, turnaround: 5.9 },
  { day: "Sat", completed: 14, turnaround: 7.1 },
  { day: "Sun", completed: 9, turnaround: 7.8 },
];

const mixData = [
  { name: "CBC", value: 32 },
  { name: "LFT", value: 18 },
  { name: "KFT", value: 15 },
  { name: "Lipid", value: 20 },
  { name: "Glucose", value: 15 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function LabAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lab Analytics</h1>
        <p className="text-muted-foreground mt-1">Throughput, turnaround time, and test mix (Lab-only)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Throughput</CardTitle>
            <CardDescription>Completed tests per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Turnaround Time</CardTitle>
            <CardDescription>Hours from sample to validation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="turnaround" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Mix</CardTitle>
          <CardDescription>Distribution of lab tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mixData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {mixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


