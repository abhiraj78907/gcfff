import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { label: string; value: number };

interface SalesTrendChartProps {
  data: Point[];
  title?: string;
}

export function SalesTrendChart({ data, title = "Sales Trend" }: SalesTrendChartProps) {
  const series = useMemo(
    () => data.map((d) => ({ label: d.label, value: Number(d.value) || 0 })),
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
            <YAxis tickLine={false} axisLine={false} width={36} className="text-xs fill-muted-foreground" />
            <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Sales"]} cursor={{ stroke: "var(--muted)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#salesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default SalesTrendChart;


