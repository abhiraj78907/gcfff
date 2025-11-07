import { initializeApp, type FirebaseOptions, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

function getConfigFromEnv(): FirebaseOptions {
  const cfg: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  } as FirebaseOptions;
  return cfg;
}

// NOTE: If you prefer to source config from DOCS/firebase cred.txt, mirror the keys into Vite env (VITE_FIREBASE_*)
const firebaseConfig = getConfigFromEnv();

// Avoid re-initialization during HMR
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analyticsPromise = (async () => {
  try {
    const supported = await analyticsSupported();
    if (!supported) return null;
    return getAnalytics(app);
  } catch {
    return null;
  }
})();

export { app };


