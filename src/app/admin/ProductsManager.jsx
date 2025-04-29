import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import {
  fetchProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { fetchDocuments } from "@/lib/firebaseUtils";
import ProductFormModal from "@/app/admin/modals/ProductFormModal";
import ProductList from "@/app/admin/components/ProductList";
import styles from "./styles/products-manager.module.scss";

export default function ProductsManager() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.categories.items);
  const error = useSelector(
    (state) => state.products.error || state.categories.error
  );

  const [productTypes, setProductTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const fetchProductTypes = useCallback(async () => {
    try {
      const types = await fetchDocuments("ProductTypes");
      setProductTypes(types);
    } catch (err) {
      console.error("Error fetching product types:", err);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    fetchProductTypes();
  }, [dispatch, fetchProductTypes]);

  useEffect(() => {
    let filtered = [...products];

    if (selectedType) {
      filtered = filtered.filter(
        (product) => product.productTypeId === selectedType.value
      );
    }

    if (selectedModel) {
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.modelIds) &&
          product.modelIds.includes(selectedModel.value)
      );
    } else if (selectedSeries) {
      const models = categories
        .filter((cat) => cat.type === "model" && cat.parent === selectedSeries.value)
        .map((m) => m.id);
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.modelIds) &&
          product.modelIds.some((id) => models.includes(id))
      );
    } else if (selectedBrand) {
      const series = categories
        .filter((cat) => cat.type === "series" && cat.parent === selectedBrand.value)
        .map((s) => s.id);
      const models = categories
        .filter((cat) => cat.type === "model" && series.includes(cat.parent))
        .map((m) => m.id);
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.modelIds) &&
          product.modelIds.some((id) => models.includes(id))
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [products, selectedType, selectedBrand, selectedSeries, selectedModel, categories]);

  const brandOptions = categories
    .filter((cat) => cat.type === "brand")
    .map((brand) => ({ value: brand.id, label: brand.name }));

  const seriesOptions = categories
    .filter((cat) => cat.type === "series" && (!selectedBrand || cat.parent === selectedBrand.value))
    .map((ser) => ({ value: ser.id, label: ser.name }));

  const modelOptions = categories
    .filter((cat) => {
      if (cat.type !== "model") return false;
      if (selectedSeries) return cat.parent === selectedSeries.value;
      if (selectedBrand) {
        const seriesUnderBrand = categories
          .filter((ser) => ser.type === "series" && ser.parent === selectedBrand.value)
          .map((ser) => ser.id);
        return seriesUnderBrand.includes(cat.parent);
      }
      return true; // no brand or series selected
    })
    .map((mod) => ({ value: mod.id, label: mod.name }));

  const typeOptions = productTypes.map((type) => ({ value: type.id, label: type.name }));

  const handleInlineEdit = (updatedProduct) => {
    dispatch(updateProduct(updatedProduct));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles["manager-container"]}>
      <h2>Products</h2>
      {error && <p className={styles["error-message"]}>{error}</p>}
      <div className={styles["top-section"]}>
        <div className={styles["filters"]}>
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={(option) => setSelectedType(option)}
            placeholder="Select Product Type"
            isClearable
          />
          <Select
            options={brandOptions}
            value={selectedBrand}
            onChange={(option) => {
              setSelectedBrand(option);
              setSelectedSeries(null);
              setSelectedModel(null);
            }}
            placeholder="Select Brand"
            isClearable
          />
          <Select
            options={seriesOptions}
            value={selectedSeries}
            onChange={(option) => {
              setSelectedSeries(option);
              setSelectedModel(null);
            }}
            placeholder="Select Series"
            isClearable
          />
          <Select
            options={modelOptions}
            value={selectedModel}
            onChange={(option) => setSelectedModel(option)}
            placeholder="Select Model"
            isClearable
          />
        </div>
        <button
          className={styles["add-button"]}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Product
        </button>
      </div>
      <ProductList
        products={currentProducts}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsModalOpen(true);
        }}
        onInlineEdit={handleInlineEdit}
        onDelete={(productId) => {
          if (window.confirm("Are you sure you want to delete this product?"))
            dispatch(deleteProduct(productId));
        }}
        categories={categories}
        productTypes={productTypes}
      />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
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