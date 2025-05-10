import React from "react";
import styles from "../styles/products-manager.module.scss";
import { useImageUrl } from "@/hooks/useImageUrl";

export default function ProductListItem({
  product,
  onEdit,
  onDelete,
}) {
  const resolvedImageUrl = useImageUrl(product.imageUrls?.[0] || null);

  return (
    <li
      className={styles["product-item"]}
      onClick={() => onEdit(product)}
      style={{
        cursor: "pointer",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
        marginBottom: "5px",
        display: "grid",
        gridTemplateColumns: "1fr 160px 160px",
        alignItems: "center",
      }}
    >
      <span style={{ textAlign: "left", fontWeight: 500 }}>{product.name}</span>
      <span style={{ textAlign: "right" }}>
        {typeof product.price === "number" ? product.price.toFixed(2) : "0.00"} €
      </span>
      <span style={{ textAlign: "right" }}>
        {typeof product.quantity === "number" ? product.quantity : 0}
      </span>
    </li>
  );
}
