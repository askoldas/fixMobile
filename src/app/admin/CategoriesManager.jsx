import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategories"; // Import the custom hook
import styles from "./styles/categories-manager.module.scss"; // Import the SCSS module

export default function CategoriesManager() {
  const { categories, loading, error, addCategory, updateCategory, deleteCategory } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState({});

  const handleAddEntry = async (name, type, parent = "") => {
    try {
      await addCategory({ name, type, parent });
      alert("Category added successfully!");
    } catch (err) {
      alert("Failed to add category. " + err.message);
    }
  };

  const handleUpdateEntry = async (id, updatedData) => {
    try {
      await updateCategory(id, updatedData);
      alert("Category updated successfully!");
    } catch (err) {
      alert("Failed to update category. " + err.message);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteCategory(id);
      alert("Category deleted successfully!");
    } catch (err) {
      alert("Failed to delete category. " + err.message);
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

  const renderCategories = (categories) => (
    <ul className={styles["categories-list"]}>
      {categories.map((category) => (
        <li key={category.id} className={styles["category-item"]}>
          <div className={styles["category-details"]} onClick={() => toggleExpand(category.id)}>
            <span>{category.name} ({category.type})</span>
            <span className={styles["category-actions"]}>
              <button
                className={styles["edit-button"]}
                onClick={(e) => {
                  e.stopPropagation();
                  const newName = prompt("Enter new name", category.name);
                  if (newName) handleUpdateEntry(category.id, { name: newName });
                }}
              >
                Edit
              </button>
              <button
                className={styles["delete-button"]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Are you sure you want to delete this entry?")) {
                    handleDeleteEntry(category.id);
                  }
                }}
              >
                Delete
              </button>
            </span>
          </div>
          {expandedCategories[category.id] && category.children.length > 0 && (
            <div className={styles["nested-categories"]}>
              {renderCategories(category.children)}
            </div>
          )}
          {expandedCategories[category.id] && category.type === "brand" && (
            <div className={styles["add-child-container"]}>
              <button
                className={styles["add-child-button"]}
                onClick={(e) => {
                  e.stopPropagation();
                  const childName = prompt("Enter new series name");
                  if (childName) {
                    handleAddEntry(childName, "series", category.id);
                  }
                }}
              >
                Add Series
              </button>
            </div>
          )}
          {expandedCategories[category.id] && category.type === "series" && (
            <div className={styles["add-child-container"]}>
              <button
                className={styles["add-child-button"]}
                onClick={(e) => {
                  e.stopPropagation();
                  const childName = prompt("Enter new model name");
                  if (childName) {
                    handleAddEntry(childName, "model", category.id);
                  }
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

  return (
    <div className={styles["manager-container"]}>
      <button
        className={styles["add-button"]}
        onClick={() => {
          const brandName = prompt("Enter new brand name");
          if (brandName) handleAddEntry(brandName, "brand");
        }}
      >
        Add New Brand
      </button>
      {loading ? <p className={styles["loading"]}>Loading...</p> : renderCategories(buildNestedStructure())}
      {error && <p className={styles["error-message"]}>{error}</p>}
    </div>
  );
}
