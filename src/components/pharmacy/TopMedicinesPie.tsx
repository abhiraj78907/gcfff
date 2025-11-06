import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Slice = { label: string; value: number };

interface TopMedicinesPieProps {
  data: Slice[];
  title?: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

export function TopMedicinesPie({ data, title = "Top Medicines" }: TopMedicinesPieProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={48} stroke="none">
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: any, n: any, p: any) => [v, p?.payload?.label]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TopMedicinesPie;


