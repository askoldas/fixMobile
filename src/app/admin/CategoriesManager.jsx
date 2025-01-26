import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { addDocument, updateDocument, deleteDocument } from "@/lib/firebaseUtils";

export default function CategoriesManager() {
  const dispatch = useDispatch();

  // Redux selectors
  const categories = useSelector((state) => state.categories.items);
  const loading = useSelector((state) => state.categories.loading);
  const error = useSelector((state) => state.categories.error);

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddEntry = async (name, type, parent = "") => {
    if (!name.trim() || !type) {
      alert("Name and type are required.");
      return;
    }

    try {
      const newEntry = { name, type, parent };
      await addDocument("Devices", newEntry);

      // Refetch categories
      dispatch(fetchCategories());
      alert("Category added successfully!");
    } catch (err) {
      console.error("Error adding entry:", err);
      alert("Failed to add category.");
    }
  };

  const handleUpdateEntry = async (id, updatedData) => {
    try {
      await updateDocument("Devices", id, updatedData);

      // Refetch categories
      dispatch(fetchCategories());
      alert("Category updated successfully!");
    } catch (err) {
      console.error("Error updating entry:", err);
      alert("Failed to update category.");
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteDocument("Devices", id);

      // Refetch categories
      dispatch(fetchCategories());
      alert("Category deleted successfully!");
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete category.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildNestedStructure = () => {
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    const nestedCategories = [];
    categories.forEach((cat) => {
      if (cat.parent) {
        categoryMap[cat.parent]?.children.push(categoryMap[cat.id]);
      } else {
        nestedCategories.push(categoryMap[cat.id]);
      }
    });

    return nestedCategories;
  };

  const renderCategories = (categories) => {
    return (
      <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
        {categories.map((category) => (
          <li key={category.id} style={{ marginBottom: "20px" }}>
            <div
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                    if (window.confirm("Are you sure you want to delete this entry?")) {
                      handleDeleteEntry(category.id);
                    }
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Delete
                </button>
              </span>
            </div>
            {expandedCategories[category.id] && category.children.length > 0 && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                {renderCategories(category.children)}
              </div>
            )}
            {expandedCategories[category.id] && category.type === "brand" && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const childName = prompt("Enter new series name");
                    if (childName) {
                      handleAddEntry(childName, "series", category.id);
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    display: "block",
                    marginLeft: "auto",
                  }}
                >
                  Add Series
                </button>
              </div>
            )}
            {expandedCategories[category.id] && category.type === "series" && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const childName = prompt("Enter new model name");
                    if (childName) {
                      handleAddEntry(childName, "model", category.id);
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    display: "block",
                    marginLeft: "auto",
                  }}
                >
                  Add Model
                </button>
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
      {loading ? <p>Loading...</p> : renderCategories(buildNestedStructure())}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
