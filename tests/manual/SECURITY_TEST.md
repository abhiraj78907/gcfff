# Security Testing Guide

## Firestore Security Rules Testing

### Test: Unauthorized Entity Access
```bash
# Setup
1. Login as user from Entity A
2. Try to access Entity B data
3. Verify access denied

# Test Cases
- Try to read Entity B patients
- Try to write to Entity B lab requests
- Try to update Entity B inventory
- Verify all attempts fail with permission error
```

### Test: Role-Based Write Access
```bash
# Patient Role
- Try to create prescription → Should fail
- Try to update lab request → Should fail
- Try to dispense medicine → Should fail
- Try to upload lab results → Should fail

# Doctor Role
- Try to create prescription → Should succeed
- Try to update lab request status → Should fail (lab-tech only)
- Try to dispense medicine → Should fail

# Lab-tech Role
- Try to update lab request → Should succeed
- Try to create prescription → Should fail
- Try to dispense medicine → Should fail

# Pharmacist Role
- Try to dispense medicine → Should succeed
- Try to create prescription → Should fail
- Try to update lab request → Should fail
```

### Test: Patient Data Privacy
```bash
# Setup
1. Login as Patient A
2. Try to access Patient B data

# Verify
- Cannot read Patient B medicines
- Cannot read Patient B prescriptions
- Cannot read Patient B appointments
- Can only read own data
```

## Authentication Security

### Test: Session Management
```bash
# Test Cases
1. Login and verify session persists
2. Close browser and reopen → Should stay logged in
3. Clear cookies → Should require re-login
4. Expired token → Should redirect to login
```

### Test: Token Validation
```bash
# Test Cases
1. Modify JWT token → Should reject
2. Use expired token → Should reject
3. Use token from different project → Should reject
```

## Input Validation

### Test: SQL Injection (if applicable)
```bash
# Test Cases
1. Enter SQL in search fields
2. Enter SQL in form inputs
3. Verify no SQL execution
4. Verify proper sanitization
```

### Test: XSS Prevention
```bash
# Test Cases
1. Enter <script> tags in inputs
2. Enter HTML in text fields
3. Verify proper escaping
4. Verify no script execution
```

### Test: Input Sanitization
```bash
# Test Cases
1. Enter special characters
2. Enter very long strings
3. Enter null/undefined values
4. Verify proper handling
```

## Data Validation

### Test: Required Fields
```bash
# Test Cases
1. Submit forms without required fields
2. Verify validation errors
3. Verify form doesn't submit
4. Verify helpful error messages
```

### Test: Data Type Validation
```bash
# Test Cases
1. Enter text in number fields
2. Enter invalid dates
3. Enter invalid emails
4. Verify type validation
```

## Error Handling

### Test: Error Messages
```bash
# Test Cases
1. Trigger permission denied
2. Trigger network error
3. Trigger validation error
4. Verify user-friendly messages
5. Verify no sensitive info leaked
```

### Test: Error Logging
```bash
# Test Cases
1. Check console for errors
2. Verify errors logged appropriately
3. Verify no sensitive data in logs
4. Verify error tracking (if implemented)
```

## Security Checklist

- [ ] Firestore rules deployed and tested
- [ ] Authentication tokens validated
- [ ] Input sanitization implemented
- [ ] XSS prevention verified
- [ ] CSRF protection (if applicable)
- [ ] Rate limiting (if applicable)
- [ ] Secure headers configured
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted
- [ ] Error messages don't leak info
- [ ] Audit logging implemented
- [ ] Security headers set

## Security Audit Tools

### Recommended
1. **OWASP ZAP** - Security scanning
2. **Snyk** - Dependency vulnerability scanning
3. **Firebase Security Rules Emulator** - Rules testing
4. **Lighthouse Security Audit** - Basic security checks

### Run Security Audit
```bash
# Install Firebase emulator
npm install -g firebase-tools
firebase init emulators

# Test rules
firebase emulators:start --only firestore
# Run tests against emulator
```

