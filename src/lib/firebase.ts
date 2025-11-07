import { initializeApp, type FirebaseOptions, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

// Fetch config at runtime from serverless function to avoid embedding keys
async function getConfig(): Promise<FirebaseOptions> {
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
  // Fallback to env if function unavailable (local/dev)
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

let appPromise: Promise<ReturnType<typeof initializeApp>> | null = null;
function getAppInstance() {
  if (getApps().length) return Promise.resolve(getApps()[0]);
  if (!appPromise) appPromise = getConfig().then(cfg => initializeApp(cfg));
  return appPromise;
}

// Proxies expose auth/db with lazy, singleton init without duplicating exports
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

export const auth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_t, prop) {
    return async (...args: any[]) => {
      if (!_auth) _auth = getAuth(await getAppInstance());
      // @ts-ignore
      return (_auth as any)[prop](...args);
    };
  }
});

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_t, prop) {
    return async (...args: any[]) => {
      if (!_db) _db = getFirestore(await getAppInstance());
      // @ts-ignore
      return (_db as any)[prop](...args);
    };
  }
});

export const analyticsPromise = (async () => {
  try {
    const supported = await analyticsSupported();
    if (!supported) return null;
    const app = await getAppInstance();
    return getAnalytics(app);
  } catch {
    return null;
  }
})();

export const app = {
  get: getAppInstance
};


