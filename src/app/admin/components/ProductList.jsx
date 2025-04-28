import React, { useState } from "react";
import styles from "../styles/products-manager.module.scss";
import ProductListItem from "./ProductListItem";

export default function ProductList({ products, onEdit, onInlineEdit, onDelete, categories, productTypes }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = (productId) => {
    setExpandedId((prev) => (prev === productId ? null : productId));
  };

  return (
    <ul className={styles["product-list"]}>
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onInlineEdit={onInlineEdit}
          onDelete={onDelete}
          isExpanded={expandedId === product.id}
          onToggleExpand={() => handleToggleExpand(product.id)}
          categories={categories}
          productTypes={productTypes}
        />
      ))}
    </ul>
  );
}