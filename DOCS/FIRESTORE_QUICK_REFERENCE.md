# Firestore Quick Reference Guide

## 📍 Collection Paths

```typescript
// Users
/users/{userId}

// Entities
/entities/{entityId}
/entities/{entityId}/subEntries/{subEntryId}

// Patients
/entities/{entityId}/patients/{patientId}
/entities/{entityId}/patients/{patientId}/consultations/{consultationId}
/entities/{entityId}/patients/{patientId}/consultations/{consultationId}/prescriptions/{prescriptionId}

// Doctors
/entities/{entityId}/doctors/{doctorId}
/entities/{entityId}/doctors/{doctorId}/consultations/{consultationId}

// Medicines & Pharmacy
/entities/{entityId}/medicines/{medicineId}
/entities/{entityId}/pharmacy/inventory/{itemId}
/entities/{entityId}/pharmacy/dispensations/{dispensationId}

// Lab
/entities/{entityId}/lab/requests/{requestId}
/entities/{entityId}/lab/results/{resultId}

// Queue
/entities/{entityId}/subEntries/{subEntryId}/queue/{queueId}

// System
/notifications/{notificationId}
/auditLogs/{logId}
/reports/{reportId}
/analytics/{entityId}/{date}
```

## 🔑 Common Queries

### Get Patient Consultations
```typescript
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
```

### Get Doctor's Active Consultations
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

### Search Medicines (Multilingual)
```typescript
const medicinesRef = collection(db, `entities/${entityId}/medicines`);
const q = query(
  medicinesRef,
  where('searchTerms', 'array-contains', searchTerm.toLowerCase()),
  where('prescriptionRequired', '==', true),
  limit(20)
);
```

### Get Queue for Department
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

### Real-time Consultation Updates
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

## 📝 Common Operations

### Create Consultation
```typescript
const consultationRef = doc(
  collection(db, `entities/${entityId}/patients/${patientId}/consultations`)
);
await setDoc(consultationRef, {
  ...consultationData,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
```

### Update Consultation Status
```typescript
const consultationRef = doc(
  db,
  `entities/${entityId}/patients/${patientId}/consultations/${consultationId}`
);
await updateDoc(consultationRef, {
  status: 'completed',
  completedAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
```

### Create Prescription
```typescript
const prescriptionRef = doc(
  collection(
    db,
    `entities/${entityId}/patients/${patientId}/consultations/${consultationId}/prescriptions`
  )
);
await setDoc(prescriptionRef, {
  ...prescriptionData,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
```

### Batch Write (Atomic Operations)
```typescript
const batch = writeBatch(db);

// Update consultation
const consultationRef = doc(db, `entities/${entityId}/patients/${patientId}/consultations/${consultationId}`);
batch.update(consultationRef, { status: 'completed' });

// Create prescription
const prescriptionRef = doc(db, `entities/${entityId}/patients/${patientId}/consultations/${consultationId}/prescriptions/${prescriptionId}`);
batch.set(prescriptionRef, prescriptionData);

await batch.commit();
```

## 🚀 Deployment

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

### Deploy Both
```bash
firebase deploy --only firestore
```

