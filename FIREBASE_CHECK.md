# How to Check Firebase Integration

## Quick Check Methods

### Method 1: Browser Console (Easiest)

1. **Open your application** in the browser
2. **Open Developer Tools** (Press `F12` or `Right-click → Inspect`)
3. **Go to Console tab**
4. **Run these commands:**

```javascript
// Check if Firebase is loaded
console.log('Firebase:', typeof firebase !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');

// Check Firebase app initialization
import('./src/lib/firebase.js').then(module => {
  module.getFirebase().then(({ app, auth, db }) => {
    console.log('✅ Firebase App:', app ? 'Initialized' : 'Not initialized');
    console.log('✅ Firebase Auth:', auth ? 'Initialized' : 'Not initialized');
    console.log('✅ Firestore:', db ? 'Initialized' : 'Not initialized');
    console.log('📋 Project ID:', app?.options?.projectId || 'Not set');
  }).catch(err => {
    console.error('❌ Firebase Error:', err);
  });
});
```

### Method 2: Network Tab

1. **Open Developer Tools** → **Network tab**
2. **Reload the page**
3. **Look for Firebase requests:**
   - `firestore.googleapis.com` - Firestore connection
   - `identitytoolkit.googleapis.com` - Authentication
   - `firebase.googleapis.com` - Firebase services

**✅ If you see these requests:** Firebase is connected  
**❌ If you don't see them:** Firebase might not be initialized

### Method 3: Check Environment Variables

1. **Check if `.env` file exists** in project root
2. **Verify these variables are set:**
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **Check in browser console:**
   ```javascript
   console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
   console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || '❌ Missing');
   ```

### Method 4: Check Console for Errors

1. **Open Developer Tools** → **Console tab**
2. **Look for Firebase-related errors:**
   - ❌ `Firebase: Error (auth/...)` - Authentication issues
   - ❌ `Firestore: Error` - Firestore connection issues
   - ❌ `Firebase App named '[DEFAULT]' already exists` - Multiple initializations (usually OK)

**✅ No errors:** Firebase is likely working  
**❌ Errors present:** Check the error message for details

### Method 5: Try a Simple Operation

**In browser console, run:**

```javascript
// Test Firestore read
import('./src/lib/firebase.js').then(async (module) => {
  const { db } = await module.getFirebase();
  const { doc, getDoc } = await import('firebase/firestore');
  
  // Try to read a test document
  const testDoc = doc(db, '_test/connection');
  getDoc(testDoc).then(snap => {
    console.log('✅ Firestore Read: Working');
    console.log('Document exists:', snap.exists());
  }).catch(err => {
    console.error('❌ Firestore Read Error:', err.message);
  });
});
```

## What to Look For

### ✅ Firebase is Integrated If:

- ✅ No console errors related to Firebase
- ✅ Network requests to `firestore.googleapis.com` appear
- ✅ Environment variables are set
- ✅ You can see Firebase initialization logs in console
- ✅ Authentication works (you can log in)
- ✅ Data operations work (reading/writing data)

### ❌ Firebase is NOT Integrated If:

- ❌ Console shows "Firebase is not defined"
- ❌ No network requests to Firebase services
- ❌ Environment variables are missing
- ❌ Authentication doesn't work
- ❌ Data operations fail with Firebase errors

## Common Issues

### Issue: "Firebase is not defined"
**Solution:** Check if Firebase SDK is installed and imported correctly

### Issue: "Missing environment variables"
**Solution:** 
1. Create `.env` file in project root
2. Add all `VITE_FIREBASE_*` variables
3. Restart dev server

### Issue: "Permission denied" errors
**Solution:** Check Firestore security rules in `firestore.rules`

### Issue: "Network request failed"
**Solution:** 
- Check internet connection
- Verify Firebase project is active
- Check Firebase Console for service status

## Quick Verification Checklist

- [ ] `.env` file exists with Firebase config
- [ ] No Firebase errors in browser console
- [ ] Network requests to Firebase appear
- [ ] Can log in (if auth is implemented)
- [ ] Can read/write data (if implemented)

## Need More Help?

Check these files:
- `src/lib/firebase.ts` - Firebase initialization
- `src/contexts/AuthContext.tsx` - Authentication setup
- `firestore.rules` - Security rules
- `.env` - Environment variables

