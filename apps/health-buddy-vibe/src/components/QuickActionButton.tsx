import { Button } from "@patient/components/ui/button";
import { Check } from "lucide-react";
import { Card } from "@patient/components/ui/card";

interface QuickActionButtonProps {
  onMarkAllTaken: () => void;
  dueCount: number;
}

export const QuickActionButton = ({ onMarkAllTaken, dueCount }: QuickActionButtonProps) => {
  if (dueCount === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold text-foreground">
          {dueCount} दवाई{dueCount > 1 ? 'यां' : ''} लेनी है
        </p>
        <Button
          onClick={onMarkAllTaken}
          size="lg"
          className="w-full h-16 text-lg bg-success hover:bg-success/90 text-success-foreground"
        >
          <Check className="w-6 h-6 mr-2" />
          सभी दवाइयां ली
        </Button>
      </div>
    </Card>
  );
};
