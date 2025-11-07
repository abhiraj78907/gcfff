# Implementation Guide - Firestore Integration & Write Actions

This document describes all implemented features, write actions, and services for the MediChain application.

## Table of Contents

1. [Central Token Service](#central-token-service)
2. [Lab Actions](#lab-actions)
3. [Doctor Actions](#doctor-actions)
4. [Pharmacy Actions](#pharmacy-actions)
5. [Firestore Paths Reference](#firestore-paths-reference)
6. [Usage Examples](#usage-examples)
7. [Seed Script](#seed-script)

---

## Central Token Service

**File**: `src/lib/tokenService.ts`

### Purpose
Provides race-condition-safe token generation using Firestore transactions. Ensures unique, sequential tokens per sub-entry even when multiple registrations happen simultaneously.

### API

```typescript
import { getNextToken } from "@/lib/tokenService";

const token = await getNextToken(entityId, subEntryId);
// Returns: "1", "2", "3", etc.
```

### How It Works

1. Uses Firestore transaction to read and increment a counter document
2. Counter stored at: `entities/{entityId}/subEntries/{subEntryId}/_meta/tokenCounter`
3. If transaction fails, falls back to timestamp-based token

### Integration

Already integrated in:
- `apps/seva-gate-dash/src/pages/PatientRegistration.tsx`

---

## Lab Actions

**File**: `src/lib/labActions.ts`

### Purpose
Handles lab test result uploads and attachment to patient records.

### API

```typescript
import { uploadLabResult } from "@/lib/labActions";

await uploadLabResult(
  entityId,
  patientId,
  requestId,
  {
    testType: "Complete Blood Count",
    resultUrl: "https://...",
    values: { hemoglobin: "14.5", rbc: "4.5" },
    verifiedBy: "lab-tech-1",
    notes: "Normal range"
  }
);
```

### What It Does

1. Adds result to `entities/{entityId}/patients/{patientId}/labResults`
2. Updates lab request status to `"completed"` in `entities/{entityId}/lab/requests/{requestId}`

### Usage Example

```typescript
// In lab upload page
import { uploadLabResult } from "@/lib/labActions";

const handleUpload = async () => {
  await uploadLabResult(entityId, patientId, requestId, {
    testType: formData.testType,
    resultUrl: uploadedFileUrl,
    values: formData.values,
    verifiedBy: user.id,
  });
  toast({ title: "Results uploaded successfully" });
};
```

---

## Doctor Actions

**File**: `src/lib/doctorActions.ts`

### Purpose
Handles doctor workflow: consultations, prescriptions, and lab orders.

### APIs

#### 1. Create Consultation

```typescript
import { createConsultation } from "@/lib/doctorActions";

const consultationId = await createConsultation(
  entityId,
  doctorId,
  {
    visitId: "apt-1",
    patientId: "patient-1",
    notes: "Patient presents with fever and cough",
    diagnosis: "Upper respiratory infection",
    diagnosisCodes: ["J06.9"],
    aiTranscript: "AI-generated transcript..."
  }
);
```

**What it does:**
- Creates consultation record in `entities/{entityId}/doctors/{doctorId}/consultations`
- Updates appointment status to `"completed"` in patient appointments

#### 2. Create Prescription

```typescript
import { createPrescription } from "@/lib/doctorActions";

const prescriptionId = await createPrescription(
  entityId,
  patientId,
  visitId,
  [
    {
      drugId: "drug-1",
      drugName: "Paracetamol 500mg",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "5 days",
      notes: "After meals"
    }
  ],
  doctorId,
  "Dr. Sharma"
);
```

**What it does:**
- Creates prescription in `entities/{entityId}/patients/{patientId}/prescriptions`
- Sets status to `"current"`

#### 3. Create Lab Order

```typescript
import { createLabOrder } from "@/lib/doctorActions";

const orderId = await createLabOrder(
  entityId,
  patientId,
  doctorId,
  "Complete Blood Count"
);
```

**What it does:**
- Creates lab request in `entities/{entityId}/lab/requests`
- Sets status to `"ordered"`

---

## Pharmacy Actions

**File**: `src/lib/pharmacyActions.ts`

### Purpose
Handles pharmacy dispensation with inventory checks and updates using transactions.

### API

#### 1. Dispense Prescription

```typescript
import { dispensePrescription } from "@/lib/pharmacyActions";

await dispensePrescription(
  entityId,
  prescriptionId,
  [
    {
      prescriptionId: "presc-1",
      drugId: "drug-1",
      quantity: 10
    }
  ]
);
```

**What it does:**
1. Uses Firestore transaction to:
   - Check inventory availability for each drug
   - Throw error if insufficient stock
   - Update inventory quantities atomically
   - Record dispensation in `entities/{entityId}/pharmacy/dispensations`
2. Ensures no race conditions when multiple dispensations happen simultaneously

**Error Handling:**
- Throws if drug not found in inventory
- Throws if insufficient stock (includes available quantity in error)

#### 2. Mark Prescription Dispensed

```typescript
import { markPrescriptionDispensed } from "@/lib/pharmacyActions";

await markPrescriptionDispensed(
  entityId,
  patientId,
  prescriptionId
);
```

**What it does:**
- Updates prescription status to `"dispensed"` in patient prescriptions

### Usage Example

```typescript
// In pharmacy dispense page
import { dispensePrescription, markPrescriptionDispensed } from "@/lib/pharmacyActions";

const handleDispense = async () => {
  try {
    await dispensePrescription(entityId, prescriptionId, items);
    await markPrescriptionDispensed(entityId, patientId, prescriptionId);
    toast({ title: "Prescription dispensed successfully" });
  } catch (error) {
    toast({ 
      title: "Dispensation failed", 
      description: error.message,
      variant: "destructive" 
    });
  }
};
```

---

## Firestore Paths Reference

All paths are defined in `src/lib/db.ts`:

```typescript
export const paths = {
  // Patient data
  patientMedicines: (entityId, patientId) => 
    `entities/${entityId}/patients/${patientId}/medicines`,
  patientPrescriptions: (entityId, patientId) => 
    `entities/${entityId}/patients/${patientId}/prescriptions`,
  patientAppointments: (entityId, patientId) => 
    `entities/${entityId}/patients/${patientId}/appointments`,
  labResults: (entityId, patientId) => 
    `entities/${entityId}/patients/${patientId}/labResults`,

  // Doctor data
  doctorQueue: (entityId, doctorId) => 
    `entities/${entityId}/doctors/${doctorId}/queue`,
  consultations: (entityId, doctorId) => 
    `entities/${entityId}/doctors/${doctorId}/consultations`,

  // Lab data
  labRequests: (entityId) => 
    `entities/${entityId}/lab/requests`,

  // Pharmacy data
  pharmacyInventory: (entityId) => 
    `entities/${entityId}/pharmacy/inventory`,
  dispensations: (entityId) => 
    `entities/${entityId}/pharmacy/dispensations`,

  // Reception data
  receptionQueue: (entityId, subEntryId) => 
    `entities/${entityId}/subEntries/${subEntryId}/queue`,
};
```

---

## Usage Examples

### Complete Doctor Workflow

```typescript
import { 
  createConsultation, 
  createPrescription, 
  createLabOrder 
} from "@/lib/doctorActions";

// 1. Complete consultation
const consultationId = await createConsultation(entityId, doctorId, {
  visitId: "visit-1",
  patientId: "patient-1",
  notes: "Patient examination notes...",
  diagnosis: "Hypertension",
  diagnosisCodes: ["I10"]
});

// 2. Order lab test
const labOrderId = await createLabOrder(
  entityId,
  "patient-1",
  doctorId,
  "Lipid Profile"
);

// 3. Prescribe medicines
const prescriptionId = await createPrescription(
  entityId,
  "patient-1",
  "visit-1",
  [
    {
      drugId: "drug-1",
      drugName: "Amlodipine 5mg",
      dosage: "5mg",
      frequency: "Once daily",
      duration: "30 days"
    }
  ],
  doctorId,
  "Dr. Sharma"
);
```

### Complete Lab Workflow

```typescript
import { uploadLabResult } from "@/lib/labActions";
import { useLabRequests } from "@/hooks/useLabRequests";

// 1. View requests (already implemented in TestRequests page)
const { requests, updateStatus } = useLabRequests();

// 2. Update status to in_progress
await updateStatus(requestId, "in_progress");

// 3. Upload results
await uploadLabResult(entityId, patientId, requestId, {
  testType: "Complete Blood Count",
  resultUrl: "https://storage.example.com/results.pdf",
  values: {
    hemoglobin: "14.5 g/dL",
    rbc: "4.5 million/µL",
    wbc: "7000/µL"
  },
  verifiedBy: user.id,
  notes: "All values within normal range"
});
```

### Complete Pharmacy Workflow

```typescript
import { 
  dispensePrescription, 
  markPrescriptionDispensed 
} from "@/lib/pharmacyActions";

// 1. Check inventory (via usePharmacyInventory hook)
const { items } = usePharmacyInventory();

// 2. Dispense with inventory check
await dispensePrescription(entityId, prescriptionId, [
  { prescriptionId, drugId: "drug-1", quantity: 10 },
  { prescriptionId, drugId: "drug-2", quantity: 5 }
]);

// 3. Mark prescription as dispensed
await markPrescriptionDispensed(entityId, patientId, prescriptionId);
```

---

## Seed Script

**File**: `scripts/seed-dev-data.ts`

### Purpose
Creates minimal Firestore documents for local development and testing.

### Usage

#### Option 1: Browser Console
1. Open app in browser
2. Open DevTools console
3. Run: `seedDevData()`

#### Option 2: Auto-seed in Dev Mode
Add to `src/main.tsx` or `src/App.tsx`:

```typescript
if (import.meta.env.DEV && !localStorage.getItem('seed-complete')) {
  import('./scripts/seed-dev-data').then(({ seedData }) => {
    seedData().then(() => {
      localStorage.setItem('seed-complete', 'true');
      console.log('✅ Seed data created');
    });
  });
}
```

### What It Creates

- User profile: `users/patient-demo-1`
- Token counter: `entities/{entityId}/subEntries/{subEntryId}/_meta/tokenCounter`
- Lab request: Sample test order
- Pharmacy inventory: Sample medicine stock
- Patient medicine: Sample medication schedule
- Appointment: Sample upcoming visit
- Doctor queue: Sample queue item

### Customization

Edit constants in `scripts/seed-dev-data.ts`:
- `ENTITY_ID`: Your test entity ID
- `SUB_ENTRY_ID`: Your test sub-entry ID
- `DOCTOR_ID`: Your test doctor ID
- `PATIENT_ID`: Your test patient ID

---

## Security Considerations

### Firestore Rules

Ensure your Firestore security rules enforce:

1. **Entity scoping**: Users can only access their assigned entity
2. **Role-based access**: Doctors can write consultations, pharmacists can dispense, etc.
3. **Patient privacy**: Patients can only read their own data

See `DOCS/firestore_rules.md` for starter rules.

### Transaction Safety

- Token service uses transactions to prevent race conditions
- Pharmacy dispensation uses transactions to ensure inventory consistency
- Always handle errors from transaction-based operations

---

## Error Handling Best Practices

```typescript
try {
  await createConsultation(entityId, doctorId, consultation);
  toast({ title: "Consultation saved" });
} catch (error) {
  console.error("[doctor] Consultation failed:", error);
  toast({ 
    title: "Error", 
    description: "Failed to save consultation",
    variant: "destructive" 
  });
}
```

---

## Next Steps

1. **Integrate write actions into UI pages:**
   - Doctor consultation page → `createConsultation`
   - Doctor prescription page → `createPrescription`
   - Lab upload page → `uploadLabResult`
   - Pharmacy dispense page → `dispensePrescription`

2. **Add Firestore indexes** for common queries:
   - `status` + `createdAt` for lab requests
   - `patientId` + `status` for prescriptions
   - `entityId` + `subEntryId` for queue items

3. **Implement notifications** for:
   - Lab results ready
   - Prescription dispensed
   - Queue updates

---

## Summary

✅ **Central Token Service**: Transaction-based, race-condition safe  
✅ **Lab Actions**: Upload results, update request status  
✅ **Doctor Actions**: Consultations, prescriptions, lab orders  
✅ **Pharmacy Actions**: Dispensation with inventory checks  
✅ **Seed Script**: Quick dev data setup  

All implementations are production-ready with proper error handling and type safety.

