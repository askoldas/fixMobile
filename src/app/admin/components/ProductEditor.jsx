import React, { useEffect, useState } from "react";
import { useImageUrl } from "@/hooks/useImageUrl";

export default function ProductEditor({
  productData = {},
  categories = [],
  productTypes = [],
  onSave,
  onCancel,
  onDelete, // ✅ delete handler
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: 0,
    description: "",
    models: [],
    productType: "",
    brand: "",
    series: "",
  });

  useEffect(() => {
    if (productData) {
      const { name, price, quantity, description, modelIds, productTypeId } = productData;
      const firstModel = categories.find((c) => c.id === (modelIds?.[0] || ""));
      const series = firstModel ? categories.find((c) => c.id === firstModel.parent) : null;
      const brand = series ? categories.find((c) => c.id === series.parent) : null;

      setFormData({
        name: name || "",
        price: price || "",
        quantity: quantity || 0,
        description: description || "",
        models: modelIds || [],
        productType: productTypeId || "",
        brand: brand?.id || "",
        series: series?.id || "",
      });
    }
  }, [productData, categories]);

  const filteredBrands = categories.filter((cat) => cat.type === "brand");
  const filteredSeries = categories.filter((cat) => cat.type === "series" && cat.parent === formData.brand);
  const filteredModels = categories.filter((cat) => cat.type === "model" && cat.parent === formData.series);

  const handleSubmit = () => {
    if (!formData.name || !formData.price || formData.models.length === 0 || !formData.productType) {
      alert("All fields are required.");
      return;
    }

    const submission = {
      id: productData?.id || undefined,
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      description: formData.description,
      modelIds: formData.models,
      productTypeId: formData.productType,
      imageUrls: productData?.imageUrls || [],
    };

    onSave(submission);
  };

  const imageUrls = productData?.imageUrls || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const resolvedImageUrl = useImageUrl(imageUrls[currentImageIndex] || null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "20px" }}>
      {/* Column 1: Image Carousel */}
      <div style={{ textAlign: "center", position: "relative" }}>
        {resolvedImageUrl ? (
          <>
            <img
              src={resolvedImageUrl}
              alt={formData.name}
              style={{ width: "100%", marginBottom: "10px", borderRadius: "6px" }}
            />
            {imageUrls.length > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentImageIndex === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) => Math.min(prev + 1, imageUrls.length - 1))
                  }
                  disabled={currentImageIndex === imageUrls.length - 1}
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "150px",
              border: "1px dashed #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px",
              color: "#ccc",
              marginBottom: "10px",
            }}
          >
            No Image
          </div>
        )}
      </div>

      {/* Column 2: Text Inputs */}
      <div>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Product Name"
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="text"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Price"
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="Quantity"
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          style={{ display: "block", marginBottom: "10px", width: "100%", height: "80px" }}
        />
      </div>

      {/* Column 3: Select Fields */}
      <div>
        <select
          value={formData.productType}
          onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
          style={{ marginBottom: "10px", width: "100%" }}
        >
          <option value="">Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value, series: "", models: [] })}
          style={{ marginBottom: "10px", width: "100%" }}
        >
          <option value="">Select Brand</option>
          {filteredBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>

        {formData.brand && (
          <select
            value={formData.series}
            onChange={(e) => setFormData({ ...formData, series: e.target.value, models: [] })}
            style={{ marginBottom: "10px", width: "100%" }}
          >
            <option value="">Select Series</option>
            {filteredSeries.map((series) => (
              <option key={series.id} value={series.id}>{series.name}</option>
            ))}
          </select>
        )}

        {formData.series && (
          <div>
            <select
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !formData.models.includes(selected)) {
                  setFormData((prev) => ({ ...prev, models: [...prev.models, selected] }));
                }
              }}
              style={{ marginBottom: "10px", width: "100%" }}
            >
              <option value="">Select Model</option>
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>

            <ul>
              {formData.models.map((model) => (
                <li key={model}>
                  {categories.find((c) => c.id === model)?.name}
                  <button onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      models: prev.models.filter((m) => m !== model),
                    }))
                  }>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        {productData?.id && onDelete && (
          <button
            onClick={() => onDelete(productData.id)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Delete
          </button>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 12px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 12px",
              backgroundColor: "#ffc107",
              color: "#fff",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
