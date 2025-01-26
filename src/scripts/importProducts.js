// node importProducts.js

const fs = require("fs");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./service-account-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Import Products Function
async function importProducts() {
  try {
    // Read and parse the JSON file
    const filePath = "./products_collection.json"; // Replace with your file's path
    const fileContent = fs.readFileSync(filePath, "utf-8"); // Read the file as UTF-8
    let products;

    try {
      // Parse the JSON string
      products = JSON.parse(fileContent);
    } catch (parseError) {
      throw new Error(`Error parsing JSON: ${parseError.message}`);
    }

    // Validate the parsed JSON structure
    if (!Array.isArray(products)) {
      throw new Error("The JSON file must contain an array of products.");
    }

    // Import each product into Firestore
    for (const product of products) {
      try {
        await db.collection("products").add(product);
        console.log(`Successfully added product: ${product.name}`);
      } catch (productError) {
        console.error(`Error adding product '${product.name}': ${productError.message}`);
      }
    }

    console.log("Products imported successfully.");
  } catch (error) {
    console.error(`Error importing products: ${error.message}`);
  }
}

importProducts();
