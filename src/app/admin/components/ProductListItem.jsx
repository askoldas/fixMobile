import React, { useState, useEffect } from "react";
import styles from "../styles/products-manager.module.scss";

export default function ProductListItem({ product, onEdit, onDelete, categories, productTypes }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name || "",
    price: product.price || "",
    description: product.description || "",
    models: product.modelIds || [],
    productType: product.productTypeId || "",
    brand: "",
    series: "",
  });

  useEffect(() => {
    // Set brand and series based on models
    const firstModel = categories.find((cat) => cat.id === editData.models[0]);
    if (firstModel) {
      const series = categories.find((cat) => cat.id === firstModel.parent);
      const brand = series ? categories.find((cat) => cat.id === series.parent) : null;
      setEditData((prev) => ({ ...prev, brand: brand?.id || "", series: series?.id || "" }));
    }
  }, []);

  const filteredBrands = categories.filter((cat) => cat.type === "brand");
  const filteredSeries = categories.filter((cat) => cat.type === "series" && cat.parent === editData.brand);
  const filteredModels = categories.filter((cat) => cat.type === "model" && cat.parent === editData.series);

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      name: editData.name,
      price: parseFloat(editData.price),
      description: editData.description,
      productTypeId: editData.productType,
      modelIds: editData.models,
    };
    onEdit(updatedProduct);
    setIsExpanded(false);
  };

  return (
    <li className={styles["product-item"]}>
      <div onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: "pointer" }}>
        <span>
          {product.name} (${product.price.toFixed(2)})
        </span>
      </div>
      {isExpanded && (
        <div className={styles["expanded-section"]}>
          {product.imageUrls && product.imageUrls.length > 0 && (
            <div className={styles["image-gallery"]}>
              {product.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={product.name} style={{ width: "100px", marginRight: "10px" }} />
              ))}
            </div>
          )}
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Product Name"
            className={styles["input"]}
          />
          <input
            type="text"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
            placeholder="Price"
            className={styles["input"]}
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description"
            className={styles["textarea"]}
          />
          <select
            value={editData.productType}
            onChange={(e) => setEditData({ ...editData, productType: e.target.value })}
            className={styles["select"]}
          >
            <option value="">Select Product Type</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <select
            value={editData.brand}
            onChange={(e) => setEditData({ ...editData, brand: e.target.value, series: "", models: [] })}
            className={styles["select"]}
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
              className={styles["select"]}
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
                className={styles["select"]}
              >
                <option value="">Select Model</option>
                {filteredModels.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
              <ul className={styles["model-list"]}>
                {editData.models.map((modelId) => (
                  <li key={modelId}>
                    {categories.find((cat) => cat.id === modelId)?.name}
                    <button onClick={() => setEditData((prev) => ({ ...prev, models: prev.models.filter((m) => m !== modelId) }))}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles["action-buttons"]}>
            <button onClick={handleSave} className={styles["save-button"]}>Save Changes</button>
            <button onClick={() => setIsExpanded(false)} className={styles["cancel-button"]}>Cancel</button>
            <button onClick={() => onDelete(product.id)} className={styles["delete-button"]}>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}
