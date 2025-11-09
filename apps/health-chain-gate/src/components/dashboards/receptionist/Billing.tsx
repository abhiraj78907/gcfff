import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, Plus, Download, Printer, CheckCircle, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Billing = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    phone: "",
    service: "",
    amount: "",
    paymentMethod: "",
    description: "",
  });

  const invoices = [
    {
      id: "INV-001",
      patientName: "Ramesh Kumar",
      patientId: "VIMS-2025-12345",
      phone: "+91 9876543210",
      date: "2025-01-15",
      services: ["Consultation", "Lab Test"],
      amount: 1500,
      status: "paid",
      paymentMethod: "Cash",
    },
    {
      id: "INV-002",
      patientName: "Sita Devi",
      patientId: "VIMS-2025-12344",
      phone: "+91 9876543211",
      date: "2025-01-15",
      services: ["Consultation", "X-Ray"],
      amount: 2500,
      status: "pending",
      paymentMethod: "Card",
    },
    {
      id: "INV-003",
      patientName: "Abdul Khan",
      patientId: "VIMS-2025-12343",
      phone: "+91 9876543212",
      date: "2025-01-14",
      services: ["Consultation"],
      amount: 500,
      status: "paid",
      paymentMethod: "UPI",
    },
    {
      id: "INV-004",
      patientName: "Priya Menon",
      patientId: "VIMS-2025-12348",
      phone: "+91 9876543213",
      date: "2025-01-14",
      services: ["Consultation", "Medicines"],
      amount: 1200,
      status: "paid",
      paymentMethod: "Cash",
    },
  ];

  const services = [
    { name: "Consultation", price: 500 },
    { name: "Lab Test", price: 1000 },
    { name: "X-Ray", price: 2000 },
    { name: "Medicines", price: 700 },
    { name: "ECG", price: 800 },
    { name: "Ultrasound", price: 3000 },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted";
    }
  };

  const handleCreateInvoice = () => {
    if (!formData.patientName || !formData.service || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success!",
      description: "Invoice created successfully",
    });
    setIsDialogOpen(false);
    setFormData({
      patientName: "",
      patientId: "",
      phone: "",
      service: "",
      amount: "",
      paymentMethod: "",
      description: "",
    });
  };

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Download Started",
      description: `Invoice ${id} is being downloaded`,
    });
    // Mock download functionality
    const blob = new Blob(["Invoice content"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintInvoice = (id: string) => {
    toast({
      title: "Print",
      description: `Printing invoice ${id}`,
    });
    window.print();
  };

  const handleMarkPaid = (id: string) => {
    toast({
      title: "Payment Recorded",
      description: `Invoice ${id} marked as paid`,
    });
  };

  const selectedService = services.find((s) => s.name === formData.service);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Generate invoices and manage payments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Fill in the details to generate a new invoice</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      placeholder="VIMS-2025-XXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service *</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value, amount: services.find((s) => s.name === value)?.price.toString() || "" })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.name} value={service.name}>
                            {service.name} - ₹{service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional notes or description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvoice}>Generate Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, ID, or invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredInvoices.length === 0 ? (
            <Card className="p-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Invoices Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{invoice.patientName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {invoice.patientId} | Invoice: {invoice.id}</p>
                      </div>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date</p>
                        <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                        <p className="font-medium">{invoice.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Services</p>
                        <div className="flex flex-wrap gap-2">
                          {invoice.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">₹{invoice.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {invoice.status === "pending" && (
                      <Button size="sm" onClick={() => handleMarkPaid(invoice.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Paid
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(invoice.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePrintInvoice(invoice.id)}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
