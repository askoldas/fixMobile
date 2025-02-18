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
      filtered = filtered.filter((product) => product.productTypeId === selectedType);
    }
    if (selectedModel) {
      filtered = filtered.filter((product) => product.categoryId === selectedModel);
    }

    setFilteredProducts(filtered);
  }, [products, selectedType, selectedModel]);

  // Handle product deletion
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Handle product addition & editing
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (productData) => {
    if (editingProduct) {
      dispatch(updateProduct({ ...editingProduct, ...productData }));
      alert("Product updated successfully!");
    } else {
      dispatch(addProduct(productData));
      alert("Product added successfully!");
    }
    setIsModalOpen(false);
  };

  // Extract unique brands, series, and models dynamically
  const brands = categories.filter((cat) => cat.type === "brand");
  const series = categories.filter((cat) => cat.type === "series" && cat.parent === selectedBrand);
  const models = categories.filter((cat) => cat.type === "model" && cat.parent === selectedSeries);

  return (
    <div className={styles["manager-container"]}>
      <h2>Products</h2>
      {error && <p className={styles["error-message"]}>{error}</p>}
  
      {/* Top Section with Filters and Add Button */}
      <div className={styles["top-section"]}>
        <div className={styles["filters"]}>
          <select
            className={styles["filter-dropdown"]}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
  
          <select
            className={styles["filter-dropdown"]}
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedSeries("");
              setSelectedModel("");
            }}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
  
          {selectedBrand && (
            <select
              className={styles["filter-dropdown"]}
              value={selectedSeries}
              onChange={(e) => {
                setSelectedSeries(e.target.value);
                setSelectedModel("");
              }}
            >
              <option value="">All Series</option>
              {series.map((ser) => (
                <option key={ser.id} value={ser.id}>
                  {ser.name}
                </option>
              ))}
            </select>
          )}
  
          {selectedSeries && (
            <select
              className={styles["filter-dropdown"]}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">All Models</option>
              {models.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.name}
                </option>
              ))}
            </select>
          )}
        </div>
  
        <button className={styles["add-button"]} onClick={handleAddProduct}>
          Add New Product
        </button>
      </div>
  
      {/* Product List */}
      <ul className={styles["product-list"]}>
        {filteredProducts.map((product) => (
          <li key={product.id} className={styles["product-item"]}>
            <span>
              {product.name} (${product.price})
            </span>
            <div className={styles["product-actions"]}>
              <button
                className={styles["edit-button"]}
                onClick={() => handleEditProduct(product)}
              >
                Edit
              </button>
              <button
                className={styles["delete-button"]}
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
  
      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          categories={categories}
          productTypes={productTypes}
        />
      )}
    </div>
  );
  
}