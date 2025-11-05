import { useState, useEffect } from "react";
import { Button } from "@seva/components/ui/button";
import { useToast } from "@seva/hooks/use-toast";
import { RegistrationHeader } from "@seva/components/registration/RegistrationHeader";
import { PatientSearchBar } from "@seva/components/registration/PatientSearchBar";
import { PatientInfoSection } from "@seva/components/registration/PatientInfoSection";
import { HospitalDetailsSection } from "@seva/components/registration/HospitalDetailsSection";
import { ClinicalDetailsSection } from "@seva/components/registration/ClinicalDetailsSection";
import { FollowUpSection } from "@seva/components/registration/FollowUpSection";
import { RegistrationSuccessModal } from "@seva/components/registration/RegistrationSuccessModal";

const PatientRegistration = () => {
  const { toast } = useToast();
  const [tokenNumber, setTokenNumber] = useState("");
  const [department, setDepartment] = useState("General Medicine");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [showFollowUpAlert, setShowFollowUpAlert] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    guardian: "",
    mobile: "",
    address: "",
    occupation: "",
    uhid: "",
    regDateTime: "",
    unit: "",
    room: "",
    billingType: "",
    patientType: "",
    fee: "",
    preparedBy: "Receptionist - Priya Sharma",
    symptoms: "",
    clinicalHistory: "",
    doctor: "",
    assessmentDateTime: "",
    followUp: "",
    consent: false,
  });

  // Auto-generate token and UHID on component mount
  useEffect(() => {
    const today = new Date();
    const token = `OPD${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const uhid = `UH${today.getFullYear()}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    const currentDateTime = new Date().toISOString().slice(0, 16);
    
    setTokenNumber(token);
    setFormData(prev => ({
      ...prev,
      uhid,
      regDateTime: currentDateTime,
      assessmentDateTime: currentDateTime,
    }));
  }, []);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Check follow-up date for alert
    if (field === "followUp" && value) {
      const followUpDate = new Date(value);
      const today = new Date();
      const diffDays = Math.ceil((followUpDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setShowFollowUpAlert(diffDays <= 7 && diffDays >= 0);
    }
  };

  const toggleSymptomChip = (value: string) => {
    setSelectedChips((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Mock search functionality
  };

  const validateForm = () => {
    const requiredFields = {
      name: "Full Name",
      gender: "Gender",
      age: "Age",
      address: "Address",
      unit: "Consulting Unit",
      room: "Room Number",
      billingType: "Billing Type",
      patientType: "Patient Type",
      fee: "Fee",
      symptoms: "Symptoms",
      doctor: "Doctor",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Required Field Missing",
          description: `Please fill in ${label}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    // Mock registration
    const regData = {
      uhid: formData.uhid,
      token: tokenNumber,
      doctor: formData.doctor,
      patientName: formData.name,
      room: formData.room,
    };

    setRegistrationData(regData);
    setShowSuccessModal(true);

    toast({
      title: "Registration Successful",
      description: `Patient ${formData.name} registered with token ${tokenNumber}`,
    });
  };

  const handleClearAll = () => {
    setFormData({
      ...formData,
      name: "",
      gender: "",
      age: "",
      guardian: "",
      mobile: "",
      address: "",
      occupation: "",
      unit: "",
      room: "",
      billingType: "",
      patientType: "",
      fee: "",
      symptoms: "",
      clinicalHistory: "",
      doctor: "",
      followUp: "",
      consent: false,
    });
    setSelectedChips([]);
    setShowFollowUpAlert(false);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    handleClearAll();
    // Generate new token for next patient
    const today = new Date();
    const newToken = `OPD${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setTokenNumber(newToken);
  };

  return (
    <div className="max-w-5xl space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Out Patient Registration (OPD)</h1>
        <p className="text-muted-foreground mt-1">
          Register new patients for consultation - all fields marked with * are required
        </p>
      </div>

      <PatientSearchBar onSearch={handleSearch} />

      <RegistrationHeader
        tokenNumber={tokenNumber}
        department={department}
        onDepartmentChange={setDepartment}
      />

      <div className="flex justify-end gap-3">
        <Button onClick={handleRegister} size="lg" className="min-w-[200px]">
          Register Patient
        </Button>
      </div>

      <PatientInfoSection formData={formData} onChange={handleFormChange} />

      <HospitalDetailsSection formData={formData} onChange={handleFormChange} />

      <ClinicalDetailsSection
        formData={formData}
        onChange={handleFormChange}
        selectedChips={selectedChips}
        onChipToggle={toggleSymptomChip}
      />

      <FollowUpSection
        formData={formData}
        onChange={handleFormChange}
        showFollowUpAlert={showFollowUpAlert}
      />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleClearAll} size="lg">
          Clear All
        </Button>
        <Button onClick={handleRegister} size="lg" className="min-w-[200px]">
          Register Patient
        </Button>
      </div>

      {registrationData && (
        <RegistrationSuccessModal
          open={showSuccessModal}
          onClose={handleModalClose}
          registrationData={registrationData}
        />
      )}
    </div>
  );
};

export default PatientRegistration;
