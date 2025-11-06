import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Hospital, Pill, Stethoscope, Upload, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { mockEntities } from "../../lib/mocks/entities";

type EntityType = "govt-hospital" | "private-hospital" | "clinic" | "pharmacy" | null;

const ENTITY_ID_REGEX = /^[A-Z0-9-]{6,30}$/; // simple client-side format

const RegisterEntity = () => {
  const [selectedType, setSelectedType] = useState<EntityType>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityId, setEntityId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const entityTypes = [
    { id: "govt-hospital" as EntityType, name: "Government Hospital", icon: Hospital, description: "Public healthcare institutions with government funding" },
    { id: "private-hospital" as EntityType, name: "Private Hospital", icon: Building2, description: "Private healthcare facilities and corporate hospitals" },
    { id: "clinic" as EntityType, name: "Clinic", icon: Stethoscope, description: "Small-scale medical practices and specialty clinics" },
    { id: "pharmacy" as EntityType, name: "Pharmacy", icon: Pill, description: "Retail pharmacies and medicine dispensaries" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...files]);
    }
  };

  const isEntityIdUnique = (id: string) => !mockEntities.some((e) => e.id.toLowerCase() === id.toLowerCase());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast({ title: "Terms & Conditions Required", description: "Please accept the terms and conditions to continue", variant: "destructive" });
      return;
    }

    if (!ENTITY_ID_REGEX.test(entityId)) {
      toast({ title: "Invalid Entity ID", description: "Use uppercase letters, digits, and hyphens (6-30 chars)", variant: "destructive" });
      return;
    }

    if (!isEntityIdUnique(entityId)) {
      toast({ title: "Entity ID Not Unique", description: "Please choose a different Entity ID", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "Success!", description: "Entity registered successfully" });
      navigate("/onboard/success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">MediChain</h1>
          </Link>
          <Link to="/onboard/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h2 className="text-3xl font-bold mb-2">Register Your Institution</h2>
        <p className="text-muted-foreground mb-8">Choose your entity type and provide details to get started</p>

        {!selectedType && (
          <div className="grid md:grid-cols-2 gap-4">
            {entityTypes.map((type) => (
              <Card key={type.id} className="p-6 cursor-pointer hover:border-primary transition-all" onClick={() => setSelectedType(type.id)}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedType && (
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {entityTypes.find((t) => t.id === selectedType)?.icon && (() => { const Icon = entityTypes.find((t) => t.id === selectedType)!.icon; return <Icon className="w-6 h-6 text-primary" />; })()}
                </div>
                <div>
                  <h3 className="font-semibold">{entityTypes.find((t) => t.id === selectedType)?.name}</h3>
                  <p className="text-sm text-muted-foreground">Complete the registration form</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>Change Type</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="entity-id">Unique Entity ID *</Label>
                  <Input id="entity-id" placeholder="e.g., MDCH-HSP-0001" value={entityId} onChange={(e) => setEntityId(e.target.value.toUpperCase())} required aria-invalid={!ENTITY_ID_REGEX.test(entityId)} />
                  <p className="text-xs text-muted-foreground">Uppercase letters, digits, and hyphens; must be unique</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity-name">Institution Name *</Label>
                  <Input id="entity-name" placeholder="Enter institution name" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" placeholder="Complete address with pincode" required rows={3} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contact Person *</Label>
                  <Input id="contact-person" placeholder="Full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="contact@example.com" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXXXXXXX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-number">License Number *</Label>
                  <Input id="license-number" placeholder="Registration/License ID" required />
                </div>
              </div>

              <div className="space-y-3 border rounded-lg p-6 bg-accent/50">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <Label htmlFor="prescription-template" className="text-base font-semibold">Prescription Templates</Label>
                </div>
                <p className="text-sm text-muted-foreground">Upload your institution's prescription template(s) for AI onboarding (PDF, PNG, JPG - Max 5MB each)</p>
                <Input id="prescription-template" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} className="cursor-pointer" />
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="text-sm flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                <div className="space-y-1 leading-tight">
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">I agree to the Terms & Conditions and Privacy Policy</Label>
                  <p className="text-xs text-muted-foreground">By registering, you agree to comply with healthcare data protection regulations and MediChain's terms of service.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Registering..." : "Register Institution"}</Button>
                <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegisterEntity;

