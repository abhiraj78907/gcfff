import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const Appointments = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Appointments</h1>
        <p className="text-muted-foreground mb-6">Schedule and manage patient appointments</p>
        
        <Card className="p-12 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Appointments Module</h3>
          <p className="text-muted-foreground mb-6">Coming soon - Schedule and manage appointments</p>
          <Button>Create New Appointment</Button>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
