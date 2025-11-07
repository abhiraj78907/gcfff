# Development Seed Scripts

## seed-dev-data.ts

Creates minimal Firestore documents for local development and testing.

### Usage

#### Option 1: Browser Console
1. Open your app in browser
2. Open DevTools console
3. The script exposes `window.seedDevData()` function
4. Run: `seedDevData()`

#### Option 2: Node.js Script (with Firebase Admin SDK)
```bash
# Install Firebase Admin SDK
npm install firebase-admin

# Adapt the script to use Admin SDK
# Then run:
npx tsx scripts/seed-dev-data.ts
```

#### Option 3: Vite Dev Server Integration
Add to your main.tsx or App.tsx for one-time auto-seed:
```typescript
if (import.meta.env.DEV && !localStorage.getItem('seed-complete')) {
  import('./scripts/seed-dev-data').then(({ seedData }) => {
    seedData().then(() => {
      localStorage.setItem('seed-complete', 'true');
    });
  });
}
```

### What It Creates

- **User Profile**: `users/patient-demo-1`
- **Token Counter**: `entities/{entityId}/subEntries/{subEntryId}/_meta/tokenCounter`
- **Lab Request**: Sample test order
- **Pharmacy Inventory**: Sample medicine stock
- **Patient Medicine**: Sample medication schedule
- **Appointment**: Sample upcoming visit
- **Doctor Queue**: Sample queue item

### Customization

Edit the constants at the top of `seed-dev-data.ts`:
- `ENTITY_ID`: Your test entity ID
- `SUB_ENTRY_ID`: Your test sub-entry ID
- `DOCTOR_ID`: Your test doctor ID
- `PATIENT_ID`: Your test patient ID

