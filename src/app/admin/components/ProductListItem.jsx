import React from "react";
import styles from "../styles/products-manager.module.scss";

export default function ProductListItem({ product, onEdit, onDelete }) {
  if (!product) return null;

  const { id, name, price } = product;

  return (
    <li className={styles["product-item"]}>
      <span>
        {name || "Unnamed Product"} (${typeof price === "number" ? price.toFixed(2) : "0.00"})
      </span>
      <div className={styles["product-actions"]}>
        <button
          className={styles["edit-button"]}
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button
          className={styles["delete-button"]}
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
// This is a comment