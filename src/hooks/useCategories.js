import { useState, useEffect } from "react";
import {
  addDocument,
  updateDocument,
  deleteDocument,
  fetchDocuments,
} from "@/lib/firebaseUtils";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchDocuments("ProductTypes");
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
    if (!category.name?.trim()) {
      throw new Error("Name is required.");
    }

    try {
      const newCategory = await addDocument("ProductTypes", {
        name: category.name.trim(),
        parent: null,
      });
      setCategories((prev) => [...prev, newCategory]);
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      await updateDocument("ProductTypes", id, updatedData);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
      );
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDocument("ProductTypes", id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};
