import { StatCard } from "../../components/StatCard";
import { TestTube, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSubEntry } from "../../contexts/SubEntryContext";
import { getLabWeeklyByEntity, getLabRecentUrgentByEntity } from "../../lib/mockData";

export default function LabDashboard() {
  const navigate = useNavigate();
  const { currentEntityId } = useSubEntry();
  const chartData = getLabWeeklyByEntity(currentEntityId);
  const recentTests = getLabRecentUrgentByEntity(currentEntityId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lab Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor lab workload and test status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Test Requests"
          value="12"
          icon={TestTube}
          trend="3 added today"
          variant="default"
        />
        <StatCard
          title="Tests In Progress"
          value="8"
          icon={Clock}
          trend="2 nearing completion"
          variant="warning"
        />
        <StatCard
          title="Completed Today"
          value="15"
          icon={CheckCircle}
          trend="Above average"
          variant="success"
        />
        <StatCard
          title="Pending Validation"
          value="4"
          icon={AlertCircle}
          trend="Requires attention"
          variant="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tests Handled This Week</CardTitle>
            <CardDescription>Daily test completion statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="tests" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Test Requests</CardTitle>
            <CardDescription>Urgent tests requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTests.map((test) => (
              <div key={test.id} className="flex items-start justify-between p-3 bg-secondary rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{test.patient}</p>
                    <Badge variant={test.urgency === "urgent" ? "destructive" : "secondary"} className="text-xs">
                      {test.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{test.test}</p>
                  <p className="text-xs text-muted-foreground">{test.id}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => navigate("/lab/requests")} size="lg">
          View All Requests
        </Button>
        <Button onClick={() => navigate("/lab/upload")} variant="outline" size="lg">
          Upload Results
        </Button>
      </div>
    </div>
  );
}


