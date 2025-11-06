import { cn } from "@patient/lib/utils";

interface TimelineSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export const TimelineSection = ({ title, icon, children, className }: TimelineSectionProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <span className="text-xl md:text-2xl">{icon}</span>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
