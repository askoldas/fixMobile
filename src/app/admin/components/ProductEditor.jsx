import React, { useEffect, useState } from "react";
import Button from "@/global/components/base/Button";
import ImageSlider from "@/app/admin/components/ImageSlider";
import styles from "@/app/admin/styles/product-editor.module.scss";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import slugify from "slugify";

export default function ProductEditor({
  productData = {},
  categories = [],
  productTypes = [],
  onSave,
  onCancel,
  onDelete,
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

  const [newImages, setNewImages] = useState([]);

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || formData.models.length === 0 || !formData.productType) {
      alert("All fields are required.");
      return;
    }

    const storage = getStorage();
    const uploadedPaths = [];

    for (const file of newImages) {
      const brandName = categories.find((c) => c.id === formData.brand)?.name || "unknown-brand";
      const modelName = categories.find((c) => c.id === formData.models[0])?.name || "unknown-model";

      const brandSlug = slugify(brandName, { lower: true });
      const modelSlug = slugify(modelName, { lower: true });

      const path = `products/${brandSlug}/${modelSlug}/${file.name}`;
      const storageRef = ref(storage, path);

      try {
        await uploadBytes(storageRef, file);
        uploadedPaths.push(path);
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    const submission = {
      id: productData?.id || undefined,
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      description: formData.description,
      imageUrls: [...(productData?.imageUrls || []), ...uploadedPaths],
      modelIds: formData.models,
      productTypeId: formData.productType,
      brandIds: formData.brand ? [formData.brand] : [],
    };

    onSave(submission);
  };

  return (
    <div className={styles.editorGrid}>
      {/* Column 1: Image Slider */}
      <ImageSlider
        imageUrls={productData?.imageUrls || []}
        onAddImage={(file) => setNewImages((prev) => [...prev, file])}
      />

      {/* Column 2: Text Fields */}
      <div className={styles.formSection}>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product Name" />
        <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" />
        <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="Quantity" />
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
      </div>

      {/* Column 3: Selects */}
      <div className={styles.formSection}>
        <select value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })}>
          <option value="">Select Product Type</option>
          {productTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value, series: "", models: [] })}>
          <option value="">Select Brand</option>
          {filteredBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>

        {formData.brand && (
          <select value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value, models: [] })}>
            <option value="">Select Series</option>
            {filteredSeries.map((series) => (
              <option key={series.id} value={series.id}>{series.name}</option>
            ))}
          </select>
        )}

        {formData.series && (
          <>
            <select onChange={(e) => {
              const selected = e.target.value;
              if (selected && !formData.models.includes(selected)) {
                setFormData((prev) => ({ ...prev, models: [...prev.models, selected] }));
              }
            }}>
              <option value="">Select Model</option>
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>

            <ul className={styles.modelList}>
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
          </>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {productData?.id && onDelete && (
          <Button variant="secondary" size="s" onClick={onDelete}>
            Delete
          </Button>
        )}
        <div className={styles.rightGroup}>
          <Button variant="primary" size="s" onClick={handleSubmit}>Save</Button>
          <Button variant="secondary" size="s" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
