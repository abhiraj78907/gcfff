export const mockMedicines = [
  { id: 1, name: "Paracetamol 500mg", batch: "PCM2024A", supplier: "PharmaCorp", quantity: 450, reorderThreshold: 100, expiry: "2025-08-15", price: 5, category: "Analgesic" },
  { id: 2, name: "Amoxicillin 250mg", batch: "AMX2024B", supplier: "MediSupply", quantity: 75, reorderThreshold: 150, expiry: "2025-03-20", price: 15, category: "Antibiotic" },
  { id: 3, name: "Metformin 500mg", batch: "MET2024C", supplier: "DiabetesCare", quantity: 320, reorderThreshold: 200, expiry: "2025-12-10", price: 8, category: "Antidiabetic" },
  { id: 4, name: "Aspirin 75mg", batch: "ASP2024D", supplier: "CardioMeds", quantity: 180, reorderThreshold: 100, expiry: "2025-06-30", price: 3, category: "Antiplatelet" },
  { id: 5, name: "Omeprazole 20mg", batch: "OME2024E", supplier: "GastroHealth", quantity: 45, reorderThreshold: 80, expiry: "2025-02-28", price: 12, category: "Antacid" },
  { id: 6, name: "Ciprofloxacin 500mg", batch: "CIP2024F", supplier: "AntiBio Ltd", quantity: 200, reorderThreshold: 120, expiry: "2025-09-15", price: 20, category: "Antibiotic" },
  { id: 7, name: "Losartan 50mg", batch: "LOS2024G", supplier: "CardioMeds", quantity: 150, reorderThreshold: 100, expiry: "2025-07-20", price: 18, category: "Antihypertensive" },
  { id: 8, name: "Cetirizine 10mg", batch: "CET2024H", supplier: "AllergyFree", quantity: 280, reorderThreshold: 150, expiry: "2025-11-05", price: 6, category: "Antihistamine" },
];

export const mockPrescriptions = [
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
  {
    id: "RX002",
    patientId: "PT12346",
    patientName: "Priya Singh",
    doctor: "Dr. Patel",
    hospital: "Max Hospital",
    date: "2024-01-15",
    medicines: [
      { name: "Metformin 500mg", dosage: "1-0-1", timing: "After Food", quantity: 30, inStock: true },
      { name: "Aspirin 75mg", dosage: "0-0-1", timing: "After Food", quantity: 30, inStock: true },
    ],
    status: "completed",
    total: 330
  },
  {
    id: "RX003",
    patientId: "PT12347",
    patientName: "Amit Verma",
    doctor: "Dr. Gupta",
    hospital: "Fortis Hospital",
    date: "2024-01-14",
    medicines: [
      { name: "Omeprazole 20mg", dosage: "1-0-0", timing: "Before Food", quantity: 14, inStock: false },
    ],
    status: "pending",
    total: 168
  },
];

export const mockSalesData = [
  { date: "Mon", sales: 12500 },
  { date: "Tue", sales: 15200 },
  { date: "Wed", sales: 13800 },
  { date: "Thu", sales: 16500 },
  { date: "Fri", sales: 18200 },
  { date: "Sat", sales: 21000 },
  { date: "Sun", sales: 19500 },
];

export const mockTopMedicines = [
  { name: "Paracetamol", sold: 450 },
  { name: "Metformin", sold: 320 },
  { name: "Cetirizine", sold: 280 },
  { name: "Ciprofloxacin", sold: 200 },
  { name: "Losartan", sold: 150 },
  { name: "Aspirin", sold: 180 },
  { name: "Amoxicillin", sold: 175 },
  { name: "Omeprazole", sold: 145 },
];

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

export const mockDoctorPrescriptions = [
  { doctor: "Dr. Sharma", prescriptions: 45 },
  { doctor: "Dr. Patel", prescriptions: 38 },
  { doctor: "Dr. Gupta", prescriptions: 32 },
  { doctor: "Dr. Reddy", prescriptions: 28 },
  { doctor: "Dr. Mehta", prescriptions: 25 },
];

export const mockRevenueData = [
  { month: "Jul", revenue: 125000, profit: 32000 },
  { month: "Aug", revenue: 138000, profit: 35500 },
  { month: "Sep", revenue: 142000, profit: 37200 },
  { month: "Oct", revenue: 155000, profit: 41500 },
  { month: "Nov", revenue: 168000, profit: 45200 },
  { month: "Dec", revenue: 182000, profit: 49800 },
];
