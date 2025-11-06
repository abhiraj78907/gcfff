import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Item = { label: string; value: number };

interface PrescriptionsBarProps {
  data: Item[];
  title?: string;
}

export function PrescriptionsBar({ data, title = "Doctor Prescriptions" }: PrescriptionsBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
            <YAxis tickLine={false} axisLine={false} width={30} className="text-xs fill-muted-foreground" />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--primary)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PrescriptionsBar;


