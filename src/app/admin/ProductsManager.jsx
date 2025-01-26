import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    heading: "",
    description: "",
    brands: [],
    series: [],
    models: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      }
    };

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Devices"));
        setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || newProduct.brands.length === 0 || newProduct.series.length === 0 || newProduct.models.length === 0) {
      setError("All fields are required.");
      return;
    }
    setError(null);

    try {
      await addDoc(collection(db, "products"), newProduct);
      setProducts([...products, newProduct]);
      setNewProduct({
        name: "",
        price: "",
        heading: "",
        description: "",
        brands: [],
        series: [],
        models: [],
      });
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  const addToSelected = (key, value) => {
    setNewProduct((prev) => ({
      ...prev,
      [key]: [...prev[key], value],
    }));
  };

  const removeFromSelected = (key, value) => {
    setNewProduct((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== value),
    }));
  };

  const filteredSeries = categories.filter((cat) => newProduct.brands.includes(cat.parent));
  const filteredModels = categories.filter((cat) => newProduct.series.includes(cat.parent));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Products</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={{ marginRight: "10px", padding: "10px" }}
        />
        <input
          type="text"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          style={{ marginRight: "10px", padding: "10px" }}
        />
        <input
          type="text"
          placeholder="Heading"
          value={newProduct.heading}
          onChange={(e) => setNewProduct({ ...newProduct, heading: e.target.value })}
          style={{ marginRight: "10px", padding: "10px" }}
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          style={{ marginRight: "10px", padding: "10px", width: "100%", marginTop: "10px" }}
        ></textarea>

        <div style={{ marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <select
            onChange={(e) => addToSelected("brands", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="">Select Brand</option>
            {categories.filter((cat) => cat.type === "brand").map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "10px" }}>
            {newProduct.brands.map((brand) => (
              <li key={brand} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {categories.find((cat) => cat.id === brand)?.name}
                <button
                  onClick={() => removeFromSelected("brands", brand)}
                  style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {newProduct.brands.length > 0 && (
          <div style={{ marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <select
              onChange={(e) => addToSelected("series", e.target.value)}
              style={{ padding: "10px" }}
            >
              <option value="">Select Series</option>
              {filteredSeries.map((series) => (
                <option key={series.id} value={series.id}>
                  {series.name}
                </option>
              ))}
            </select>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "10px" }}>
              {newProduct.series.map((series) => (
                <li key={series} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {categories.find((cat) => cat.id === series)?.name}
                  <button
                    onClick={() => removeFromSelected("series", series)}
                    style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {newProduct.series.length > 0 && (
          <div style={{ marginBottom: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <select
              onChange={(e) => addToSelected("models", e.target.value)}
              style={{ padding: "10px" }}
            >
              <option value="">Select Model</option>
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "10px" }}>
              {newProduct.models.map((model) => (
                <li key={model} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {categories.find((cat) => cat.id === model)?.name}
                  <button
                    onClick={() => removeFromSelected("models", model)}
                    style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleAddProduct}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          Add Product
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{product.name} (${product.price})</span>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
