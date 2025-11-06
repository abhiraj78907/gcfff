import { cn } from "@/lib/utils";

interface TimelineSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export const TimelineSection = ({ title, icon, children, className }: TimelineSectionProps) => {
  return (
    <div className={cn("relative pl-8", className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl shadow-md">
        {icon}
      </div>
      
      <div className="pb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          {title}
        </h2>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};
