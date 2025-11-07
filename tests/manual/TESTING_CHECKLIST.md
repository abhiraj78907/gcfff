# Manual Testing Checklist

## 1. Authentication Tests

### Sign-up Workflow
- [ ] **Patient Sign-up**
  - Navigate to `/onboard/register-user`
  - Fill registration form
  - Verify user profile created in Firestore `users/{uid}`
  - Verify role assigned correctly
  - Verify entity/subEntry assigned if applicable

- [ ] **Doctor Sign-up**
  - Complete doctor registration
  - Verify specialization fields saved
  - Verify role assignment

- [ ] **All Roles Sign-up**
  - Test: Patient, Doctor, Pharmacist, Lab-tech, Receptionist, Admin
  - Verify each role can register successfully
  - Verify role-specific fields are captured

### Login Workflow
- [ ] **Email/Password Login**
  - Navigate to `/onboard/login`
  - Enter valid credentials
  - Verify redirect to role-specific dashboard
  - Verify user profile loaded from Firestore
  - Verify role and entity context set correctly

- [ ] **Invalid Credentials**
  - Enter wrong password
  - Verify error message displayed
  - Verify no redirect occurs

- [ ] **Logout**
  - Click logout button
  - Verify redirect to login page
  - Verify localStorage cleared
  - Verify Firestore auth state cleared

### Role Assignment Verification
- [ ] **UI Rendering by Role**
  - Login as Patient → Verify patient dashboard shows
  - Login as Doctor → Verify doctor dashboard shows
  - Login as Pharmacist → Verify pharmacy dashboard shows
  - Login as Lab-tech → Verify lab dashboard shows
  - Login as Receptionist → Verify receptionist dashboard shows
  - Login as Admin → Verify admin dashboard shows

- [ ] **Sidebar Menu by Role**
  - Verify only role-appropriate menu items visible
  - Verify admin sees all sections
  - Verify patient sees patient-specific sections only

---

## 2. Role-Based Dashboard Access

### Dashboard Loading
- [ ] **Patient Dashboard**
  - Login as patient
  - Verify medicines, prescriptions, appointments load
  - Verify data scoped to patient's entity
  - Verify real-time updates work

- [ ] **Doctor Dashboard**
  - Login as doctor
  - Verify queue loads with entity-scoped patients
  - Verify active consultations accessible
  - Verify lab requests visible

- [ ] **Pharmacist Dashboard**
  - Login as pharmacist
  - Verify prescriptions list loads
  - Verify inventory visible
  - Verify entity-scoped data

- [ ] **Lab Dashboard**
  - Login as lab-tech
  - Verify test requests load
  - Verify entity-scoped requests only

- [ ] **Receptionist Dashboard**
  - Login as receptionist
  - Verify queue loads
  - Verify patient registration accessible

- [ ] **Admin Dashboard**
  - Login as admin
  - Verify all entities visible
  - Verify can switch between entities
  - Verify analytics load

### Protected Route Access
- [ ] **Unauthorized Access Blocking**
  - Login as Patient
  - Try to access `/doctor/active` → Should redirect
  - Try to access `/pharmacy` → Should redirect
  - Try to access `/lab` → Should redirect
  - Try to access `/dashboard/admin` → Should redirect

- [ ] **Authorized Access**
  - Login as Doctor
  - Access `/doctor/active` → Should load
  - Access `/doctor/completed` → Should load
  - Access `/doctor/lab-requests` → Should load

- [ ] **Unauthenticated Access**
  - Logout
  - Try to access `/patient` → Should redirect to login
  - Try to access `/doctor` → Should redirect to login

---

## 3. Real-Time Data Synchronization

### Firestore Listener Tests
- [ ] **Lab Request Updates**
  - Open Lab Test Requests page in Browser 1 (as Lab-tech)
  - Open Doctor Lab Requests page in Browser 2 (as Doctor)
  - In Browser 2, create new lab order
  - Verify Browser 1 updates immediately (no refresh)
  - In Browser 1, update status to "in_progress"
  - Verify Browser 2 sees status change immediately

- [ ] **Doctor Queue Updates**
  - Open Receptionist Queue page in Browser 1
  - Open Doctor Dashboard in Browser 2
  - In Browser 1, register new patient
  - Verify Browser 2 queue updates immediately

- [ ] **Prescription Updates**
  - Open Doctor Consultation page in Browser 1
  - Open Pharmacy Prescriptions page in Browser 2
  - In Browser 1, create prescription
  - Verify Browser 2 shows new prescription immediately

- [ ] **Inventory Updates**
  - Open Pharmacy Inventory page in Browser 1
  - Open Pharmacy Dispense page in Browser 2
  - In Browser 2, dispense medicines
  - Verify Browser 1 inventory quantities update immediately

### Cross-Role Real-Time Sync
- [ ] **Patient → Doctor → Lab → Pharmacy Flow**
  - Patient registers (Receptionist view)
  - Verify appears in Doctor queue immediately
  - Doctor creates lab order
  - Verify appears in Lab requests immediately
  - Doctor creates prescription
  - Verify appears in Pharmacy immediately
  - Lab uploads results
  - Verify Doctor sees results immediately
  - Pharmacy dispenses
  - Verify Patient sees dispensed status

