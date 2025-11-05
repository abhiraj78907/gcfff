import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@admin/components/ui/card";
import { cn } from "@admin/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "secondary" | "accent" | "success" | "warning";
  subtitle?: string;
}

export const KPICard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
  subtitle,
}: KPICardProps) => {
  const iconColorMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  const changeColorMap = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>}
            {change && (
              <p className={cn("text-sm font-medium", changeColorMap[changeType])}>
                {change}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconColorMap[iconColor])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
