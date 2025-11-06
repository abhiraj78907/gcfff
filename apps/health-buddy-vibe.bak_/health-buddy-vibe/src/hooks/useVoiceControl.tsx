import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface VoiceControlOptions {
  onMarkTaken?: () => void;
  onSnooze?: () => void;
  language?: string;
}

export const useVoiceControl = ({ onMarkTaken, onSnooze, language = 'hi-IN' }: VoiceControlOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);

        // Hindi commands
        if (transcript.includes('ली') || transcript.includes('खाया') || transcript.includes('taken')) {
          onMarkTaken?.();
          toast({ title: "दवा ली गई", description: "बहुत अच्छा! आपकी दवा दर्ज कर दी गई है।" });
        } else if (transcript.includes('बाद में') || transcript.includes('snooze') || transcript.includes('थोड़ी देर')) {
          onSnooze?.();
          toast({ title: "याद दिलाएंगे", description: "30 मिनट में फिर से याद दिलाएंगे।" });
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      toast({ 
        title: "Voice not supported", 
        description: "Your browser doesn't support voice commands.",
        variant: "destructive"
      });
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return { isListening, startListening, stopListening, isSupported: !!recognition };
};
