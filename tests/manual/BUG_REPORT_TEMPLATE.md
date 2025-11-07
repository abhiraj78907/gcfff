# Bug Report Template

## Bug Information

**Bug ID:** BUG-XXXX
**Reported By:** _______________
**Date:** _______________
**Severity:** Critical / High / Medium / Low
**Priority:** P0 / P1 / P2 / P3
**Status:** New / In Progress / Fixed / Closed

## Summary

**Title:** [Brief description of the bug]

**Description:**
[Detailed description of what the bug is]

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]
...

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

## Environment

- **Browser:** Chrome / Firefox / Safari / Edge
- **Version:** _______________
- **OS:** Windows / macOS / Linux / Android / iOS
- **Device:** Desktop / Tablet / Mobile
- **Screen Size:** _______________
- **User Role:** Patient / Doctor / Pharmacist / Lab-tech / Receptionist / Admin
- **Entity ID:** _______________

## Screenshots/Videos

[Attach screenshots or screen recordings]

## Console Errors

```
[Paste any console errors here]
```

## Network Logs

[Paste relevant network request/response logs]

## Additional Context

- **Frequency:** Always / Sometimes / Once
- **Workaround:** [If any]
- **Related Issues:** [Link to related bugs/features]

## Impact Assessment

- **Users Affected:** All / Specific Role / Specific Entity
- **Data Loss Risk:** Yes / No
- **Security Risk:** Yes / No
- **Performance Impact:** High / Medium / Low / None

---

## Example Bug Report

**Bug ID:** BUG-001
**Severity:** High
**Priority:** P1

**Title:** Lab request status update not syncing in real-time

**Description:**
When a lab-tech updates a lab request status from "ordered" to "in_progress", the doctor's lab requests page does not update in real-time. The doctor must refresh the page to see the status change.

**Steps to Reproduce:**
1. Login as Doctor
2. Navigate to Lab Requests page
3. Create a new lab order (status: "ordered")
4. Open new browser window/tab
5. Login as Lab-tech
6. Navigate to Test Requests page
7. Update the lab request status to "in_progress"
8. Return to Doctor's browser window

**Expected Result:**
Doctor's lab requests page should update automatically showing status as "in_progress"

**Actual Result:**
Status remains "ordered" until page is manually refreshed

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- User Role: Doctor / Lab-tech
- Entity ID: entity-demo-1

**Console Errors:**
None

**Frequency:** Always

**Impact:** High - Affects real-time collaboration between roles

