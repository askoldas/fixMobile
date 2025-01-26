import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Devices"));
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleAddEntry = async (name, type, parent = "") => {
    if (!name.trim() || !type) {
      setError("Name and type are required.");
      return;
    }

    setLoading(true);
    try {
      const newEntry = { name, type, parent };
      const docRef = await addDoc(collection(db, "Devices"), newEntry);
      const newCategory = { id: docRef.id, ...newEntry };
      setCategories([...categories, newCategory]); // Update state immediately
      setError(null);
    } catch (err) {
      console.error("Error adding entry:", err);
      setError("Failed to add entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async (id, updatedData) => {
    try {
      const categoryRef = doc(db, "Devices", id);
      await updateDoc(categoryRef, updatedData);
      setCategories(categories.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat)));
    } catch (err) {
      console.error("Error updating entry:", err);
      setError("Failed to update entry.");
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      // Find all child categories
      const childrenQuery = query(collection(db, "Devices"), where("parent", "==", id));
      const childrenSnapshot = await getDocs(childrenQuery);
      const children = childrenSnapshot.docs;

      // Delete all child categories recursively
      for (const child of children) {
        await handleDeleteEntry(child.id);
      }

      // Delete the category itself
      await deleteDoc(doc(db, "Devices", id));
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
      setError("Failed to delete entry.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildNestedStructure = () => {
    const categoryMap = {};

    // Create a map of categories by ID
    categories.forEach((cat) => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    const nestedCategories = [];

    // Populate the children array for each category
    categories.forEach((cat) => {
      if (cat.parent) {
        categoryMap[cat.parent]?.children.push(categoryMap[cat.id]);
      } else {
        nestedCategories.push(categoryMap[cat.id]);
      }
    });

    return nestedCategories;
  };

  const renderCategories = (categories, parentId = "") => {
    return (
      <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
        {categories.map((category) => (
          <li key={category.id} style={{ marginBottom: "10px" }}>
            <div
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
              onClick={() => toggleExpand(category.id)}
            >
              <span>{category.name} ({category.type})</span>
              <span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newName = prompt("Enter new name", category.name);
                    if (newName) handleUpdateEntry(category.id, { name: newName });
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this entry? This will also delete all its children.")) {
                      handleDeleteEntry(category.id);
                    }
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Delete
                </button>
              </span>
            </div>
            {expandedCategories[category.id] && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                {category.children.length > 0 && renderCategories(category.children)}
                {category.type !== "model" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const childName = prompt(
                        `Enter new ${category.type === "brand" ? "series" : "model"} name`
                      );
                      if (childName) {
                        handleAddEntry(
                          childName,
                          category.type === "brand" ? "series" : "model",
                          category.id
                        );
                      }
                    }}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      marginTop: "10px",
                      display: "block",
                      marginLeft: "auto",
                    }}
                  >
                    Add {category.type === "brand" ? "Series" : "Model"}
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={() => {
          const brandName = prompt("Enter new brand name");
          if (brandName) handleAddEntry(brandName, "brand");
        }}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginBottom: "20px",
          display: "block",
          marginLeft: "auto",
        }}
      >
        Add New Brand
      </button>

      {renderCategories(buildNestedStructure())}
    </div>
  );
}
