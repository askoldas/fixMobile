// node exportProducts.js


const fs = require("fs");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./service-account-key.json"); // Replace with your service account key path

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
const exportCollectionToJSON = async (collectionName, outputFileName) => {
  try {
    console.log(`Fetching documents from "${collectionName}" collection...`);
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) {
      console.log(`No documents found in the "${collectionName}" collection.`);
      return;
    }

    const documents = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Normalize fields to arrays
      return {
        id: doc.id,
        name: data.name || "Unnamed Product",
        brand: normalizeField(data.brand), // Normalize brand to array
        series: normalizeField(data.series), // Normalize series to array
        model: normalizeField(data.model), // Normalize model to array
        description: data.description || "",
        imageUrls: normalizeField(data.imageUrls), // Normalize imageUrls to array
        productType: data.productType || "Unknown Type",
        price: data.price || 0, // Default to 0 if price is missing
      };
    });

    // Save the JSON data to a file
    fs.writeFileSync(outputFileName, JSON.stringify(documents, null, 2));
    console.log(`Collection "${collectionName}" has been exported to "${outputFileName}".`);
  } catch (err) {
    console.error("Error exporting collection to JSON:", err);
  }
};

// Specify the collection name and output file name
const collectionName = "products"; // Replace with your Firestore collection name
const outputFileName = "./products.json"; // Replace with desired output file name

// Run the export
exportCollectionToJSON(collectionName, outputFileName);
