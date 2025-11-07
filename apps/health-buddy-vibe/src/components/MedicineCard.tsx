import { Button } from "@patient/components/ui/button";
import { Card } from "@patient/components/ui/card";
import { Badge } from "@patient/components/ui/badge";
import { Check, Clock, AlertCircle, Utensils } from "lucide-react";
import { cn } from "@patient/lib/utils";

export type MedicineStatus = "taken" | "due" | "missed";

interface MedicineCardProps {
  name: string;
  dosage: string;
  instructions: string;
  status: MedicineStatus;
  imageUrl: string;
  time: string;
  withFood?: boolean;
  onMarkTaken?: () => void;
  onSnooze?: () => void;
}

const statusConfig = {
  taken: {
    icon: Check,
    color: "bg-success text-success-foreground",
    badgeVariant: "default" as const,
    label: "Taken",
  },
  due: {
    icon: Clock,
    color: "bg-due text-due-foreground",
    badgeVariant: "secondary" as const,
    label: "Due Now",
    pulse: true,
  },
  missed: {
    icon: AlertCircle,
    color: "bg-destructive text-destructive-foreground",
    badgeVariant: "destructive" as const,
    label: "Missed",
  },
};

export const MedicineCard = ({
  name,
  dosage,
  instructions,
  status,
  imageUrl,
  time,
  withFood = false,
  onMarkTaken,
  onSnooze,
}: MedicineCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn(
      "p-4 md:p-5 transition-all duration-300 animate-slide-up",
      'pulse' in config && config.pulse && "animate-pulse-slow"
    )}>
      <div className="flex gap-3 md:gap-4">
        {/* Medicine Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Medicine Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-base text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{dosage}</p>
            </div>
            <Badge className={config.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          <div className="space-y-1 mb-3">
            <p className="text-xs md:text-sm text-foreground">{instructions}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {time}
              </span>
              {withFood && (
                <span className="flex items-center gap-1">
                  <Utensils className="w-3 h-3" />
                  After food
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {status === "due" && (
            <div className="flex gap-2 flex-col sm:flex-row pt-2 border-t border-border">
              <Button
                onClick={onMarkTaken}
                className="sm:flex-1 w-full sm:w-auto bg-success hover:bg-success/90 text-success-foreground h-9 md:h-11 text-xs md:text-sm"
                size="sm"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Taken
              </Button>
              <Button
                onClick={onSnooze}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto h-9 md:h-11 text-xs md:text-sm"
              >
                Snooze 30m
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
