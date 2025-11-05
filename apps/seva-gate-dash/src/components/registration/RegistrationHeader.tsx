import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationHeaderProps {
  tokenNumber: string;
  department: string;
  onDepartmentChange: (dept: string) => void;
}

const departments = ["General Medicine", "Cardiology", "Pediatrics", "Orthopedics", "Dermatology"];

export const RegistrationHeader = ({ tokenNumber, department, onDepartmentChange }: RegistrationHeaderProps) => {
  const { toast } = useToast();

  const copyToken = () => {
    navigator.clipboard.writeText(tokenNumber);
    toast({
      title: "Token Copied",
      description: "Token number copied to clipboard",
    });
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Token Number</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{tokenNumber}</span>
              <button
                onClick={copyToken}
                className="p-2 hover:bg-background rounded-md transition-colors"
                aria-label="Copy token number"
              >
                <Copy className="h-5 w-5 text-primary" />
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Department</h3>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <Badge
                  key={dept}
                  variant={department === dept ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onDepartmentChange(dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
