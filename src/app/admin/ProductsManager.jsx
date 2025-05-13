'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Pagination from "@/global/components/ui/Pagination";
import Button from "@/global/components/base/Button";
import useFilteredProducts from "@/hooks/useFilteredProducts";

import styles from "./styles/products-manager.module.scss";

export default function ProductsManager() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.categories.items);
  const error = useSelector(
    (state) => state.products.error || state.categories.error
  );

  const [productTypes, setProductTypes] = useState([]);
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

  const prevFilterKey = `${selectedType?.value}-${selectedBrand?.value}-${selectedSeries?.value}-${selectedModel?.value}`;

  useEffect(() => {
    setCurrentPage(1);
  }, [prevFilterKey]);

  const filteredProducts = useFilteredProducts({
    products,
    categories,
    selectedType,
    selectedBrand,
    selectedSeries,
    selectedModel,
  });

  const brandOptions = categories
    .filter((cat) => cat.type === "brand")
    .map((brand) => ({ value: brand.id, label: brand.name }));

  const seriesOptions = categories
    .filter(
      (cat) => cat.type === "series" && (!selectedBrand || cat.parent === selectedBrand.value)
    )
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
      return true;
    })
    .map((mod) => ({ value: mod.id, label: mod.name }));

  const typeOptions = productTypes.map((type) => ({ value: type.id, label: type.name }));

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

        <Button
          variant="primary"
          size="m"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          Add New
        </Button>
      </div>

      <ProductList
        products={currentProducts}
        onEdit={(product) => {
          setEditingProduct(product);
          setIsModalOpen(true);
        }}
        onDelete={(productId) => {
          if (window.confirm("Are you sure you want to delete this product?"))
            dispatch(deleteProduct(productId));
        }}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />

      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(productData) => {
            if (editingProduct) {
              dispatch(updateProduct(productData));
            } else {
              dispatch(addProduct(productData));
              setCurrentPage(1);
            }
            setIsModalOpen(false);
          }}
          onDelete={(id) => dispatch(deleteProduct(id))}
          initialData={editingProduct}
          categories={categories}
          productTypes={productTypes}
        />
      )}
    </div>
  );
}
