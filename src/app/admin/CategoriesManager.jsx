import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newEntry, setNewEntry] = useState({ name: "", type: "", parent: "" });
  const [currentParentId, setCurrentParentId] = useState(null); // Track the selected brand
  const [currentChildId, setCurrentChildId] = useState(null); // Track the selected series
  const [filteredCategories, setFilteredCategories] = useState([]); // Series
  const [filteredSubcategories, setFilteredSubcategories] = useState([]); // Models

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
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

  // Filter series when a brand is selected
  useEffect(() => {
    if (currentParentId) {
      const filtered = categories.filter((cat) => cat.parent === currentParentId);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
    setFilteredSubcategories([]); // Reset models
    setCurrentChildId(null); // Reset selected series
  }, [currentParentId, categories]);

  // Filter models when a series is selected
  useEffect(() => {
    if (currentChildId) {
      const filtered = categories.filter((cat) => cat.parent === currentChildId);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [currentChildId, categories]);

  const handleAddEntry = async () => {
    if (!newEntry.name.trim() || !newEntry.type) {
      setError("Name and type are required.");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "categories"), newEntry);
      const newCategory = { id: docRef.id, ...newEntry };
      setCategories([...categories, newCategory]); // Update state immediately
      setNewEntry({ name: "", type: "", parent: "" });
      setError(null);
    } catch (err) {
      console.error("Error adding entry:", err);
      setError("Failed to add entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Manage Categories</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Add Entry */}
      <h3>Add Entry</h3>
      <input
        type="text"
        placeholder="Name"
        value={newEntry.name}
        onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
        style={{ padding: "10px", marginRight: "10px" }}
      />
      <select
        value={newEntry.type}
        onChange={(e) => {
          setNewEntry({ ...newEntry, type: e.target.value, parent: "" }); // Reset parent when type changes
        }}
        style={{ padding: "10px", marginRight: "10px" }}
      >
        <option value="">Select Type</option>
        <option value="brand">Brand</option>
        <option value="series">Series</option>
        <option value="model">Model</option>
      </select>
      <select
        value={newEntry.parent}
        onChange={(e) => setNewEntry({ ...newEntry, parent: e.target.value })}
        style={{ padding: "10px" }}
        disabled={newEntry.type === "brand"} // Disable parent for brands
      >
        <option value="">Select Parent</option>
        {categories
          .filter((cat) =>
            newEntry.type === "series" ? cat.type === "brand" : cat.type === "series"
          )
          .map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
      </select>
      <button
        onClick={handleAddEntry}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Entry"}
      </button>

      {/* Display Brands */}
      <h3>Brands</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories
          .filter((cat) => !cat.parent) // Only brands
          .map((cat) => (
            <li
              key={cat.id}
              onClick={() => setCurrentParentId(cat.id)} // Set current brand to filter series
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              {cat.name} ({cat.type})
            </li>
          ))}
      </ul>

      {/* Display Series */}
      {filteredCategories.length > 0 && (
        <>
          <h3>Series</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredCategories.map((series) => (
              <li
                key={series.id}
                onClick={() => setCurrentChildId(series.id)} // Set series to filter models
                style={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                {series.name} ({series.type})
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Display Models */}
      {filteredSubcategories.length > 0 && (
        <>
          <h3>Models</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredSubcategories.map((model) => (
              <li
                key={model.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                {model.name} ({model.type})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
