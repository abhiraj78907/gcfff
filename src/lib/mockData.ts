// Entity-scoped demo data
const medicinesByEntity: Record<string, Array<{ id: number; name: string; batch: string; supplier: string; quantity: number; reorderThreshold: number; expiry: string; price: number; category: string }>> = {
  "entity-apo": [
  { id: 1, name: "Paracetamol 500mg", batch: "PCM2024A", supplier: "PharmaCorp", quantity: 450, reorderThreshold: 100, expiry: "2025-08-15", price: 5, category: "Analgesic" },
  { id: 2, name: "Amoxicillin 250mg", batch: "AMX2024B", supplier: "MediSupply", quantity: 75, reorderThreshold: 150, expiry: "2025-03-20", price: 15, category: "Antibiotic" },
  { id: 3, name: "Metformin 500mg", batch: "MET2024C", supplier: "DiabetesCare", quantity: 320, reorderThreshold: 200, expiry: "2025-12-10", price: 8, category: "Antidiabetic" },
  { id: 4, name: "Aspirin 75mg", batch: "ASP2024D", supplier: "CardioMeds", quantity: 180, reorderThreshold: 100, expiry: "2025-06-30", price: 3, category: "Antiplatelet" },
  { id: 5, name: "Omeprazole 20mg", batch: "OME2024E", supplier: "GastroHealth", quantity: 45, reorderThreshold: 80, expiry: "2025-02-28", price: 12, category: "Antacid" },
  { id: 6, name: "Ciprofloxacin 500mg", batch: "CIP2024F", supplier: "AntiBio Ltd", quantity: 200, reorderThreshold: 120, expiry: "2025-09-15", price: 20, category: "Antibiotic" },
  { id: 7, name: "Losartan 50mg", batch: "LOS2024G", supplier: "CardioMeds", quantity: 150, reorderThreshold: 100, expiry: "2025-07-20", price: 18, category: "Antihypertensive" },
  { id: 8, name: "Cetirizine 10mg", batch: "CET2024H", supplier: "AllergyFree", quantity: 280, reorderThreshold: 150, expiry: "2025-11-05", price: 6, category: "Antihistamine" },
  ],
  "entity-grn": [
  { id: 1, name: "Ibuprofen 400mg", batch: "IBU2024A", supplier: "WellMeds", quantity: 190, reorderThreshold: 80, expiry: "2025-04-11", price: 7, category: "Analgesic" },
  { id: 2, name: "Azithromycin 500mg", batch: "AZI2024B", supplier: "HealFast", quantity: 95, reorderThreshold: 120, expiry: "2025-10-09", price: 22, category: "Antibiotic" },
  { id: 3, name: "Atorvastatin 10mg", batch: "ATO2024C", supplier: "CardioPlus", quantity: 210, reorderThreshold: 100, expiry: "2025-06-01", price: 9, category: "Statin" },
  { id: 4, name: "Levocetirizine 5mg", batch: "LEVO2024D", supplier: "AllergyFree", quantity: 130, reorderThreshold: 60, expiry: "2025-12-30", price: 5, category: "Antihistamine" },
  ],
  "entity-med": [
  { id: 1, name: "Pantoprazole 40mg", batch: "PAN2024A", supplier: "GastroHealth", quantity: 520, reorderThreshold: 150, expiry: "2025-03-21", price: 10, category: "Antacid" },
  { id: 2, name: "Dolo 650", batch: "DOLO2024B", supplier: "PharmaCorp", quantity: 610, reorderThreshold: 200, expiry: "2025-09-19", price: 6, category: "Analgesic" },
  { id: 3, name: "Cetirizine 10mg", batch: "CET2024M1", supplier: "AllergyFree", quantity: 340, reorderThreshold: 120, expiry: "2025-08-02", price: 6, category: "Antihistamine" },
  ],
};

export const getMedicinesByEntity = (entityId?: string | null) => medicinesByEntity[entityId ?? ""] ?? [];

