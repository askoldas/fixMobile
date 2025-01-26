import React, { useState, useEffect } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products, categories, and product types on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    fetchProductTypes();
  }, [dispatch]);

  const fetchProductTypes = async () => {
    try {
      const types = await fetchDocuments("ProductTypes");
      setProductTypes(types);
    } catch (err) {
      console.error("Error fetching product types:", err);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

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

  return (
    <div className={styles["manager-container"]}>
      <h2>Products</h2>
      {error && <p className={styles["error-message"]}>{error}</p>}
      <button className={styles["add-button"]} onClick={handleAddProduct}>
        Add New Product
      </button>
      <ul className={styles["product-list"]}>
        {products.map((product) => (
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
