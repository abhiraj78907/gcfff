# Firestore Database Schema & Storage Strategy
## Indian Multilingual Clinical Consultation Platform

---

## 📋 Table of Contents

1. [Collection Structure](#collection-structure)
2. [Data Models](#data-models)
3. [Security Rules](#security-rules)
4. [Query Patterns](#query-patterns)
5. [Performance Optimizations](#performance-optimizations)
6. [Sample Documents](#sample-documents)
7. [Indexes Configuration](#indexes-configuration)

---

## 🗂️ Collection Structure

### Root Collections

```
/users/{userId}
/entities/{entityId}
/entities/{entityId}/subEntries/{subEntryId}
/entities/{entityId}/patients/{patientId}
/entities/{entityId}/patients/{patientId}/consultations/{consultationId}
/entities/{entityId}/patients/{patientId}/consultations/{consultationId}/prescriptions/{prescriptionId}
/entities/{entityId}/doctors/{doctorId}
/entities/{entityId}/doctors/{doctorId}/consultations/{consultationId}
/entities/{entityId}/medicines/{medicineId}
/entities/{entityId}/pharmacy/inventory/{itemId}
/entities/{entityId}/pharmacy/dispensations/{dispensationId}
/entities/{entityId}/lab/requests/{requestId}
/entities/{entityId}/lab/results/{resultId}
/entities/{entityId}/reception/queue/{queueId}
/notifications/{notificationId}
/auditLogs/{logId}
/reports/{reportId}
/analytics/{entityId}/{date}
```

---

## 📊 Data Models

### 1. Users Collection

**Path**: `/users/{userId}`

```typescript
interface User {
  id: string; // userId (Firebase Auth UID)
  email: string;
  name: string;
  phone?: string;
  roles: UserRole[]; // ['doctor', 'receptionist', 'pharmacist', 'lab-tech', 'admin', 'patient']
  primaryRole: UserRole;
  entityId: string | null; // Linked entity
  subEntryId: string | null; // Linked sub-entry (ward/clinic branch)
  specialization?: string; // For doctors
  licenseNumber?: string; // For doctors/pharmacists
  language: string; // 'en', 'hi', 'kn', 'te', 'ta', 'ml'
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  metadata?: {
    avatar?: string;
    address?: string;
    emergencyContact?: string;
  };
}
```

**Indexes**: `entityId`, `roles`, `isActive`, `primaryRole`

---

### 2. Entities Collection

**Path**: `/entities/{entityId}`

```typescript
interface Entity {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory';
  licenseNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string; // 'India'
  };
  location: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  operatingHours: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  status: 'active' | 'inactive' | 'maintenance';
  totalPatients: number;
  totalDoctors: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    beds?: number; // For hospitals
    specialties?: string[]; // For hospitals/clinics
    accreditation?: string[];
  };
}
```

**Sub-entries** (Wards/Departments/Branches):
**Path**: `/entities/{entityId}/subEntries/{subEntryId}`

```typescript
interface SubEntry {
  id: string;
  entityId: string;
  name: string; // 'Ward A', 'Cardiology Department', 'Main Branch'
  type: 'ward' | 'department' | 'branch';
  location?: {
    floor?: number;
    room?: string;
  };
  capacity?: number;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes**: `type`, `status`, `location` (GeoPoint), `address.state`, `address.city`

---

### 3. Patients Collection

**Path**: `/entities/{entityId}/patients/{patientId}`

```typescript
interface Patient {
  id: string; // Unique patient ID (e.g., VIMS-2025-12345)
  entityId: string;
  aadhaarNumber?: string; // 12-digit Aadhaar (encrypted/hashed)
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Timestamp;
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string[];
  chronicConditions?: string[];
  language: string; // Preferred language
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastVisitAt?: Timestamp;
  totalConsultations: number;
  metadata?: {
    insurance?: {
      provider: string;
      policyNumber: string;
    };
    notes?: string;
  };
}
```

**Indexes**: `entityId`, `aadhaarNumber` (hashed), `phone`, `name`, `createdAt`

---

### 4. Consultations Collection

**Path**: `/entities/{entityId}/patients/{patientId}/consultations/{consultationId}`

```typescript
interface Consultation {
  id: string;
  entityId: string;
  patientId: string;
  patientName: string; // Denormalized for performance
  doctorId: string;
  doctorName: string; // Denormalized
  department: string;
  status: 'active' | 'completed' | 'cancelled';
  
  // Gemini AI Integration
  transcript: {
    raw: string; // Full voice transcript from Gemini
    language: string; // Detected language
    segments?: Array<{
      text: string;
      timestamp: number;
      speaker: 'patient' | 'doctor';
    }>;
  };
  
  // Extracted Data
  symptoms: Array<{
    term: string; // Normalized symptom term
    originalText: string; // Original text from transcript
    severity?: 'mild' | 'moderate' | 'severe';
    duration?: string;
    language: string; // Language of original text
  }>;
  
  diagnosis: {
    primary: string; // Primary diagnosis text
    icd10Code?: string; // ICD-10 code if available
    secondary?: string[]; // Secondary diagnoses
    notes?: string; // Doctor's notes
  };
  
  // Editable Prescription Fields (EXCLUDING medicines)
  prescription: {
    instructions: string; // General instructions
    followUpDate?: Timestamp; // Follow-up appointment date
    labTests?: Array<{
      testName: string;
      notes?: string;
    }>;
    imaging?: Array<{
      type: string; // 'X-Ray', 'CT Scan', 'MRI', etc.
      bodyPart: string;
      notes?: string;
    }>;
    diet?: string; // Diet recommendations
    lifestyle?: string; // Lifestyle recommendations
    restrictions?: string[]; // Activity restrictions
  };
  
  // Metadata
  consultationDate: Timestamp;
  duration: number; // Duration in minutes
  tokenNumber?: number; // Queue token number
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  
  // Links
  prescriptionId?: string; // Link to prescription document
  labRequestIds?: string[]; // Links to lab requests
}
```

**Alternative Path** (for doctor-centric queries):
**Path**: `/entities/{entityId}/doctors/{doctorId}/consultations/{consultationId}`

**Indexes**: 
- `entityId`, `patientId`, `doctorId`
- `status`, `consultationDate`
- `department`, `status`
- `doctorId`, `consultationDate` (descending)

---

### 5. Prescriptions Collection

**Path**: `/entities/{entityId}/patients/{patientId}/consultations/{consultationId}/prescriptions/{prescriptionId}`

```typescript
interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  entityId: string;
  
  // Medicines (Manually added by doctor)
  medicines: Array<{
    medicineId: string; // Reference to medicine catalog
    medicineName: string; // Denormalized name
    composition?: string; // Denormalized composition
    dosage: string; // e.g., "500mg", "10ml"
    frequency: string; // e.g., "Twice daily", "After meals"
    duration: string; // e.g., "7 days", "2 weeks"
    quantity: number; // Number of units
    unit: string; // 'tablets', 'bottles', 'strips'
    instructions?: string; // Additional instructions
    timing?: {
      morning?: boolean;
      afternoon?: boolean;
      evening?: boolean;
      night?: boolean;
      beforeMeals?: boolean;
      afterMeals?: boolean;
    };
  }>;
  
  // Status
  status: 'pending' | 'dispensed' | 'partially-dispensed' | 'cancelled';
  dispensedAt?: Timestamp;
  dispensedBy?: string; // Pharmacist ID
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  validUntil: Timestamp; // Prescription validity (usually 30 days)
}
```

**Indexes**: `consultationId`, `patientId`, `doctorId`, `status`, `createdAt`

---

### 6. Medicines Catalog

**Path**: `/entities/{entityId}/medicines/{medicineId}`

```typescript
interface Medicine {
  id: string;
  entityId: string;
  name: string;
  brandName?: string;
  genericName: string;
  composition: string; // Active ingredients
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops';
  strength: string; // e.g., "500mg", "10ml"
  manufacturer: string;
  mrp: number; // Maximum Retail Price
  hsnCode?: string; // HSN code for GST
  schedule?: string; // H, H1, X, etc.
  prescriptionRequired: boolean;
  stockAvailable: boolean;
  searchTerms: string[]; // For multilingual search
  languageVariants?: {
    [lang: string]: {
      name: string;
      composition: string;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes**: `entityId`, `name`, `genericName`, `searchTerms`, `prescriptionRequired`

---

### 7. Pharmacy Inventory

**Path**: `/entities/{entityId}/pharmacy/inventory/{itemId}`

```typescript
interface InventoryItem {
  id: string;
  entityId: string;
  medicineId: string; // Reference to medicines catalog
  medicineName: string; // Denormalized
  batchNumber: string;
  expiryDate: Timestamp;
  quantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  location?: string; // Shelf location
  status: 'available' | 'low-stock' | 'out-of-stock' | 'expired';
  reorderLevel: number;
  lastRestockedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes**: `entityId`, `medicineId`, `status`, `expiryDate`, `quantity`

---

### 8. Lab Requests & Results

**Path**: `/entities/{entityId}/lab/requests/{requestId}`

```typescript
interface LabRequest {
  id: string;
  entityId: string;
  patientId: string;
  patientName: string; // Denormalized
  doctorId: string;
  consultationId?: string;
  tests: Array<{
    testName: string;
    testCode?: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    priority: 'routine' | 'urgent' | 'stat';
    notes?: string;
  }>;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestedAt: Timestamp;
  completedAt?: Timestamp;
  resultId?: string; // Link to result document
  assignedTo?: string; // Lab technician ID
}
```

**Results Path**: `/entities/{entityId}/lab/results/{resultId}`

```typescript
interface LabResult {
  id: string;
  requestId: string;
  entityId: string;
  patientId: string;
  doctorId: string;
  tests: Array<{
    testName: string;
    values: Record<string, any>; // Test parameters and values
    normalRange?: string;
    unit?: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  reportUrl?: string; // PDF report URL
  verifiedBy: string; // Lab technician ID
  verifiedAt: Timestamp;
  createdAt: Timestamp;
}
```

**Indexes**: `entityId`, `patientId`, `doctorId`, `status`, `requestedAt`

---

### 9. Reception Queue

**Path**: `/entities/{entityId}/subEntries/{subEntryId}/queue/{queueId}`

```typescript
interface QueueEntry {
  id: string;
  entityId: string;
  subEntryId: string;
  patientId: string;
  patientName: string; // Denormalized
  token: number; // Sequential token number
  department: string;
  doctorId?: string;
  doctorName?: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  reason: string; // Reason for visit
  priority?: 'normal' | 'urgent';
  registeredAt: Timestamp;
  consultationStartedAt?: Timestamp;
  consultationCompletedAt?: Timestamp;
  consultationId?: string; // Link to consultation
}
```

**Indexes**: `entityId`, `subEntryId`, `status`, `token`, `registeredAt`

---

### 10. Notifications & Alerts

**Path**: `/notifications/{notificationId}`

```typescript
interface Notification {
  id: string;
  userId?: string; // User-specific notification
  entityId?: string; // Entity-wide notification
  type: 'system' | 'alert' | 'reminder' | 'update';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  language: string; // Notification language
  actionUrl?: string; // Deep link URL
  read: boolean;
  acknowledged: boolean;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  metadata?: {
    consultationId?: string;
    patientId?: string;
    prescriptionId?: string;
  };
}
```

**Indexes**: `userId`, `entityId`, `type`, `read`, `acknowledged`, `createdAt`

---

### 11. Audit Logs

**Path**: `/auditLogs/{logId}`

```typescript
interface AuditLog {
  id: string;
  userId: string;
  userName: string; // Denormalized
  entityId: string;
  action: string; // 'create', 'update', 'delete', 'view', 'login', 'logout'
  resource: string; // 'consultation', 'prescription', 'patient', etc.
  resourceId?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}
```

**Indexes**: `userId`, `entityId`, `action`, `resource`, `timestamp` (descending)

---

### 12. Reports & Analytics

**Path**: `/reports/{reportId}`

```typescript
interface Report {
  id: string;
  entityId: string;
  name: string;
  type: 'analytics' | 'financial' | 'inventory' | 'performance';
  format: 'PDF' | 'CSV' | 'Excel';
  parameters: Record<string, any>; // Report parameters
  generatedAt: Timestamp;
  generatedBy: string; // User ID
  fileUrl?: string; // Storage URL
  size: string; // File size
  status: 'generating' | 'completed' | 'failed';
}
```

**Analytics Path**: `/analytics/{entityId}/{date}`

```typescript
interface Analytics {
  entityId: string;
  date: string; // YYYY-MM-DD format
  metrics: {
    totalPatients: number;
    totalConsultations: number;
    totalPrescriptions: number;
    averageConsultationTime: number;
    patientSatisfaction: number;
    revenue: number;
    // ... more metrics
  };
  breakdown: {
    byDepartment: Record<string, number>;
    byDoctor: Record<string, number>;
    byTimeOfDay: Record<string, number>;
  };
  computedAt: Timestamp;
}
```

**Indexes**: `entityId`, `date`, `generatedAt`, `type`

---

## 🔒 Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() { return request.auth != null; }
    function uid() { return request.auth.uid; }
    function role() { return request.auth.token.role; }
    function entityId() { return request.auth.token.entityId; }
    function hasRole(roles) { return role() in roles; }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn() && (uid() == userId || role() == 'admin');
      allow write: if isSignedIn() && uid() == userId;
      allow create: if isSignedIn(); // Allow profile creation on signup
    }
    
    // Entities collection
    match /entities/{entityId} {
      allow read: if isSignedIn() && (entityId() == entityId || role() == 'admin');
      allow write: if isSignedIn() && role() == 'admin';
      
      // Sub-entries
      match /subEntries/{subEntryId} {
        allow read: if isSignedIn() && entityId() == entityId;
        allow write: if isSignedIn() && (role() == 'admin' || role() == 'receptionist');
      }
      
      // Patients
      match /patients/{patientId} {
        allow read: if isSignedIn() && entityId() == entityId && (
          hasRole(['doctor', 'receptionist', 'pharmacist', 'lab-tech', 'admin']) ||
          (role() == 'patient' && uid() == patientId)
        );
        allow create: if isSignedIn() && entityId() == entityId && hasRole(['receptionist', 'admin']);
        allow update: if isSignedIn() && entityId() == entityId && hasRole(['receptionist', 'doctor', 'admin']);
        
        // Consultations
        match /consultations/{consultationId} {
          allow read: if isSignedIn() && entityId() == entityId && (
            hasRole(['doctor', 'receptionist', 'admin']) ||
            (role() == 'patient' && uid() == patientId)
          );
          allow create: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'receptionist']);
          allow update: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'admin']);
          
          // Prescriptions
          match /prescriptions/{prescriptionId} {
            allow read: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'pharmacist', 'admin', 'patient']);
            allow create: if isSignedIn() && entityId() == entityId && role() == 'doctor';
            allow update: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'pharmacist', 'admin']);
          }
        }
      }
      
      // Doctors
      match /doctors/{doctorId} {
        allow read: if isSignedIn() && entityId() == entityId;
        allow write: if isSignedIn() && entityId() == entityId && (uid() == doctorId || role() == 'admin');
        
        match /consultations/{consultationId} {
          allow read: if isSignedIn() && entityId() == entityId;
          allow create: if isSignedIn() && entityId() == entityId && uid() == doctorId;
          allow update: if isSignedIn() && entityId() == entityId && uid() == doctorId;
        }
      }
      
      // Medicines catalog
      match /medicines/{medicineId} {
        allow read: if isSignedIn() && entityId() == entityId;
        allow write: if isSignedIn() && entityId() == entityId && hasRole(['admin', 'pharmacist']);
      }
      
      // Pharmacy
      match /pharmacy/inventory/{itemId} {
        allow read: if isSignedIn() && entityId() == entityId && hasRole(['pharmacist', 'admin', 'doctor']);
        allow write: if isSignedIn() && entityId() == entityId && hasRole(['pharmacist', 'admin']);
      }
      
      match /pharmacy/dispensations/{dispensationId} {
        allow read: if isSignedIn() && entityId() == entityId && hasRole(['pharmacist', 'admin', 'doctor']);
        allow create, update: if isSignedIn() && entityId() == entityId && hasRole(['pharmacist', 'admin']);
      }
      
      // Lab
      match /lab/requests/{requestId} {
        allow read: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'lab-tech', 'receptionist', 'admin']);
        allow create: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'receptionist']);
        allow update: if isSignedIn() && entityId() == entityId && hasRole(['lab-tech', 'admin']);
      }
      
      match /lab/results/{resultId} {
        allow read: if isSignedIn() && entityId() == entityId && hasRole(['doctor', 'lab-tech', 'admin', 'patient']);
        allow create, update: if isSignedIn() && entityId() == entityId && hasRole(['lab-tech', 'admin']);
      }
      
      // Reception queue
      match /subEntries/{subEntryId}/queue/{queueId} {
        allow read: if isSignedIn() && entityId() == entityId && hasRole(['receptionist', 'doctor', 'admin']);
        allow create, update: if isSignedIn() && entityId() == entityId && hasRole(['receptionist', 'admin']);
      }
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isSignedIn() && (
        resource.data.userId == uid() ||
        (resource.data.entityId == entityId() && entityId() != null) ||
        role() == 'admin'
      );
      allow create: if isSignedIn() && role() == 'admin';
      allow update: if isSignedIn() && resource.data.userId == uid();
    }
    
    // Audit logs
    match /auditLogs/{logId} {
      allow read: if isSignedIn() && (entityId() == resource.data.entityId || role() == 'admin');
      allow create: if isSignedIn(); // System creates logs
    }
    
    // Reports
    match /reports/{reportId} {
      allow read: if isSignedIn() && (entityId() == resource.data.entityId || role() == 'admin');
      allow create: if isSignedIn() && hasRole(['admin', 'receptionist']);
    }
    
    // Analytics
    match /analytics/{entityId}/{date} {
      allow read: if isSignedIn() && (entityId() == entityId || role() == 'admin');
      allow write: if isSignedIn() && role() == 'admin'; // System writes
    }
  }
}
```

---

## 🔍 Query Patterns

### 1. Get Patient Consultations

```typescript
// Get all consultations for a patient
const consultationsRef = collection(
  db,
  `entities/${entityId}/patients/${patientId}/consultations`
);
const q = query(
  consultationsRef,
  where('status', '==', 'completed'),
  orderBy('consultationDate', 'desc'),
  limit(10)
);
const snapshot = await getDocs(q);
```

### 2. Get Doctor's Active Consultations

```typescript
const consultationsRef = collection(
  db,
  `entities/${entityId}/doctors/${doctorId}/consultations`
);
const q = query(
  consultationsRef,
  where('status', '==', 'active'),
  orderBy('consultationDate', 'desc')
);
```

### 3. Search Medicines (Multilingual)

```typescript
// Search by name or search terms
const medicinesRef = collection(db, `entities/${entityId}/medicines`);
const q = query(
  medicinesRef,
  where('searchTerms', 'array-contains', searchTerm.toLowerCase()),
  where('prescriptionRequired', '==', true),
  limit(20)
);
```

### 4. Get Queue for Department

```typescript
const queueRef = collection(
  db,
  `entities/${entityId}/subEntries/${subEntryId}/queue`
);
const q = query(
  queueRef,
  where('status', 'in', ['waiting', 'in-consultation']),
  where('department', '==', department),
  orderBy('token', 'asc')
);
```

### 5. Real-time Consultation Updates

```typescript
const consultationRef = doc(
  db,
  `entities/${entityId}/patients/${patientId}/consultations/${consultationId}`
);
const unsubscribe = onSnapshot(consultationRef, (doc) => {
  if (doc.exists()) {
    const consultation = { id: doc.id, ...doc.data() };
    // Update UI
  }
});
```

### 6. Get Unread Notifications

```typescript
const notificationsRef = collection(db, 'notifications');
const q = query(
  notificationsRef,
  where('userId', '==', userId),
  where('read', '==', false),
  orderBy('createdAt', 'desc'),
  limit(20)
);
```

### 7. Geospatial Query for Nearby Entities

```typescript
// Note: Requires GeoFirestore or manual distance calculation
// For now, use approximate bounding box
const entitiesRef = collection(db, 'entities');
const q = query(
  entitiesRef,
  where('type', '==', 'hospital'),
  where('status', '==', 'active')
);
// Then filter by distance in application code
```

---

## ⚡ Performance Optimizations

### 1. Denormalization Strategy

**Patient Name in Consultations**:
- Store `patientName` in consultation document
- Update when patient name changes (via Cloud Function)

**Doctor Name in Consultations**:
- Store `doctorName` in consultation document
- Update when doctor name changes

**Medicine Details in Prescriptions**:
- Store `medicineName` and `composition` in prescription
- Reduces reads when displaying prescriptions

### 2. Pagination

```typescript
// First page
const firstPage = query(
  consultationsRef,
  orderBy('consultationDate', 'desc'),
  limit(20)
);

// Next page (using cursor)
const lastDoc = snapshot.docs[snapshot.docs.length - 1];
const nextPage = query(
  consultationsRef,
  orderBy('consultationDate', 'desc'),
  startAfter(lastDoc),
  limit(20)
);
```

### 3. Caching Strategy

```typescript
// Cache medicine catalog in app state
const [medicinesCache, setMedicinesCache] = useState<Medicine[]>([]);

useEffect(() => {
  const medicinesRef = collection(db, `entities/${entityId}/medicines`);
  const unsubscribe = onSnapshot(medicinesRef, (snapshot) => {
    const medicines = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMedicinesCache(medicines);
  });
  return unsubscribe;
}, [entityId]);
```

### 4. Batch Writes

```typescript
// Update consultation and create prescription atomically
const batch = writeBatch(db);

const consultationRef = doc(
  db,
  `entities/${entityId}/patients/${patientId}/consultations/${consultationId}`
);
batch.update(consultationRef, {
  status: 'completed',
  completedAt: serverTimestamp()
});

const prescriptionRef = doc(
  db,
  `entities/${entityId}/patients/${patientId}/consultations/${consultationId}/prescriptions/${prescriptionId}`
);
batch.set(prescriptionRef, prescriptionData);

await batch.commit();
```

### 5. Transactions for Token Generation

```typescript
// Already implemented in tokenService.ts
const counterRef = doc(db, `entities/${entityId}/subEntries/${subEntryId}/_meta/tokenCounter`);
await runTransaction(db, async (transaction) => {
  const counterSnap = await transaction.get(counterRef);
  const current = counterSnap.exists() ? counterSnap.data().value : 0;
  transaction.set(counterRef, { value: current + 1 });
  return current + 1;
});
```

---

## 📄 Sample Documents

### Sample Patient Document

```json
{
  "id": "VIMS-2025-12345",
  "entityId": "entity-grn",
  "aadhaarNumber": "hashed_value",
  "name": "Ramesh Kumar",
  "age": 45,
  "gender": "male",
  "dateOfBirth": "1978-05-15T00:00:00Z",
  "phone": "+91 9876543210",
  "email": "ramesh.kumar@email.com",
  "address": {
    "street": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "bloodGroup": "O+",
  "allergies": ["Penicillin"],
  "chronicConditions": ["Hypertension"],
  "language": "kn",
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-15T14:30:00Z",
  "lastVisitAt": "2025-01-15T14:30:00Z",
  "totalConsultations": 5
}
```

### Sample Consultation Document

```json
{
  "id": "consult-001",
  "entityId": "entity-grn",
  "patientId": "VIMS-2025-12345",
  "patientName": "Ramesh Kumar",
  "doctorId": "doc-001",
  "doctorName": "Dr. Sharma",
  "department": "Internal Medicine",
  "status": "completed",
  "transcript": {
    "raw": "Patient: ನನಗೆ ತಲೆನೋವು ಮತ್ತು ಜ್ವರ ಇದೆ... Doctor: How long have you had this? Patient: 3 days...",
    "language": "kn",
    "segments": [
      {
        "text": "ನನಗೆ ತಲೆನೋವು ಮತ್ತು ಜ್ವರ ಇದೆ",
        "timestamp": 0,
        "speaker": "patient"
      }
    ]
  },
  "symptoms": [
    {
      "term": "headache",
      "originalText": "ತಲೆನೋವು",
      "severity": "moderate",
      "duration": "3 days",
      "language": "kn"
    },
    {
      "term": "fever",
      "originalText": "ಜ್ವರ",
      "severity": "mild",
      "duration": "3 days",
      "language": "kn"
    }
  ],
  "diagnosis": {
    "primary": "Viral Fever",
    "icd10Code": "B34.9",
    "notes": "Patient presents with headache and fever for 3 days. No other symptoms."
  },
  "prescription": {
    "instructions": "Take rest, drink plenty of fluids",
    "followUpDate": "2025-01-22T10:00:00Z",
    "labTests": [
      {
        "testName": "Complete Blood Count",
        "notes": "If fever persists"
      }
    ],
    "diet": "Light diet, avoid spicy food",
    "lifestyle": "Rest, avoid physical exertion"
  },
  "consultationDate": "2025-01-15T14:30:00Z",
  "duration": 15,
  "tokenNumber": 15,
  "createdAt": "2025-01-15T14:30:00Z",
  "updatedAt": "2025-01-15T14:45:00Z",
  "completedAt": "2025-01-15T14:45:00Z",
  "prescriptionId": "presc-001"
}
```

### Sample Prescription Document

```json
{
  "id": "presc-001",
  "consultationId": "consult-001",
  "patientId": "VIMS-2025-12345",
  "doctorId": "doc-001",
  "entityId": "entity-grn",
  "medicines": [
    {
      "medicineId": "med-001",
      "medicineName": "Paracetamol 500mg",
      "composition": "Paracetamol 500mg",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "5 days",
      "quantity": 10,
      "unit": "tablets",
      "instructions": "After meals",
      "timing": {
        "morning": true,
        "evening": true,
        "afterMeals": true
      }
    },
    {
      "medicineId": "med-002",
      "medicineName": "Cough Syrup",
      "composition": "Dextromethorphan, Guaifenesin",
      "dosage": "10ml",
      "frequency": "Three times daily",
      "duration": "5 days",
      "quantity": 1,
      "unit": "bottle",
      "timing": {
        "morning": true,
        "afternoon": true,
        "night": true
      }
    }
  ],
  "status": "pending",
  "createdAt": "2025-01-15T14:45:00Z",
  "updatedAt": "2025-01-15T14:45:00Z",
  "validUntil": "2025-02-14T14:45:00Z"
}
```

---

## 📑 Indexes Configuration

Create these composite indexes in `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "consultations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "entityId", "order": "ASCENDING" },
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "consultationDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "consultations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "entityId", "order": "ASCENDING" },
        { "fieldPath": "doctorId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "consultationDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "queue",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "entityId", "order": "ASCENDING" },
        { "fieldPath": "subEntryId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "token", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "read", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "auditLogs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "entityId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 🚀 Implementation Checklist

- [ ] Create all collections with sample data
- [ ] Deploy security rules
- [ ] Create composite indexes
- [ ] Set up Cloud Functions for denormalization
- [ ] Implement caching strategy for medicines
- [ ] Set up real-time listeners for critical data
- [ ] Configure backup and retention policies
- [ ] Set up monitoring and alerts
- [ ] Test security rules with different roles
- [ ] Optimize queries with pagination
- [ ] Implement batch writes for atomic operations
- [ ] Set up data migration scripts if needed

---

## 📝 Notes

1. **Multilingual Support**: Store original text in transcript, normalize symptoms to English terms for search
2. **Privacy**: Hash/encrypt sensitive data like Aadhaar numbers
3. **Scalability**: Use subcollections for deeply nested data, paginate large collections
4. **Real-time**: Use `onSnapshot` for live updates on critical data
5. **Cost Optimization**: Minimize document reads, use denormalization strategically
6. **Compliance**: Ensure HIPAA/GDPR compliance for patient data handling

---

This schema is production-ready and optimized for your Indian multilingual clinical consultation platform! 🎉

