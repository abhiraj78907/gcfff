import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, UserPlus, Eye, EyeOff, ArrowLeft, Upload, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FileDrop from "./_FileDrop";
import { useToast } from "@/hooks/use-toast";

type Role = {
  id: string;
  name: string;
  description: string;
};

type FileWithPreview = File & { preview?: string };

const DRAFT_KEY = "register-user-draft-v1";

const RegisterUser = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // role-specific fields
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [doctorExperience, setDoctorExperience] = useState<string>("");
  const [doctorQualifications, setDoctorQualifications] = useState("");
  const [doctorPastService, setDoctorPastService] = useState("");
  const [doctorCerts, setDoctorCerts] = useState<FileWithPreview[]>([]);
  const [doctorLicense, setDoctorLicense] = useState<FileWithPreview[]>([]);
  const [doctorPhoto, setDoctorPhoto] = useState<FileWithPreview[]>([]);

  const [labIdCard, setLabIdCard] = useState<FileWithPreview[]>([]);
  const [labCertificates, setLabCertificates] = useState<FileWithPreview[]>([]);
  const [labPhoto, setLabPhoto] = useState<FileWithPreview[]>([]);

  const [pharmacyLicense, setPharmacyLicense] = useState<FileWithPreview[]>([]);
  const [pharmacyIdProof, setPharmacyIdProof] = useState<FileWithPreview[]>([]);
  const [pharmacyExperience, setPharmacyExperience] = useState("");
  const [pharmacyPhoto, setPharmacyPhoto] = useState<FileWithPreview[]>([]);

  const [receptionistIdProof, setReceptionistIdProof] = useState<FileWithPreview[]>([]);

  const [adminIdProof, setAdminIdProof] = useState<FileWithPreview[]>([]);
  const [adminAuthorizationDocs, setAdminAuthorizationDocs] = useState<FileWithPreview[]>([]);

  const [patientAge, setPatientAge] = useState<string>("");
  const [patientGender, setPatientGender] = useState("");
  const [patientIdProof, setPatientIdProof] = useState<FileWithPreview[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles: Role[] = [
    { id: "doctor", name: "Doctor", description: "Patient consultations and prescriptions" },
    { id: "receptionist", name: "Receptionist", description: "Patient registration and queue management" },
    { id: "pharmacist", name: "Pharmacist", description: "Prescription dispensing and inventory" },
    { id: "lab-tech", name: "Lab Technician", description: "Test orders and result management" },
    { id: "admin", name: "Admin", description: "Multi-entity management and analytics" },
    { id: "patient", name: "Patient", description: "Personal health records and reminders" },
  ];

  const isDoctor = selectedRoles.includes("doctor");
  const isLab = selectedRoles.includes("lab-tech");
  const isPharmacist = selectedRoles.includes("pharmacist");
  const isReceptionist = selectedRoles.includes("receptionist");
  const isAdmin = selectedRoles.includes("admin");
  const isPatient = selectedRoles.includes("patient");

  const doctorSpecializations = useMemo(
    () => [
      "General Medicine",
      "Cardiology",
      "Orthopedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Dermatology",
      "ENT (Otorhinolaryngology)",
      "Ophthalmology",
      "Psychiatry",
      "Neurology",
      "Nephrology",
      "Gastroenterology",
      "Pulmonology",
      "Endocrinology",
      "Oncology",
      "Urology",
      "Radiology",
      "Anesthesiology",
      "Dentistry",
      "Physiotherapy",
    ],
    []
  );

  const experienceRanges = useMemo(() => [
    "0-5",
    "6-10",
    "11-15",
    "16-20",
    "21-25",
    "26-30",
    "30+",
  ], []);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) => {
      const exists = prev.includes(roleId);
      const next = exists ? prev.filter((r) => r !== roleId) : [...prev, roleId];
      // Keep a primary role reference for any single-role uses
      if (!exists) setSelectedRole(roleId);
      else if (selectedRole === roleId) setSelectedRole(next[0] ?? "");
      return next;
    });
  };

  // helpers
  const attachPreviews = (files: File[]): FileWithPreview[] => files.map((f) => Object.assign(f, { preview: URL.createObjectURL(f) }));
  const onDrop = (setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    setter((prev) => [...prev, ...attachPreviews(files)]);
  };
  const onPick = (setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setter((prev) => [...prev, ...attachPreviews(files)]);
  };
  const removeAt = (setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>, idx: number) => setter((prev) => prev.filter((_, i) => i !== idx));

  // draft load/save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      setSelectedRole(d.selectedRole ?? "");
      setSelectedRoles(Array.isArray(d.selectedRoles) ? d.selectedRoles : (d.selectedRole ? [d.selectedRole] : []));
      setDoctorSpecialization(d.doctorSpecialization ?? "");
      setDoctorExperience(d.doctorExperience ?? "");
      setDoctorQualifications(d.doctorQualifications ?? "");
      setDoctorPastService(d.doctorPastService ?? "");
      setPharmacyExperience(d.pharmacyExperience ?? "");
      setPatientAge(d.patientAge ?? "");
      setPatientGender(d.patientGender ?? "");
    } catch {}
  }, []);

  const saveDraft = () => {
    const draft = {
      selectedRole,
      selectedRoles,
      doctorSpecialization,
      doctorExperience,
      doctorQualifications,
      doctorPastService,
      pharmacyExperience,
      patientAge,
      patientGender,
    };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch {}
    toast({ title: "Draft saved", description: "You can continue later" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select your role",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    // Role-specific validations
    if (isDoctor) {
      if (!doctorSpecialization) return toast({ title: "Specialization required", variant: "destructive" });
      if (doctorLicense.length === 0) return toast({ title: "Doctor license proof required", variant: "destructive" });
    }
    if (isLab) {
      if (labIdCard.length === 0) return toast({ title: "Lab ID card is required", variant: "destructive" });
    }
    if (isPharmacist) {
      if (pharmacyLicense.length === 0) return toast({ title: "Pharmacy license proof required", variant: "destructive" });
      if (pharmacyIdProof.length === 0) return toast({ title: "Pharmacist ID proof required", variant: "destructive" });
    }
    if (isReceptionist) {
      if (receptionistIdProof.length === 0) return toast({ title: "Receptionist ID proof required", variant: "destructive" });
    }
    if (isAdmin) {
      if (adminIdProof.length === 0 || adminAuthorizationDocs.length === 0) return toast({ title: "Admin ID and authorization required", variant: "destructive" });
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "User account created successfully",
      });
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      navigate("/onboard/login");
    }, 1500);
  };

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl min-h-0">
        <Link to="/onboard/success" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">User Registration</h2>
              <p className="text-muted-foreground">Create your account and select roles</p>
            </div>
          </div>
        </div>

        <Card className="p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name *</Label>
                  <Input id="full-name" placeholder="Enter your full name" required className="h-11 text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required className="h-11 text-base" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" placeholder="+91 XXXXXXXXXX" required className="h-11 text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-id">Employee ID (Optional)</Label>
                  <Input id="employee-id" placeholder="EMP-XXXX" className="h-11 text-base" />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Role(s) *</h3>
              <p className="text-sm text-muted-foreground">You can select multiple roles if applicable</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`border rounded-lg p-4 transition-all ${
                      selectedRoles.includes(role.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{role.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institution & Role-specific Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input id="institution" placeholder="Search or select institution" required className="h-11 text-base" />
                <p className="text-xs text-muted-foreground">Start typing to search for your institution</p>
              </div>

              <Accordion type="multiple" className="w-full">
                {isDoctor && (
                  <AccordionItem value="doctor">
                    <AccordionTrigger>Doctor Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="doctor-specialization">Doctor Specialization *</Label>
                          <Select value={doctorSpecialization || ""} onValueChange={(v) => setDoctorSpecialization(v || "")}>
                            <SelectTrigger id="doctor-specialization" aria-label="Select specialization" className="h-11 text-base">
                              <SelectValue placeholder="e.g., Cardiology, General Medicine" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctorSpecializations.map((sp) => (
                                <SelectItem key={sp} value={sp}>{sp}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doctor-experience">Years of Experience *</Label>
                          <Select value={doctorExperience || ""} onValueChange={(v) => setDoctorExperience(v || "")}>
                            <SelectTrigger id="doctor-experience" aria-label="Select years of experience" className="h-11 text-base">
                              <SelectValue placeholder="Select range (5-year buckets)" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceRanges.map((rng) => (
                                <SelectItem key={rng} value={rng}>{rng} years</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="doctor-qual">Educational Qualifications (Optional)</Label>
                          <Input id="doctor-qual" placeholder="e.g., MBBS, MD; AIIMS" value={doctorQualifications} onChange={(e) => setDoctorQualifications(e.target.value)} className="h-11 text-base" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="doctor-service">Past Service (Optional)</Label>
                          <Input id="doctor-service" placeholder="Hospitals, years, specialties" value={doctorPastService} onChange={(e) => setDoctorPastService(e.target.value)} className="h-11 text-base" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <FileDrop label="Medical Certificates" files={doctorCerts} onDrop={onDrop(setDoctorCerts)} onPick={onPick(setDoctorCerts)} onRemove={(i) => removeAt(setDoctorCerts, i)} />
                        <FileDrop label="License Proof (Required)" required files={doctorLicense} onDrop={onDrop(setDoctorLicense)} onPick={onPick(setDoctorLicense)} onRemove={(i) => removeAt(setDoctorLicense, i)} />
                        <FileDrop label="Profile Photo (Optional)" accept="image/*" files={doctorPhoto} onDrop={onDrop(setDoctorPhoto)} onPick={onPick(setDoctorPhoto)} onRemove={(i) => removeAt(setDoctorPhoto, i)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isLab && (
                  <AccordionItem value="lab">
                    <AccordionTrigger>Lab Technician Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FileDrop label="ID Card (Required)" required files={labIdCard} onDrop={onDrop(setLabIdCard)} onPick={onPick(setLabIdCard)} onRemove={(i) => removeAt(setLabIdCard, i)} />
                        <FileDrop label="Certificates" files={labCertificates} onDrop={onDrop(setLabCertificates)} onPick={onPick(setLabCertificates)} onRemove={(i) => removeAt(setLabCertificates, i)} />
                        <FileDrop label="Photo (Optional)" accept="image/*" files={labPhoto} onDrop={onDrop(setLabPhoto)} onPick={onPick(setLabPhoto)} onRemove={(i) => removeAt(setLabPhoto, i)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isPharmacist && (
                  <AccordionItem value="pharmacist">
                    <AccordionTrigger>Pharmacist Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="pharma-exp">Past Experience (Optional)</Label>
                          <Input id="pharma-exp" placeholder="e.g., 3 years retail pharmacy" value={pharmacyExperience} onChange={(e) => setPharmacyExperience(e.target.value)} className="h-11 text-base" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <FileDrop label="Pharmacy License (Required)" required files={pharmacyLicense} onDrop={onDrop(setPharmacyLicense)} onPick={onPick(setPharmacyLicense)} onRemove={(i) => removeAt(setPharmacyLicense, i)} />
                        <FileDrop label="ID Proof (Required)" required files={pharmacyIdProof} onDrop={onDrop(setPharmacyIdProof)} onPick={onPick(setPharmacyIdProof)} onRemove={(i) => removeAt(setPharmacyIdProof, i)} />
                        <FileDrop label="Photo (Optional)" accept="image/*" files={pharmacyPhoto} onDrop={onDrop(setPharmacyPhoto)} onPick={onPick(setPharmacyPhoto)} onRemove={(i) => removeAt(setPharmacyPhoto, i)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isReceptionist && (
                  <AccordionItem value="receptionist">
                    <AccordionTrigger>Receptionist Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FileDrop label="ID Proof (Required)" required files={receptionistIdProof} onDrop={onDrop(setReceptionistIdProof)} onPick={onPick(setReceptionistIdProof)} onRemove={(i) => removeAt(setReceptionistIdProof, i)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isAdmin && (
                  <AccordionItem value="admin">
                    <AccordionTrigger>Admin Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FileDrop label="ID Proof (Required)" required files={adminIdProof} onDrop={onDrop(setAdminIdProof)} onPick={onPick(setAdminIdProof)} onRemove={(i) => removeAt(setAdminIdProof, i)} />
                        <FileDrop label="Authorization Docs (Required)" required files={adminAuthorizationDocs} onDrop={onDrop(setAdminAuthorizationDocs)} onPick={onPick(setAdminAuthorizationDocs)} onRemove={(i) => removeAt(setAdminAuthorizationDocs, i)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isPatient && (
                  <AccordionItem value="patient">
                    <AccordionTrigger>Patient Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="patient-age">Age *</Label>
                          <Input id="patient-age" type="number" min={0} value={patientAge} onChange={(e) => setPatientAge(e.target.value)} required className="h-11 text-base" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-gender">Gender *</Label>
                          <Input id="patient-gender" placeholder="e.g., Female" value={patientGender} onChange={(e) => setPatientGender(e.target.value)} required className="h-11 text-base" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <FileDrop label="ID Proof (Optional)" files={patientIdProof} onDrop={onDrop(setPatientIdProof)} onPick={onPick(setPatientIdProof)} onRemove={(i) => removeAt(setPatientIdProof, i)} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Set Password</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create strong password"
                      required
                      className="h-11 text-base pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Min. 8 characters with uppercase, lowercase, and number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      required
                      className="h-11 text-base pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="user-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="user-terms" className="text-sm font-normal cursor-pointer leading-tight">
                I agree to the Terms & Conditions and Privacy Policy, and consent to data processing for healthcare services
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1 h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              <Button type="button" variant="secondary" onClick={saveDraft} className="flex-1 sm:flex-initial h-11 text-base">Save Draft</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/onboard/login")} className="flex-1 sm:flex-initial h-11 text-base">
                Cancel
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/onboard/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterUser;
