import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "./firebase"; // Import your Firebase config

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
 * @returns {Array} An array of documents.
 */
export const fetchDocuments = async (collectionName) => {
  if (!collectionName) throw new Error("Collection name is required.");
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw error;
  }
};
