import { useState, useEffect } from "react";
import { addDocument, updateDocument, deleteDocument, fetchDocuments } from "@/lib/firebaseUtils";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchDocuments("Devices");
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async (category) => {
    if (!category.name?.trim() || !category.type) {
      throw new Error("Name and type are required.");
    }

    try {
      const newCategory = await addDocument("Devices", category);
      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      await updateDocument("Devices", id, updatedData);
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? { ...category, ...updatedData } : category))
      );
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDocument("Devices", id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};
