import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { fetchDocuments } from "@/lib/firebaseUtils";
import ProductFormModal from "@/app/admin/modals/ProductFormModal";
import styles from "./styles/products-manager.module.scss";

export default function ProductsManager() {
  const dispatch = useDispatch();

  // Redux selectors
  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.categories.items);
  const error = useSelector((state) => state.products.error || state.categories.error);

  const [productTypes, setProductTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Device Filtering States
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch product types from Firestore
  const fetchProductTypes = useCallback(async () => {
    try {
      const types = await fetchDocuments("ProductTypes");
      setProductTypes(types);
    } catch (err) {
      console.error("Error fetching product types:", err);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    fetchProductTypes();
  }, [dispatch, fetchProductTypes]);

  // Update filtered products when filters change
  useEffect(() => {
    let filtered = products;

    if (selectedType) {
      filtered = filtered.filter((product) => product.productType === selectedType);
    }
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brands && product.brands.includes(selectedBrand));
    }
    if (selectedSeries) {
      filtered = filtered.filter((product) => product.series && product.series.includes(selectedSeries));
    }
    if (selectedModel) {
      filtered = filtered.filter((product) => product.models && product.models.includes(selectedModel));
    }

    setFilteredProducts(filtered);
  }, [products, selectedType, selectedBrand, selectedSeries, selectedModel]);

  return (
    <div className={styles["manager-container"]}>
      <h2>Products</h2>
      {error && <p className={styles["error-message"]}>{error}</p>}
      <div className={styles["top-section"]}>
        <div className={styles["filters"]}>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">All Types</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedSeries(""); setSelectedModel(""); }}>
            <option value="">All Brands</option>
            {categories.filter((cat) => cat.type === "brand").map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          {selectedBrand && (
            <select value={selectedSeries} onChange={(e) => { setSelectedSeries(e.target.value); setSelectedModel(""); }}>
              <option value="">All Series</option>
              {categories.filter((cat) => cat.type === "series" && cat.parent === selectedBrand).map((ser) => (
                <option key={ser.id} value={ser.id}>{ser.name}</option>
              ))}
            </select>
          )}
          {selectedSeries && (
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              <option value="">All Models</option>
              {categories.filter((cat) => cat.type === "model" && cat.parent === selectedSeries).map((mod) => (
                <option key={mod.id} value={mod.id}>{mod.name}</option>
              ))}
            </select>
          )}
        </div>
        <button className={styles["add-button"]} onClick={() => setIsModalOpen(true)}>
          Add New Product
        </button>
      </div>
      <ul className={styles["product-list"]}>
        {filteredProducts.map((product) => (
          <li key={product.id} className={styles["product-item"]}>
            <span>
              {product.name} (${product.price})
            </span>
            <div className={styles["product-actions"]}>
              <button className={styles["edit-button"]} onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}>
                Edit
              </button>
              <button className={styles["delete-button"]} onClick={() => { if (window.confirm('Are you sure you want to delete this product?')) dispatch(deleteProduct(product.id)); }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(productData) => {
            if (editingProduct) {
              dispatch(updateProduct({ ...editingProduct, ...productData }));
            } else {
              dispatch(addProduct(productData));
            }
            setIsModalOpen(false);
          }}
          initialData={editingProduct}
          categories={categories}
          productTypes={productTypes}
        />
      )}
    </div>
  );
}
