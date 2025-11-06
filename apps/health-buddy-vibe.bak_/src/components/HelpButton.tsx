import { Button } from "@/components/ui/button";
import { Phone, HelpCircle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const HelpButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:1800-000-0000';
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        size="lg"
        variant="secondary"
        className="fixed bottom-24 left-4 h-16 w-16 rounded-full shadow-lg z-50"
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">सहायता चाहिए?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              हमारी सहायता टीम से बात करने के लिए कॉल करें। हम आपकी मदद करने के लिए यहां हैं।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="text-base h-12">रद्द करें</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCall}
              className="bg-success hover:bg-success/90 text-base h-12"
            >
              <Phone className="w-4 h-4 mr-2" />
              1800-000-0000 पर कॉल करें
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
