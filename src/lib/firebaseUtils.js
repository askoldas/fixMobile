import { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, limit, startAfter, doc } from "firebase/firestore";
import { db } from "./firebase"; // Import your Firebase config

/**
 * Validate and normalize Firestore documents.
 * @param {Array} documents - The array of documents to validate.
 * @returns {Array} Validated and normalized documents.
 */
// const validateDocuments = (documents) => {
//   return documents.map((doc) => ({
//     id: doc.id || "",
//     name: doc.name || "Unnamed Product",
//     price: doc.price || 0, // Default price to 0
//     description: doc.description || "",
//     categoryId: doc.categoryId || "unknown",
//     productTypeId: doc.productTypeId || "unknown",
//     imageUrls: Array.isArray(doc.imageUrls) ? doc.imageUrls : [], // Ensure it's an array
//   }));
// };
const validateDocuments = (documents) => {
    return documents.map((doc) => ({
      id: doc.id || "",
      name: doc.name || "Unnamed Product Type", // Ensure a default name
      parent: doc.parent || null, // Allow null or parent ID
      ...doc, // Include other fields as-is
    }));
  };
  

/**
 * Add a document to a collection.
 * @param {string} collectionName - The name of the collection.
 * @param {Object} data - The data to add.
 * @returns {Object} The added document with its ID.
 */
export const addDocument = async (collectionName, data) => {
  if (!collectionName || !data) throw new Error("Collection name and data are required.");
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document in a collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to update.
 * @param {Object} data - The data to update.
 * @returns {Object} The updated document.
 */
export const updateDocument = async (collectionName, id, data) => {
  if (!collectionName || !id || !data) throw new Error("Collection name, ID, and data are required.");
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    return { id, ...data };
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document from a collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} id - The ID of the document to delete.
 * @returns {string} The ID of the deleted document.
 */
export const deleteDocument = async (collectionName, id) => {
  if (!collectionName || !id) throw new Error("Collection name and ID are required.");
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch all documents from a collection.
 * @param {string} collectionName - The name of the collection.
 * @returns {Array} An array of validated and normalized documents.
 */
export const fetchDocuments = async (collectionName) => {
  if (!collectionName) throw new Error("Collection name is required.");
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return validateDocuments(docs); // Validate documents before returning
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Fetch paginated documents from a collection.
 * @param {string} collectionName - Firestore collection name.
 * @param {Object} filters - Filters like { field: "brand", value: "Huawei" }.
 * @param {number} pageSize - Number of documents per page.
 * @param {Object} lastDoc - The last document snapshot (optional).
 * @returns {Object} { docs, lastVisible } - Fetched documents and the last visible document.
 */
export const fetchPaginatedDocuments = async (collectionName, filters, pageSize, lastDoc = null) => {
  if (!collectionName) throw new Error("Collection name is required.");
  try {
    const collectionRef = collection(db, collectionName);

    // Build query constraints
    const constraints = Object.entries(filters).map(([field, value]) => where(field, "==", value));
    constraints.push(orderBy("price", "asc")); // Example sorting by price
    constraints.push(limit(pageSize)); // Limit the number of documents per page

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    // Map Firestore documents to a usable format
    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { docs: validateDocuments(docs), lastVisible }; // Validate documents before returning
  } catch (error) {
    console.error(`Error fetching paginated documents from ${collectionName}:`, error);
    throw error;
  }
};
