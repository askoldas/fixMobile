// ImportProductTypes.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import productTypes from "./product_types.json" assert { type: "json" };
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Firebase config
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

const importProductTypes = async () => {
  for (const item of productTypes) {
    try {
      const ref = doc(db, "ProductTypes", item.id);
      await setDoc(ref, item, { merge: true });
      console.log(`✅ Imported: ${item.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${item.name}`, error.message);
    }
  }
};

importProductTypes();
