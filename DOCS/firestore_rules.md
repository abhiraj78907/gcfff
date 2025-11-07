# Firestore Security Rules (Starter)

These rules illustrate entity- and role-scoped access. Adjust to your data model and deploy via Firebase console/CLI.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function uid() { return request.auth.uid; }

    // Custom claims suggested: { role: 'patient' | 'doctor' | 'pharmacist' | 'lab-tech' | 'receptionist' | 'admin', entityId: '...' }
    function role() { return request.auth.token.role; }
    function entityId() { return request.auth.token.entityId; }

    match /entities/{eId}/{document=**} {
      allow read, write: if isSignedIn() && eId == entityId();
    }

    // Patients: read own medicines/prescriptions/appointments, cannot write final records
    match /entities/{eId}/patients/{pId}/{coll=**}/{doc} {
      allow read: if isSignedIn() && eId == entityId() && (role() in ['patient','doctor','pharmacist','lab-tech','receptionist','admin']) && (role() != 'patient' || uid() == pId);
      allow create, update: if isSignedIn() && eId == entityId() && (
        (role() == 'patient' && uid() == pId && coll in ['appointments'] ) ||
        (role() == 'doctor') ||
        (role() == 'receptionist')
      );
    }

    // Doctors
    match /entities/{eId}/doctors/{dId}/{document=**} {
      allow read, write: if isSignedIn() && eId == entityId() && (role() == 'doctor' && uid() == dId || role() == 'admin');
    }

    // Lab
    match /entities/{eId}/lab/{document=**} {
      allow read: if isSignedIn() && eId == entityId();
      allow write: if isSignedIn() && eId == entityId() && role() in ['lab-tech','admin'];
    }

    // Pharmacy
    match /entities/{eId}/pharmacy/{document=**} {
      allow read: if isSignedIn() && eId == entityId();
      allow write: if isSignedIn() && eId == entityId() && role() in ['pharmacist','admin'];
    }
  }
}
```

Notes
- Use custom claims for `role` and `entityId` to enforce server-side.
- Tighten per-collection rules as your schema stabilizes.
- Prefer server timestamps; validate fields with `request.resource.data.keys().hasOnly([...])` for strictness.


