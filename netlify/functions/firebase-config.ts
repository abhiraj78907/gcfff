import type { Handler } from "@netlify/functions";

const allowed = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
];

export const handler: Handler = async () => {
  const cfg: Record<string, string | undefined> = {};
  for (const key of allowed) {
    cfg[key] = process.env[key];
  }
  // Return only defined values
  return {
    statusCode: 200,
    body: JSON.stringify(Object.fromEntries(Object.entries(cfg).filter(([,v]) => v)))
  };
};