---

## 4. CRUD Operations

### Create Operations
- [ ] **Create Consultation**
  - Login as Doctor
  - Navigate to Active Consultation
  - Fill symptoms, diagnosis, advice
  - Add medicines to prescription
  - Click "Save & Sign"
  - Verify consultation saved to Firestore
  - Verify prescription created
  - Verify appointment status updated to "completed"

- [ ] **Create Lab Order**
  - Login as Doctor
  - In consultation, click "Order Lab Test"
  - Enter test type
  - Verify lab request created in Firestore
  - Verify appears in Lab Test Requests page

- [ ] **Create Prescription**
  - Login as Doctor
  - Add medicines in consultation
  - Save consultation
  - Verify prescription created
  - Verify medicines array correct

- [ ] **Register Patient**
  - Login as Receptionist
  - Navigate to Patient Registration
  - Fill all required fields
  - Click "Register Patient"
  - Verify patient added to queue
  - Verify token generated correctly
  - Verify queue updates in real-time

### Read Operations
- [ ] **Read Patient Medicines**
  - Login as Patient
  - Navigate to Medicines page
  - Verify medicines load from Firestore
  - Verify real-time updates work

- [ ] **Read Lab Requests**
  - Login as Lab-tech
  - Navigate to Test Requests
  - Verify requests load
  - Verify status filtering works

- [ ] **Read Prescriptions**
  - Login as Pharmacist
  - Navigate to Prescriptions
  - Verify prescriptions load
  - Verify status filtering works

### Update Operations
- [ ] **Update Lab Request Status**
  - Login as Lab-tech
  - Select lab request
  - Change status (ordered → in_progress → completed)
  - Verify status updates in Firestore
  - Verify UI updates immediately
  - Verify other roles see update

- [ ] **Update Medicine Reminder**
  - Login as Patient
  - Navigate to Medicines
  - Toggle reminder switch
  - Verify update saved to Firestore
  - Verify UI reflects change

- [ ] **Update Inventory Quantity**
  - Login as Pharmacist
  - Navigate to Inventory
  - Edit medicine quantity
  - Verify update saved
  - Verify real-time sync

### Delete Operations
- [ ] **Remove Medicine from Prescription**
  - Login as Doctor
  - In consultation, remove medicine
  - Verify removed from prescription
  - Verify Firestore updated

- [ ] **Cancel Appointment**
  - Login as Patient
  - Navigate to Appointments
  - Cancel upcoming appointment
  - Verify status updated to "cancelled"
  - Verify Firestore updated

### Notification Cascading
- [ ] **Lab Result Ready Notification**
  - Lab uploads results
  - Verify patient receives notification
  - Verify doctor receives notification

- [ ] **Prescription Dispensed Notification**
  - Pharmacy dispenses prescription
  - Verify patient receives notification
  - Verify prescription status updated

---

## 5. Navigation and Flow

### Button Navigation
- [ ] **All Role Dashboards**
  - Click each sidebar menu item
  - Verify correct page loads
  - Verify URL updates correctly
  - Verify active state highlights

- [ ] **Action Buttons**
  - "Start Consultation" → Opens consultation page
  - "Order Lab Test" → Creates lab order
  - "Upload Results" → Opens upload page
  - "Dispense" → Completes dispensation
  - "Register Patient" → Opens registration form

### Modal Functionality
- [ ] **Registration Success Modal**
  - Complete patient registration
  - Verify modal appears
  - Verify token displayed
  - Verify close button works

- [ ] **Help/Support Modals**
  - Click help button
  - Verify modal opens
  - Verify content displays
  - Verify close works

### Multi-Step Flows
- [ ] **Complete Consultation Flow**
  1. Receptionist registers patient
  2. Patient appears in doctor queue
  3. Doctor starts consultation
  4. Doctor adds medicines
  5. Doctor orders lab test
  6. Doctor saves consultation
  7. Prescription appears in pharmacy
  8. Lab request appears in lab
  9. Verify all steps complete successfully

- [ ] **Lab Test Flow**
  1. Doctor orders lab test
  2. Lab sees request
  3. Lab starts test (status: in_progress)
  4. Lab uploads results
  5. Lab marks complete
  6. Doctor sees results
  7. Patient sees results

- [ ] **Pharmacy Dispense Flow**
  1. Doctor creates prescription
  2. Pharmacy sees prescription
  3. Pharmacy selects medicines
  4. Pharmacy dispenses
  5. Inventory updates
  6. Prescription marked dispensed
  7. Patient sees dispensed status

### Deep Linking
- [ ] **Direct URL Access**
  - Access `/patient/medicines` directly
  - Verify loads correctly if authenticated
  - Verify redirects if not authenticated

- [ ] **Browser Back/Forward**
  - Navigate through pages
  - Use browser back button
  - Verify correct page loads
  - Verify state preserved

---

## 6. Performance under Load

### Large Dataset Handling
- [ ] **Pagination**
  - Create 100+ lab requests
  - Navigate to Lab Test Requests
  - Verify page loads quickly
  - Verify pagination controls work
  - Verify only visible items rendered

