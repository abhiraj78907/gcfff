import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon ? (
          <div
            className={cn(
              "rounded-lg p-2 transition-transform duration-200 hover:scale-110",
              variantClasses[variant]
            )}
            role="img"
            aria-label={`${title} icon`}
          >
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-colors duration-200">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1 flex items-center gap-1 transition-colors duration-200", 
            trend.positive ? "text-success" : "text-destructive")}
            role="status"
            aria-live="polite">
            <span aria-label={trend.positive ? "Increase" : "Decrease"}>
              {trend.positive ? "↑" : "↓"}
            </span>
            {trend.positive ? "+" : ""}{trend.value} from last week
          </p>
        )}
      </CardContent>
    </Card>
  );
}