const prescriptionsByEntity: Record<string, Array<{ id: string; patientId: string; patientName: string; doctor: string; hospital: string; date: string; medicines: Array<{ name: string; dosage: string; timing: string; quantity: number; inStock: boolean }>; status: string; total: number }>> = {
  "entity-apo": [
  {
    id: "RX001",
    patientId: "PT12345",
    patientName: "Rajesh Kumar",
    doctor: "Dr. Sharma",
    hospital: "Apollo Hospital",
    date: "2024-01-15",
    medicines: [
      { name: "Paracetamol 500mg", dosage: "1-0-1", timing: "After Food", quantity: 10, inStock: true },
      { name: "Amoxicillin 250mg", dosage: "1-1-1", timing: "Before Food", quantity: 15, inStock: true },
    ],
    status: "pending",
    total: 275
  },
  ],
  "entity-grn": [
  {
    id: "RX002",
    patientId: "PT12346",
    patientName: "Leela Nair",
    doctor: "Dr. Menon",
    hospital: "GreenLife Clinic",
    date: "2024-01-15",
    medicines: [
      { name: "Atorvastatin 10mg", dosage: "0-1-0", timing: "After Food", quantity: 30, inStock: true },
      { name: "Levocetirizine 5mg", dosage: "0-0-1", timing: "Night", quantity: 10, inStock: true },
    ],
    status: "completed",
    total: 330
  },
  ],
  "entity-med": [
  {
    id: "RX003",
    patientId: "PT12347",
    patientName: "Rohan Deshmukh",
    doctor: "Dr. Kulkarni",
    hospital: "MediTown Pharmacy",
    date: "2024-01-14",
    medicines: [
      { name: "Pantoprazole 40mg", dosage: "1-0-0", timing: "Before Food", quantity: 14, inStock: true },
    ],
    status: "pending",
    total: 168
  },
  ],
};

export const getPrescriptionsByEntity = (entityId?: string | null) => prescriptionsByEntity[entityId ?? ""] ?? [];

const salesByEntity: Record<string, Array<{ date: string; sales: number }>> = {
  "entity-apo": [
  { date: "Mon", sales: 12500 },
  { date: "Tue", sales: 15200 },
  { date: "Wed", sales: 13800 },
  { date: "Thu", sales: 16500 },
  { date: "Fri", sales: 18200 },
  { date: "Sat", sales: 21000 },
  { date: "Sun", sales: 19500 },
  ],
  "entity-grn": [
  { date: "Mon", sales: 8200 },
  { date: "Tue", sales: 9400 },
  { date: "Wed", sales: 8800 },
  { date: "Thu", sales: 9900 },
  { date: "Fri", sales: 10400 },
  { date: "Sat", sales: 11200 },
  { date: "Sun", sales: 9000 },
  ],
  "entity-med": [
  { date: "Mon", sales: 15400 },
  { date: "Tue", sales: 16300 },
  { date: "Wed", sales: 17100 },
  { date: "Thu", sales: 18050 },
  { date: "Fri", sales: 19700 },
  { date: "Sat", sales: 22300 },
  { date: "Sun", sales: 20500 },
  ],
};

export const getSalesByEntity = (entityId?: string | null) => salesByEntity[entityId ?? ""] ?? [];

const topMedicinesByEntity: Record<string, Array<{ name: string; sold: number }>> = {
  "entity-apo": [
    { name: "Paracetamol", sold: 450 },
    { name: "Metformin", sold: 320 },
    { name: "Cetirizine", sold: 280 },
  ],
  "entity-grn": [
    { name: "Atorvastatin", sold: 210 },
    { name: "Levocetirizine", sold: 165 },
    { name: "Azithromycin", sold: 140 },
  ],
  "entity-med": [
    { name: "Dolo 650", sold: 610 },
    { name: "Pantoprazole", sold: 520 },
    { name: "Cetirizine", sold: 340 },
  ],
};

export const getTopMedicinesByEntity = (entityId?: string | null) => topMedicinesByEntity[entityId ?? ""] ?? [];

export const mockSuppliers = [
  { id: 1, name: "PharmaCorp", rating: 4.5, deliveryTime: "2-3 days", contact: "+91 98765 43210", medicines: 45 },
  { id: 2, name: "MediSupply", rating: 4.8, deliveryTime: "1-2 days", contact: "+91 98765 43211", medicines: 38 },
  { id: 3, name: "DiabetesCare", rating: 4.3, deliveryTime: "3-4 days", contact: "+91 98765 43212", medicines: 22 },
  { id: 4, name: "CardioMeds", rating: 4.6, deliveryTime: "2-3 days", contact: "+91 98765 43213", medicines: 31 },
  { id: 5, name: "GastroHealth", rating: 4.2, deliveryTime: "3-5 days", contact: "+91 98765 43214", medicines: 18 },
];

export const mockOrders = [
  { id: "ORD001", supplier: "PharmaCorp", items: 5, total: 12500, status: "In Transit", eta: "2024-01-17" },
  { id: "ORD002", supplier: "MediSupply", items: 3, total: 8200, status: "Processing", eta: "2024-01-18" },
  { id: "ORD003", supplier: "CardioMeds", items: 4, total: 9800, status: "Delivered", eta: "2024-01-15" },
];

