import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

const PrescriptionDetails = () => {
  const { state } = useLocation() as { state?: any };
  const { id } = useParams();
  const navigate = useNavigate();
  const prescription = state?.prescription;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Prescription Details</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {!prescription ? (
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">No details available for ID {id}.</p>
          </Card>
        ) : (
          <Card className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{prescription.doctorName}</h2>
              <p className="text-sm text-muted-foreground">{prescription.hospitalName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">DIAGNOSIS</p>
              <p className="text-sm">{prescription.diagnosis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">MEDICINES</p>
              <div className="rounded-lg border">
                <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                  <div>Medicine</div>
                  <div>Dosage</div>
                  <div>Duration</div>
                </div>
                <div className="divide-y">
                  {prescription.medicines.map((m: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 px-3 py-2 text-sm">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.dosage}</div>
                      <div className="text-xs text-muted-foreground">{m.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetails;


