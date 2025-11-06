import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, QrCode, User, Calendar, Building2, CheckCircle2, Printer } from "lucide-react";
import { getPrescriptionsByEntity } from "../lib/mockData";
import { useSubEntry } from "../contexts/SubEntryContext";

export default function Prescriptions() {
  const { currentEntityId } = useSubEntry();
  const mockPrescriptions = getPrescriptionsByEntity(currentEntityId);
  const [selectedPrescription, setSelectedPrescription] = useState(mockPrescriptions[0]);
  const [selectedMedicines, setSelectedMedicines] = useState<number[]>([]);

  const toggleMedicine = (index: number) => {
    setSelectedMedicines(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedMedicines.length === selectedPrescription.medicines.length) {
      setSelectedMedicines([]);
    } else {
      setSelectedMedicines(selectedPrescription.medicines.map((_, i) => i));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Digital Prescriptions</h1>
        <p className="text-muted-foreground">Search, scan and manage patient prescriptions</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by Patient ID, Name, or Prescription ID..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Prescriptions Carousel */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Recent Prescriptions</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mockPrescriptions.map(prescription => (
            <Card 
              key={prescription.id}
              className={`min-w-[200px] cursor-pointer transition-all ${
                selectedPrescription.id === prescription.id 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedPrescription(prescription)}
            >
              <CardContent className="p-4">
                <div className="space-y-1">
                  <p className="font-medium">{prescription.patientName}</p>
                  <p className="text-sm text-muted-foreground">{prescription.id}</p>
                  <Badge 
                    variant={prescription.status === "completed" ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {prescription.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Prescription Details */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient Info */}
            <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="font-medium">{selectedPrescription.patientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                  <p className="font-medium">{selectedPrescription.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Hospital</p>
                  <p className="font-medium">{selectedPrescription.hospital}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedPrescription.date}</p>
                </div>
              </div>
            </div>

            {/* Medicines Table */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">Prescribed Medicines</h4>
                <Button variant="outline" size="sm" onClick={toggleAll}>
                  {selectedMedicines.length === selectedPrescription.medicines.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="rounded-lg border border-border">
                <div className="grid grid-cols-[auto,2fr,1fr,1fr,1fr,auto] gap-4 border-b border-border bg-muted/50 p-3 text-sm font-medium">
                  <div></div>
                  <div>Medicine</div>
                  <div>Dosage</div>
                  <div>Timing</div>
                  <div>Qty</div>
                  <div>Status</div>
                </div>
                {selectedPrescription.medicines.map((medicine, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-[auto,2fr,1fr,1fr,1fr,auto] gap-4 border-b border-border p-3 last:border-b-0"
                  >
                    <Checkbox 
                      checked={selectedMedicines.includes(index)}
                      onCheckedChange={() => toggleMedicine(index)}
                    />
                    <div className="font-medium">{medicine.name}</div>
                    <div className="text-sm text-muted-foreground">{medicine.dosage}</div>
                    <div className="text-sm text-muted-foreground">{medicine.timing}</div>
                    <div className="text-sm">{medicine.quantity}</div>
                    <Badge variant={medicine.inStock ? "default" : "destructive"}>
                      {medicine.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Medicines</span>
                <span className="font-medium">{selectedPrescription.medicines.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Selected</span>
                <span className="font-medium">{selectedMedicines.length}</span>
              </div>
              <div className="my-2 border-t border-border"></div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold text-primary">₹{selectedPrescription.total}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">Cash</Button>
                <Button variant="outline" size="sm">UPI</Button>
                <Button variant="outline" size="sm">Card</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" size="lg">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete & Dispense
              </Button>
              <Button variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