const doctorRxByEntity: Record<string, Array<{ doctor: string; prescriptions: number }>> = {
  "entity-apo": [
    { doctor: "Dr. Sharma", prescriptions: 45 },
    { doctor: "Dr. Patel", prescriptions: 38 },
  ],
  "entity-grn": [
    { doctor: "Dr. Menon", prescriptions: 27 },
    { doctor: "Dr. Rao", prescriptions: 19 },
  ],
  "entity-med": [
    { doctor: "Dr. Kulkarni", prescriptions: 34 },
  ],
};

export const getDoctorPrescriptionsByEntity = (entityId?: string | null) => doctorRxByEntity[entityId ?? ""] ?? [];

export const mockRevenueData = [
  { month: "Jul", revenue: 125000, profit: 32000 },
  { month: "Aug", revenue: 138000, profit: 35500 },
  { month: "Sep", revenue: 142000, profit: 37200 },
  { month: "Oct", revenue: 155000, profit: 41500 },
  { month: "Nov", revenue: 168000, profit: 45200 },
  { month: "Dec", revenue: 182000, profit: 49800 },
];

// Patients per entity (demographics unique)
const patientsByEntity: Record<string, Array<{ id: string; name: string; gender: string; age: number }>> = {
  "entity-apo": [
    { id: "AP-P001", name: "Rajesh Kumar", gender: "M", age: 46 },
    { id: "AP-P002", name: "Priya Sharma", gender: "F", age: 34 },
  ],
  "entity-grn": [
    { id: "GR-P001", name: "Leela Nair", gender: "F", age: 29 },
    { id: "GR-P002", name: "Arjun Rao", gender: "M", age: 38 },
  ],
  "entity-med": [
    { id: "MD-P001", name: "Rohan Deshmukh", gender: "M", age: 41 },
    { id: "MD-P002", name: "Sneha Patil", gender: "F", age: 36 },
  ],
};
export const getPatientsByEntity = (entityId?: string | null) => patientsByEntity[entityId ?? ""] ?? [];

// Lab orders and recent urgent per entity
const labWeeklyByEntity: Record<string, Array<{ day: string; tests: number }>> = {
  "entity-apo": [
    { day: "Mon", tests: 24 }, { day: "Tue", tests: 32 }, { day: "Wed", tests: 28 }, { day: "Thu", tests: 35 }, { day: "Fri", tests: 29 }, { day: "Sat", tests: 18 }, { day: "Sun", tests: 12 },
  ],
  "entity-grn": [
    { day: "Mon", tests: 10 }, { day: "Tue", tests: 12 }, { day: "Wed", tests: 9 }, { day: "Thu", tests: 14 }, { day: "Fri", tests: 11 }, { day: "Sat", tests: 6 }, { day: "Sun", tests: 4 },
  ],
  "entity-med": [
    { day: "Mon", tests: 5 }, { day: "Tue", tests: 7 }, { day: "Wed", tests: 6 }, { day: "Thu", tests: 8 }, { day: "Fri", tests: 7 }, { day: "Sat", tests: 3 }, { day: "Sun", tests: 2 },
  ],
};
export const getLabWeeklyByEntity = (entityId?: string | null) => labWeeklyByEntity[entityId ?? ""] ?? [];

const labRecentUrgentByEntity: Record<string, Array<{ id: string; patient: string; test: string; urgency: "urgent" | "routine"; date: string }>> = {
  "entity-apo": [
    { id: "AP-LR-001", patient: "Rajesh Kumar", test: "CBC", urgency: "urgent", date: "2025-11-03" },
    { id: "AP-LR-002", patient: "Priya Sharma", test: "FBS", urgency: "routine", date: "2025-11-03" },
  ],
  "entity-grn": [
    { id: "GR-LR-001", patient: "Leela Nair", test: "Lipid Profile", urgency: "urgent", date: "2025-11-03" },
  ],
  "entity-med": [
    { id: "MD-LR-001", patient: "Rohan Deshmukh", test: "HbA1c", urgency: "routine", date: "2025-11-03" },
  ],
};
export const getLabRecentUrgentByEntity = (entityId?: string | null) => labRecentUrgentByEntity[entityId ?? ""] ?? [];

// Receptionist queue per entity
const receptionistQueueByEntity: Record<string, Array<{ token: string; patient: string; department: string; status: string }>> = {
  "entity-apo": [
    { token: "AP-Q101", patient: "Rajesh Kumar", department: "Cardiology", status: "waiting" },
    { token: "AP-Q102", patient: "Priya Sharma", department: "General", status: "called" },
  ],
  "entity-grn": [
    { token: "GR-Q201", patient: "Leela Nair", department: "General", status: "waiting" },
  ],
  "entity-med": [
    { token: "MD-Q301", patient: "Rohan Deshmukh", department: "Pharmacy", status: "waiting" },
  ],
};
export const getReceptionQueueByEntity = (entityId?: string | null) => receptionistQueueByEntity[entityId ?? ""] ?? [];