- [ ] **Lazy Loading**
  - Navigate to Patient Prescriptions
  - Verify initial load fast
  - Scroll to load more
  - Verify smooth loading

- [ ] **Virtualization**
  - Open queue with 50+ patients
  - Verify smooth scrolling
  - Verify no lag on scroll
  - Verify memory usage reasonable

### Offline Persistence
- [ ] **Offline Mode**
  - Disconnect internet
  - Try to view medicines
  - Verify cached data shows
  - Verify offline indicator appears

- [ ] **Graceful Recovery**
  - Make changes while offline
  - Reconnect internet
  - Verify changes sync
  - Verify no data loss
  - Verify conflict resolution

### Response Times
- [ ] **Page Load Times**
  - Measure dashboard load: < 2s
  - Measure list page load: < 1s
  - Measure form load: < 500ms

- [ ] **Action Response Times**
  - Save consultation: < 1s
  - Update status: < 500ms
  - Load prescriptions: < 1s

---

## 7. Multilingual UI

### Language Switching
- [ ] **Language Selector**
  - Navigate to Settings
  - Change language (English → Hindi → Kannada)
  - Verify language changes immediately
  - Verify no page refresh required
  - Verify `document.documentElement.lang` updates

- [ ] **Persistence**
  - Change language
  - Refresh page
  - Verify language persists
  - Verify localStorage updated

### UI Text Updates
- [ ] **All Pages Update**
  - Change language
  - Navigate to each page:
    - Home/Dashboard
    - Medicines
    - Prescriptions
    - Appointments
    - Settings
  - Verify all text updates
  - Verify no English text remains

- [ ] **Dynamic Content**
  - Change language
  - Verify toast notifications in selected language
  - Verify error messages in selected language
  - Verify form labels in selected language

---

## 8. Security Validation

### Firestore Security Rules
- [ ] **Unauthorized Entity Access**
  - Login as user from Entity A
  - Try to access Entity B data
  - Verify access denied
  - Verify error message shown

- [ ] **Role-Based Write Access**
  - Login as Patient
  - Try to create prescription
  - Verify access denied
  - Try to update lab request
  - Verify access denied

- [ ] **Role-Based Read Access**
  - Login as Patient
  - Try to read other patients' data
  - Verify access denied
  - Verify only own data accessible

### Error Handling
- [ ] **Permission Denied**
  - Trigger unauthorized action
  - Verify error toast appears
  - Verify user-friendly message
  - Verify no sensitive info leaked

- [ ] **Network Errors**
  - Simulate network failure
  - Verify error handling
  - Verify retry mechanism
  - Verify user notification

- [ ] **Validation Errors**
  - Submit invalid form data
  - Verify validation messages
  - Verify form doesn't submit
  - Verify helpful error text

---

## 9. Accessibility and UI Responsiveness

### Keyboard Navigation
- [ ] **Tab Order**
  - Navigate entire page with Tab key
  - Verify logical tab order
  - Verify all interactive elements accessible
  - Verify focus indicators visible

- [ ] **Keyboard Shortcuts**
  - Press Enter on buttons → Should activate
  - Press Space on checkboxes → Should toggle
  - Press Escape on modals → Should close
  - Press Arrow keys in selects → Should navigate

### Screen Reader Compatibility
- [ ] **ARIA Labels**
  - Use screen reader (NVDA/JAWS)
  - Verify all buttons have labels
  - Verify form inputs have labels
  - Verify icons have descriptions

- [ ] **Semantic HTML**
  - Verify proper heading hierarchy
  - Verify landmarks (nav, main, etc.)
  - Verify form structure correct

### Responsive Design
- [ ] **Mobile View (320px - 768px)**
  - Test on mobile viewport
  - Verify no horizontal scroll
  - Verify touch targets ≥ 44px
  - Verify bottom nav works
  - Verify cards stack correctly

- [ ] **Tablet View (768px - 1024px)**
  - Test on tablet viewport
  - Verify 2-column layouts work
  - Verify sidebar collapses correctly
  - Verify navigation accessible

- [ ] **Desktop View (1024px+)**
  - Test on desktop viewport
  - Verify 3-column layouts work
  - Verify sidebar expands
  - Verify all features accessible

### UI Consistency
- [ ] **Design System**
  - Verify consistent spacing
  - Verify consistent colors
  - Verify consistent typography
  - Verify consistent button styles

- [ ] **Cross-Browser**
  - Test in Chrome
  - Test in Firefox
  - Test in Safari
  - Test in Edge
  - Verify consistent appearance

---

## Test Execution Log

**Date:** _______________
**Tester:** _______________
**Environment:** Development / Staging / Production

### Summary
- Total Tests: 100+
- Passed: ___
- Failed: ___
- Blocked: ___
- Skipped: ___

### Critical Issues Found
1. ________________________________
2. ________________________________
3. ________________________________

### Production Readiness Assessment
- [ ] Ready for Production
- [ ] Needs Fixes (List below)
- [ ] Not Ready

**Confidence Level:** ___% (0-100)

**Notes:**
________________________________
________________________________
________________________________

