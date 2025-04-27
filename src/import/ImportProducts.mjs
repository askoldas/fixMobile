// ImportProducts.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import products from "./products.json" assert { type: "json" };
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Firebase config from .env.local
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

// Import products into Firestore
const importProducts = async () => {
  for (const product of products) {
    try {
      const ref = doc(db, "Products", product.id);
      await setDoc(ref, product);
      console.log(`✅ Imported: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed: ${product.name}`, error.message);
    }
  }
};

importProducts();
