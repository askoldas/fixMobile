// ImportDevices.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import devices from "./devices.json" assert { type: "json" };
import dotenv from "dotenv";

// Load .env.local (or .env)
dotenv.config({ path: ".env.local" });

// Firebase config using your variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Slugify helper
const slugify = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]+/g, "")
    .replace(/_+/g, "_");

const importDevices = async () => {
  for (const item of devices) {
    try {
      const id = slugify(item.id);
      const ref = doc(db, "Devices", id);
      await setDoc(ref, item, { merge: true });
      console.log(`✅ Imported: ${item.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${item.name}`, error.message);
    }
  }
};

importDevices();
