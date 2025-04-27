import React from "react";
import styles from "../styles/products-manager.module.scss";
import ProductListItem from "./ProductListItem";

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <ul className={styles["product-list"]}>
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
