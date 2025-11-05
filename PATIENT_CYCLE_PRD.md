# Patient Cycle Flow PRD (Multi-Entity, Multi-Role Aligned)

## Core Concept
- Each patient and their records belong to one logical `Entity` and a specific `SubEntry` (location/branch).
- Roles act on distinct phases of the patient cycle while preserving end-to-end continuity.
- All reads/writes are partitioned by `(entityId, subEntryId)` and gated by role-based access.

## High-Level Architecture

Frontend (React + Context)
- SubEntryContext: current `(entityId, subEntryId)` and role scope
- Role-aware routes and components per phase
- UI indicators and switcher for multi-sub-entry admins

Backend (to be implemented)
- Entity, SubEntry, Patient, Visit, Queue, Consultation, Orders, Results, Prescriptions, Inventory, Adherence
- APIs enforce `(entityId, subEntryId)` and role authorization

Data Partitioning
- Every domain object stores `entityId` and `subEntryId`
- Queries require `subEntryId` (except admin multi-sub-entry aggregations)

## Roles and Phases
1) Receptionist: Registration and Visit/Token creation
2) Doctor: Queue consumption, AI consultation, prescription, lab ordering
3) Lab Technician: Test order processing and results
4) Pharmacist: Dispensation, stock decrement, adherence kick-off
5) Patient: Reminders, confirmations, snooze
6) Admin: Oversight, audit, configuration, multi-sub-entry switching

## Interface Flow Diagrams (ASCII)

Registration → Queueing
```
[Receptionist]
  └─ Register Patient ──> Create Visit(Token)
                          └─ Queue: Doctor (entity/sub-entry scoped)
```

Consultation → Orders → Prescription
```
[Doctor]
  ├─ View Queue (sub-entry)
  ├─ AI Transcription + Notes
  ├─ Diagnosis ⇒ Lab Orders (optional)
  └─ Prescription (entity templates)
```

Lab Processing → Results
```
[Lab Technician]
  ├─ View Orders (sub-entry)
  ├─ Update Status (received → in-progress → completed)
  └─ Upload Results ⇒ attach to Visit/Patient Record
```

Pharmacy → Dispensation → Adherence
```
[Pharmacist]
  ├─ View Prescriptions (sub-entry)
  ├─ Pick/Pack/Dispense (inventory-checked)
  └─ Trigger Adherence Schedule (per drug regimen)

[Patient]
  ├─ Receive Reminders (app/SMS/call)
  ├─ Confirm dose or Snooze
  └─ Adherence status visible to Doctor/Pharmacy
```

Admin Oversight
```
[Admin]
  ├─ Monitor flows (per sub-entry; can switch)
  ├─ Manage users/roles/permissions
  └─ Configure entity/sub-entry templates and defaults
```

## Data Model (Frontend/Shared Types)
Use or extend `src/types/entities.ts` and add new domain types:
- Patient: { id, entityId, subEntryId, demographics }
- Visit: { id, patientId, entityId, subEntryId, token, status, timestamps }
- QueueItem: { id, visitId, doctorId?, status, priority }
- Consultation: { id, visitId, notes, diagnosisCodes, aiTranscript, doctorId }
- LabOrder: { id, visitId, tests[], status }
- LabResult: { id, orderId, files[], values[], verifiedBy }
- Prescription: { id, visitId, items[], templateId?, status }
- PrescriptionItem: { drugId, dose, frequency, duration, notes }
- InventoryTx: { id, entityId, subEntryId, drugId, qty, type }
- AdherenceEvent: { id, patientId, prescriptionItemId, scheduledAt, status, channel }

All contain `(entityId, subEntryId)` for partitioning; backend validates on every request.

## UI Routing and Role Scopes (Examples)
- Receptionist
  - `/receptionist/registration` (Register Patient + Visit)
  - `/receptionist/queue` (Tokens for today)
- Doctor
  - `/doctor/active` (Active consultation; AI transcript)
  - `/doctor/completed` (History)
  - `/doctor/lab-requests` (Orders overview)
- Lab
  - `/lab/requests`, `/lab/upload`, `/lab/completed`
- Pharmacy
  - `/prescriptions` (Pending), `/inventory` (Stock), `/analytics`
- Patient
  - Mobile/app: reminders and confirmations
- Admin
  - `/dashboard/admin/*` (already integrated) with sub-entry switcher

## API Surfaces (To Implement)
All requests include `(entityId, subEntryId)` and are authorized for role.

Receptionist
- POST `/patients` { demographics, entityId, subEntryId }
- POST `/visits` { patientId, entityId, subEntryId } → returns token
- GET `/queue`?date=…&subEntryId=…

Doctor
- GET `/queue/doctor`?subEntryId=…
- POST `/consultations` { visitId, transcript, diagnosis }
- POST `/lab-orders` { visitId, tests[] }
- POST `/prescriptions` { visitId, items[], templateId? }

Lab
- GET `/lab-orders`?subEntryId=…&status=…
- POST `/lab-results` { orderId, files[], values[] }

Pharmacy
- GET `/prescriptions`?subEntryId=…&status=pending
- POST `/dispense` { prescriptionId, items[] } (validates inventory, records tx)
- POST `/adherence/schedule` { prescriptionId, plan }

Patient
- POST `/adherence/confirm` { eventId }
- POST `/adherence/snooze` { eventId, offsetMinutes }

Admin
- GET `/admin/overview`?subEntryId=… or `subEntryId=all` (RBAC-gated)
- GET `/audit`?subEntryId=…

Background Jobs / Notifications
- Scheduler generates adherence events per prescription plan
- Notifier fan-out (app push/SMS/voice)
- Dead-letter handling + retries

## Role-Based UI and Access Controls
- Frontend gates routes by role; hides ineligible actions
- SubEntryContext ensures correct `(entityId, subEntryId)` on all reads/writes
- Admin can switch sub-entry; others fixed to their assigned sub-entry

## Data Mapping Across Stages
1) Registration
   - Patient → Visit(token) → QueueItem (sub-entry)
2) Consultation
   - QueueItem → Consultation → (LabOrder?) → Prescription
3) Lab
   - LabOrder → LabResult (attach to Visit + Patient record)
4) Pharmacy
   - Prescription → Dispense (InventoryTx) → Adherence plan
5) Patient
   - AdherenceEvent (scheduled) → Confirm/Snooze → status feeds Doctor/Pharmacy

## Incremental Deliverables
Phase 1 (Frontend scaffolding)
- SubEntryContext (done), Switcher (done)
- PRD document (this)
- Receptionist: Register Patient + Visit (UI + mocked APIs)
- Doctor: Queue + Consultation shell (UI + mocked APIs)

Phase 2 (End-to-end mocks)
- Lab Orders/Results UI flows (mocked persistence)
- Pharmacy Dispense + Inventory mock + Adherence scheduling stub
- Patient reminder UI stub (mock channels)

Phase 3 (Backend integration)
- Real APIs enforcing `(entityId, subEntryId)`
- RBAC, audit logs, notification pipelines
- Data migrations and seeds

## Testing Plan
- Partition tests: ensure cross-sub-entry access is blocked
- Role route coverage per entity/sub-entry
- Queue lifecycle (token → consultation → closure)
- Lab and pharmacy flows with status transitions
- Adherence event generation and confirmation paths
- Admin multi-sub-entry switch and aggregated views

## Open Questions
- Final SMS/voice vendor
- AI transcription provider and on-device fallback
- Prescription template governance per entity vs. global


