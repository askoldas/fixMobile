import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
} from "firebase/firestore";
import { db } from "./firebase.mjs";

/**
 * Add a document to a collection, supporting custom ID and slug conflict resolution.
 * @param {string} collectionName - The name of the collection.
 * @param {Object} data - The data to store.
 * @param {string} [customId] - Optional custom ID for the document.
 * @returns {Object} The stored document with its final ID.
 */
export const addDocument = async (collectionName, data, customId = null) => {
  if (!collectionName || !data) throw new Error("Collection name and data are required.");
  try {
    if (customId) {
      let finalId = customId;
      let counter = 1;

      // Ensure uniqueness: if doc exists, append a suffix
      while (true) {
        const existing = await getDoc(doc(db, collectionName, finalId));
        if (!existing.exists()) break;
        finalId = `${customId}-${counter++}`;
      }

      const finalRef = doc(db, collectionName, finalId);
      await setDoc(finalRef, { ...data, id: finalId });

      return { ...data, id: finalId };
    } else {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    }
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
 * Validate and normalize Firestore documents.
 * @param {Array} documents - The array of documents to validate.
 * @param {string} collectionName - The name of the collection to determine validation logic.
 * @returns {Array} Validated and normalized documents.
 */
const validateDocuments = (documents, collectionName) => {
  switch (collectionName) {
    case "Devices":
      return documents.map((doc) => ({
        id: doc.id || "",
        name: doc.name || "Unnamed Category",
        type: doc.type || "unknown",
        parent: doc.parent || null,
        ...doc,
      }));

    case "Products":
      return documents.map((doc) => ({
        id: doc.id || "",
        name: doc.name || "Unnamed Product",
        price: doc.price || 0,
        description: doc.description || "",
        categoryId: doc.categoryId || "unknown",
        productTypeId: doc.productTypeId || "unknown",
        imageUrls: Array.isArray(doc.imageUrls) ? doc.imageUrls : [],
      }));

    default:
      return documents;
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
    const validatedDocs = validateDocuments(docs, collectionName);
    return validatedDocs;
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

    const constraints = Object.entries(filters).map(([field, value]) => where(field, "==", value));
    constraints.push(orderBy("price", "asc"));
    constraints.push(limit(pageSize));
    if (lastDoc) constraints.push(startAfter(lastDoc));

    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    const validatedDocs = validateDocuments(docs, collectionName);
    return { docs: validatedDocs, lastVisible };
  } catch (error) {
    console.error(`Error fetching paginated documents from ${collectionName}:`, error);
    throw error;
  }
};
