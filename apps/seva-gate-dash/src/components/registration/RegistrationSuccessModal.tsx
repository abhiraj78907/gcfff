import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, Send } from "lucide-react";

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  registrationData: {
    uhid: string;
    token: string;
    doctor: string;
    patientName: string;
    room: string;
  };
}

export const RegistrationSuccessModal = ({ open, onClose, registrationData }: RegistrationSuccessModalProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSendSMS = () => {
    // Mock SMS sending
    console.log("Sending SMS with registration details");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Registration Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Patient has been successfully registered
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Patient Name:</span>
                <span className="text-sm font-semibold">{registrationData.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">UHID:</span>
                <span className="text-sm font-semibold">{registrationData.uhid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Token Number:</span>
                <span className="text-lg font-bold text-primary">{registrationData.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Consulting Doctor:</span>
                <span className="text-sm font-semibold">{registrationData.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Room:</span>
                <span className="text-sm font-semibold">{registrationData.room}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print Slip
            </Button>
            <Button onClick={handleSendSMS} variant="outline" className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Send SMS
            </Button>
          </div>

          <Button onClick={onClose} className="w-full" size="lg">
            Register Another Patient
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
