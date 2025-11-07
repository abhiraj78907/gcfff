/**
 * Seed script for local development
 * Creates minimal Firestore documents for testing
 * 
 * Usage: Run this in a Node.js environment with Firebase Admin SDK
 * Or adapt to use client SDK in browser console for one-time setup
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Use your Firebase config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ENTITY_ID = "entity-demo-1";
const SUB_ENTRY_ID = "subentry-demo-1";
const DOCTOR_ID = "doctor-demo-1";
const PATIENT_ID = "patient-demo-1";

async function seedData() {
  console.log("🌱 Starting seed data creation...");

  try {
    // 1. Create a demo user profile
    await setDoc(doc(db, "users", PATIENT_ID), {
      id: PATIENT_ID,
      name: "Ramesh Kumar",
      email: "ramesh@demo.com",
      roles: ["patient"],
      primaryRole: "patient",
      entityId: ENTITY_ID,
      subEntryId: SUB_ENTRY_ID,
    });
    console.log("✅ Created user profile");

    // 2. Create token counter for sub-entry
    await setDoc(doc(db, `entities/${ENTITY_ID}/subEntries/${SUB_ENTRY_ID}/_meta/tokenCounter`), {
      value: 0,
      updatedAt: Date.now(),
    });
    console.log("✅ Created token counter");

    // 3. Create sample lab request
    await setDoc(doc(db, `entities/${ENTITY_ID}/lab/requests`, "lab-req-1"), {
      patientId: PATIENT_ID,
      doctorId: DOCTOR_ID,
      testType: "Complete Blood Count",
      status: "ordered",
      createdAt: Date.now(),
    });
    console.log("✅ Created lab request");

    // 4. Create sample pharmacy inventory item
    await setDoc(doc(db, `entities/${ENTITY_ID}/pharmacy/inventory`, "drug-1"), {
      name: "Paracetamol 500mg",
      category: "Analgesic",
      batch: "BATCH001",
      supplier: "PharmaCorp",
      expiry: "2026-12-31",
      quantity: 100,
      reorderThreshold: 20,
      price: 5.5,
    });
    console.log("✅ Created pharmacy inventory item");

    // 5. Create sample patient medicine
    await setDoc(doc(db, `entities/${ENTITY_ID}/patients/${PATIENT_ID}/medicines`, "med-1"), {
      name: "Paracetamol",
      dosage: "500mg",
      instructions: "Take after meals",
      period: "morning",
      withFood: true,
      status: "due",
      remindersEnabled: true,
      startDate: new Date().toISOString(),
    });
    console.log("✅ Created patient medicine");

    // 6. Create sample appointment
    await setDoc(doc(db, `entities/${ENTITY_ID}/patients/${PATIENT_ID}/appointments`, "apt-1"), {
      patientId: PATIENT_ID,
      doctorId: DOCTOR_ID,
      date: new Date().toISOString(),
      time: "10:00",
      reason: "Follow-up consultation",
      status: "upcoming",
    });
    console.log("✅ Created appointment");

    // 7. Add to doctor queue
    await setDoc(doc(db, `entities/${ENTITY_ID}/doctors/${DOCTOR_ID}/queue`, "queue-1"), {
      visitId: "apt-1",
      patientId: PATIENT_ID,
      status: "upcoming",
      createdAt: Date.now(),
    });
    console.log("✅ Created doctor queue item");

    console.log("\n🎉 Seed data creation complete!");
    console.log("\n📋 Created entities:");
    console.log(`   - Entity: ${ENTITY_ID}`);
    console.log(`   - Sub-entry: ${SUB_ENTRY_ID}`);
    console.log(`   - Patient: ${PATIENT_ID}`);
    console.log(`   - Doctor: ${DOCTOR_ID}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Export for use in browser console or Node script
export { seedData };

// If running directly (adapt based on your environment)
if (typeof window !== "undefined") {
  (window as any).seedDevData = seedData;
  console.log("💡 Run seedDevData() in browser console to seed data");
}

