import React, { useState, useEffect } from "react";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories,
  productTypes,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    heading: "",
    description: "",
    brands: [],
    series: [],
    models: [],
    productType: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const addToSelected = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], value],
    }));
  };

  const removeFromSelected = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== value),
    }));
  };

  const filteredSeries = () => {
    return categories.filter((cat) => formData.brands.includes(cat.parent));
  };

  const filteredModels = () => {
    return categories.filter((cat) => formData.series.includes(cat.parent));
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.price ||
      formData.brands.length === 0 ||
      formData.series.length === 0 ||
      formData.models.length === 0 ||
      !formData.productType
    ) {
      alert("All fields are required.");
      return;
    }
    onSubmit(formData);
    setFormData({
      name: "",
      price: "",
      heading: "",
      description: "",
      brands: [],
      series: [],
      models: [],
      productType: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <h3>{initialData ? "Edit Product" : "Add Product"}</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        />
        <input
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
            height: "80px",
          }}
        ></textarea>
        <select
          value={formData.productType}
          onChange={(e) =>
            setFormData({ ...formData, productType: e.target.value })
          }
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        >
          <option value="">Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <div>
          <select
            onChange={(e) => addToSelected("brands", e.target.value)}
            style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
          >
            <option value="">Select Brand</option>
            {categories.filter((cat) => cat.type === "brand").map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <ul>
            {formData.brands.map((brand) => (
              <li key={brand}>
                {categories.find((cat) => cat.id === brand)?.name}{" "}
                <button onClick={() => removeFromSelected("brands", brand)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        {formData.brands.length > 0 && (
          <div>
            <select
              onChange={(e) => addToSelected("series", e.target.value)}
              style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
            >
              <option value="">Select Series</option>
              {filteredSeries().map((series) => (
                <option key={series.id} value={series.id}>
                  {series.name}
                </option>
              ))}
            </select>
            <ul>
              {formData.series.map((series) => (
                <li key={series}>
                  {categories.find((cat) => cat.id === series)?.name}{" "}
                  <button onClick={() => removeFromSelected("series", series)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {formData.series.length > 0 && (
          <div>
            <select
              onChange={(e) => addToSelected("models", e.target.value)}
              style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
            >
              <option value="">Select Model</option>
              {filteredModels().map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ul>
              {formData.models.map((model) => (
                <li key={model}>
                  {categories.find((cat) => cat.id === model)?.name}{" "}
                  <button onClick={() => removeFromSelected("models", model)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
