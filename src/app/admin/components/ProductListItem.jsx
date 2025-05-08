import React, { useState, useEffect } from "react";
import styles from "../styles/products-manager.module.scss";
import { useImageUrl } from '@/hooks/useImageUrl';

export default function ProductListItem({ product, onEdit, onInlineEdit, onDelete, isExpanded, onToggleExpand, categories, productTypes }) {
  const [editData, setEditData] = useState({
    name: product.name || "",
    price: product.price || "",
    quantity: product.quantity || 0,
    description: product.description || "",
    models: product.modelIds || [],
    productType: product.productTypeId || "",
    brand: "",
    series: "",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const resolvedImageUrl = useImageUrl(product.imageUrls?.[currentImageIndex] || null);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const firstModel = categories.find((cat) => cat.id === editData.models[0]);
      if (firstModel) {
        const series = categories.find((cat) => cat.id === firstModel.parent);
        const brand = series ? categories.find((cat) => cat.id === series.parent) : null;
        setEditData((prev) => ({ ...prev, brand: brand?.id || "", series: series?.id || "" }));
      }
    }
  }, [categories]);

  const filteredBrands = categories?.filter((cat) => cat.type === "brand") || [];
  const filteredSeries = categories?.filter((cat) => cat.type === "series" && cat.parent === editData.brand) || [];
  const filteredModels = categories?.filter((cat) => cat.type === "model" && cat.parent === editData.series) || [];

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      name: editData.name,
      price: parseFloat(editData.price),
      quantity: parseInt(editData.quantity),
      description: editData.description,
      productTypeId: editData.productType,
      modelIds: editData.models,
    };
    onInlineEdit(updatedProduct);
    onToggleExpand();
  };

  return (
    <>
      <li
        className={styles["product-item"]}
        onClick={onToggleExpand}
        style={{
          cursor: "pointer",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "5px",
          marginBottom: "5px",
          display: "grid",
          gridTemplateColumns: "1fr 160px 160px",
          alignItems: "center",
        }}
      >
        <span style={{ textAlign: "left" }}>{product.name}</span>
        <span style={{ textAlign: "right" }}>
          {typeof product.price === "number" ? product.price.toFixed(2) : "0.00"} €
        </span>
        <span style={{ textAlign: "right" }}>
          {typeof product.quantity === "number" ? product.quantity : 0}
        </span>
      </li>

      {isExpanded && (
        <div
          style={{
            marginBottom: "15px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#fff",
            display: "grid",
            gridTemplateColumns: "1fr 2fr 2fr",
            gap: "20px",
          }}
        >
          {/* Left Column: Image Carousel */}
          <div style={{ textAlign: "center", position: "relative" }}>
            {resolvedImageUrl ? (
              <>
                <img
                  src={resolvedImageUrl}
                  alt={product.name}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
                    }}
                    disabled={currentImageIndex === 0}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        Math.min(prev + 1, product.imageUrls.length - 1)
                      );
                    }}
                    disabled={currentImageIndex === product.imageUrls.length - 1}
                  >
                    →
                  </button>
                </div>
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
                  marginBottom: "10px"
                }}
              >
                Loading image...
              </div>
            )}
          </div>

          {/* Middle Column: Text fields */}
          <div>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Product Name"
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              placeholder="Price"
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
            <input
              type="number"
              value={editData.quantity}
              onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
              placeholder="Quantity"
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
              style={{ display: "block", marginBottom: "10px", width: "100%", height: "80px" }}
            />
          </div>

          {/* Right Column: Selectors */}
          <div>
            <select
              value={editData.productType}
              onChange={(e) => setEditData({ ...editData, productType: e.target.value })}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            >
              <option value="">Select Product Type</option>
              {productTypes?.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              value={editData.brand}
              onChange={(e) => setEditData({ ...editData, brand: e.target.value, series: "", models: [] })}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            >
              <option value="">Select Brand</option>
              {filteredBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            {editData.brand && (
              <select
                value={editData.series}
                onChange={(e) => setEditData({ ...editData, series: e.target.value, models: [] })}
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
              >
                <option value="">Select Series</option>
                {filteredSeries.map((series) => (
                  <option key={series.id} value={series.id}>{series.name}</option>
                ))}
              </select>
            )}
            {editData.series && (
              <div>
                <select
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected && !editData.models.includes(selected)) {
                      setEditData((prev) => ({ ...prev, models: [...prev.models, selected] }));
                    }
                  }}
                  style={{ display: "block", marginBottom: "10px", width: "100%" }}
                >
                  <option value="">Select Model</option>
                  {filteredModels.map((model) => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {editData.models.map((modelId) => {
                    const model = categories.find((cat) => cat.id === modelId);
                    return model ? (
                      <li key={modelId} style={{ marginBottom: "5px" }}>
                        {model.name}
                        <button
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              models: prev.models.filter((m) => m !== modelId),
                            }))
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          ×
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button onClick={handleSave} style={{ padding: "8px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", marginRight: "10px" }}>Save Changes</button>
            <button onClick={onToggleExpand} style={{ padding: "8px 12px", backgroundColor: "#ffc107", color: "#fff", border: "none", borderRadius: "4px", marginRight: "10px" }}>Cancel</button>
            <button onClick={() => onDelete(product.id)} style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}>Delete</button>
          </div>
        </div>
      )}
    </>
  );
}
