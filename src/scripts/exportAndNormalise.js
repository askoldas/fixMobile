// node exportProducts.js

const fs = require("fs");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Replace with your service account key path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Normalize a field to ensure it's an array.
 * @param {any} field - The field to normalize.
 * @returns {Array} The normalized array.
 */
const normalizeField = (field) => {
  if (typeof field === "string") {
    return [field]; // Convert string to array
  }
  if (Array.isArray(field)) {
    return field; // Leave array as is
  }
  return []; // Default to empty array
};

/**
 * Fetch, normalize, and save the products collection as a JSON file.
 */
const exportAndNormalizeProducts = async () => {
  try {
    console.log("Fetching documents from 'products' collection...");
    const snapshot = await db.collection("products").get();

    if (snapshot.empty) {
      console.log("No documents found in the 'products' collection.");
      return;
    }

    const normalizedProducts = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id, // Include the document ID
        name: data.name || "Unnamed Product", // Ensure name exists
        brands: normalizeField(data.brands), // Normalize brands to array
        models: normalizeField(data.models), // Normalize models to array
        series: normalizeField(data.series), // Normalize series to array
        description: data.description || "", // Include other fields as needed
        price: data.price || 0, // Default price to 0
      };
    });

    // Save normalized data as a JSON file
    const outputPath = "./NormalizedProducts.json";
    fs.writeFileSync(outputPath, JSON.stringify(normalizedProducts, null, 2));
    console.log(`Normalized data saved to ${outputPath}`);
  } catch (err) {
    console.error("Error exporting and normalizing products data:", err);
  }
};

// Run the export and normalization script
exportAndNormalizeProducts();
