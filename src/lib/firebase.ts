import { initializeApp, type FirebaseApp, type FirebaseOptions, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

async function fetchFirebaseConfig(): Promise<FirebaseOptions> {
  try {
    const res = await fetch("/.netlify/functions/firebase-config");
    if (res.ok) {
      const env = await res.json();
      return {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
      } as FirebaseOptions;
    }
  } catch {}

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  } as FirebaseOptions;
}

let appPromise: Promise<FirebaseApp> | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

async function ensureFirebaseApp(): Promise<FirebaseApp> {
  if (getApps().length) return getApps()[0];
  if (!appPromise) appPromise = fetchFirebaseConfig().then(cfg => initializeApp(cfg));
  return appPromise;
}

export async function getFirebase() {
  const app = await ensureFirebaseApp();
  if (!authInstance) authInstance = getAuth(app);
  if (!dbInstance) dbInstance = getFirestore(app);
  return { app, auth: authInstance, db: dbInstance };
}

export const analyticsPromise = (async () => {
  try {
    const supported = await analyticsSupported();
    if (!supported) return null;
    const { app } = await getFirebase();
    return getAnalytics(app);
  } catch {
    return null;
  }
})();


