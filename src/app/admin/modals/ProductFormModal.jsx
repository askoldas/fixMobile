import React, { useState, useEffect } from "react";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  productTypes = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    models: [],
    productType: "",
    brand: "",
    series: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        models: initialData.modelIds || [],
        productType: initialData.productTypeId || "",
        brand: "",
        series: "",
      });
    }
  }, [initialData]);

  const filteredBrands = () => {
    return categories.filter((cat) => cat.type === "brand");
  };

  const filteredSeries = () => {
    return categories.filter((cat) => cat.type === "series" && cat.parent === formData.brand);
  };

  const filteredModels = () => {
    return categories.filter((cat) => cat.type === "model" && cat.parent === formData.series);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || formData.models.length === 0 || !formData.productType) {
      alert("All fields are required.");
      return;
    }
    const submission = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      modelIds: formData.models,
      productTypeId: formData.productType,
    };
    onSubmit(submission);
    setFormData({ name: "", price: "", description: "", models: [], productType: "", brand: "", series: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px", width: "80%", maxWidth: "500px" }}>
        <h3>{initialData ? "Edit Product" : "Add Product"}</h3>
        <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ marginBottom: "10px", padding: "10px", width: "100%" }} />
        <input type="text" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ marginBottom: "10px", padding: "10px", width: "100%" }} />
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ marginBottom: "10px", padding: "10px", width: "100%", height: "80px" }}></textarea>
        <select value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })} style={{ marginBottom: "10px", padding: "10px", width: "100%" }}>
          <option value="">Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value, series: "", models: [] })} style={{ marginBottom: "10px", padding: "10px", width: "100%" }}>
          <option value="">Select Brand</option>
          {filteredBrands().map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>
        {formData.brand && (
          <select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value, models: [] })} style={{ marginBottom: "10px", padding: "10px", width: "100%" }}>
            <option value="">Select Series</option>
            {filteredSeries().map((series) => (
              <option key={series.id} value={series.id}>{series.name}</option>
            ))}
          </select>
        )}
        {formData.series && (
          <div style={{ marginBottom: "10px" }}>
            <select onChange={(e) => {
              const selected = e.target.value;
              if (selected && !formData.models.includes(selected)) {
                setFormData((prev) => ({ ...prev, models: [...prev.models, selected] }));
              }
            }} style={{ marginBottom: "10px", padding: "10px", width: "100%" }}>
              <option value="">Select Model</option>
              {filteredModels().map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
            <ul>
              {formData.models.map((model) => (
                <li key={model}>{categories.find((cat) => cat.id === model)?.name} <button onClick={() => setFormData((prev) => ({ ...prev, models: prev.models.filter((m) => m !== model) }))}>×</button></li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleSubmit} style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>Submit</button>
          <button onClick={onClose} style={{ padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
