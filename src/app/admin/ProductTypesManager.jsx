import React, { useEffect, useState } from "react";
import { addDocument, updateDocument, deleteDocument, fetchDocuments } from "@/lib/firebaseUtils"; // Firebase utilities
import styles from "./styles/product-types-manager.module.scss"; // SCSS styles

export default function ProductTypesManager() {
  const [productTypes, setProductTypes] = useState([]); // Product types state
  const [expandedTypes, setExpandedTypes] = useState({}); // Tracks expanded product types

  // Fetch product types on component mount
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const data = await fetchDocuments("ProductTypes"); // Fetch all product types
        setProductTypes(data);
      } catch (err) {
        console.error("Error fetching product types:", err);
        alert("Failed to fetch product types.");
      }
    };

    fetchProductTypes();
  }, []);

  // Add a new product type or subcategory
  const handleAddType = async (name, parent = null) => {
    if (!name.trim()) {
      alert("Product type name is required.");
      return;
    }

    try {
      const newType = { name, parent };
      const addedType = await addDocument("ProductTypes", newType);
      setProductTypes((prev) => [...prev, addedType]); // Update local state
      alert("Product type added successfully!");
    } catch (err) {
      console.error("Error adding product type:", err);
      alert("Failed to add product type.");
    }
  };

  // Update an existing product type
  const handleUpdateType = async (id, updatedData) => {
    if (!updatedData.name.trim()) {
      alert("Product type name is required.");
      return;
    }

    try {
      await updateDocument("ProductTypes", id, updatedData);
      setProductTypes((prev) =>
        prev.map((type) => (type.id === id ? { ...type, ...updatedData } : type))
      );
      alert("Product type updated successfully!");
    } catch (err) {
      console.error("Error updating product type:", err);
      alert("Failed to update product type.");
    }
  };

  // Delete a product type
  const handleDeleteType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product type and its subcategories?")) {
      return;
    }

    try {
      // Delete subcategories along with the parent
      const deleteRecursively = async (parentId) => {
        const children = productTypes.filter((type) => type.parent === parentId);
        for (const child of children) {
          await deleteDocument("ProductTypes", child.id);
        }
        await deleteDocument("ProductTypes", parentId);
      };

      await deleteRecursively(id);
      setProductTypes((prev) => prev.filter((type) => type.id !== id && type.parent !== id));
      alert("Product type deleted successfully!");
    } catch (err) {
      console.error("Error deleting product type:", err);
      alert("Failed to delete product type.");
    }
  };

  // Toggle expanded state for parent types
  const toggleExpand = (id) => {
    setExpandedTypes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build a nested structure (stops at two levels)
  const buildNestedStructure = (parentId = null, depth = 0) => {
    if (depth > 1) return []; // Limit to two levels

    return productTypes
      .filter((type) => type.parent === parentId)
      .map((type) => ({
        ...type,
        children: buildNestedStructure(type.id, depth + 1), // Recursion with depth control
      }));
  };

  // Recursive render function (with two-level limit)
  const renderProductTypes = (types, depth = 0) => {
    return (
      <ul className={styles["types-list"]}>
        {types.map((type) => (
          <li key={type.id} className={styles["type-item"]}>
            <div className={styles["type-details"]} onClick={() => toggleExpand(type.id)}>
              <span>{type.name}</span>
              <span className={styles["type-actions"]}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newName = prompt("Enter new name", type.name);
                    if (newName) handleUpdateType(type.id, { name: newName });
                  }}
                  className={styles["edit-button"]}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteType(type.id);
                  }}
                  className={styles["delete-button"]}
                >
                  Delete
                </button>
              </span>
            </div>
            {expandedTypes[type.id] && type.children.length > 0 && (
              <div className={styles["nested-types"]}>
                {renderProductTypes(type.children, depth + 1)}
              </div>
            )}
            {expandedTypes[type.id] && depth < 1 && (
              <div className={styles["add-child-container"]}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const childName = prompt("Enter subcategory name");
                    if (childName) {
                      handleAddType(childName, type.id);
                    }
                  }}
                  className={styles["add-child-button"]}
                >
                  Add Subcategory
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles["manager-container"]}>
      <button
        onClick={() => {
          const typeName = prompt("Enter new product type name");
          if (typeName) handleAddType(typeName);
        }}
        className={styles["add-button"]}
      >
        Add New Product Type
      </button>
      {renderProductTypes(buildNestedStructure())}
    </div>
  );
}
