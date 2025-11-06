import { Button } from "@patient/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@patient/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  isSupported: boolean;
}

export const VoiceButton = ({ isListening, onStart, onStop, isSupported }: VoiceButtonProps) => {
  if (!isSupported) return null;

  return (
    <Button
      onClick={isListening ? onStop : onStart}
      size="lg"
      className={cn(
        "fixed bottom-24 right-4 h-16 w-16 rounded-full shadow-lg z-50",
        isListening ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90"
      )}
    >
      {isListening ? (
        <MicOff className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </Button>
  );
};
