"use client";

import { useState } from "react";
import CategoriesManager from "./CategoriesManager";
import ProductsManager from "./ProductsManager";

export default function CustomAdminPanel() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: "20px" }}>
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: activeTab === "categories" ? "#007bff" : "#e0e0e0",
            color: activeTab === "categories" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: activeTab === "products" ? "#007bff" : "#e0e0e0",
            color: activeTab === "products" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
      </div>
      <div>
        {activeTab === "categories" && <CategoriesManager />}
        {activeTab === "products" && <ProductsManager />}
      </div>
    </div>
  );
}
