"use client";

import { useState } from "react";
import CategoriesManager from "./CategoriesManager";
import ProductsManager from "./ProductsManager";
import ProductTypesManager from "./ProductTypesManager";
import UsersManager from "./UsersManager"; // Add UsersManager

export default function CustomAdminPanel() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: "20px" }}>
        {/* Categories Button */}
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
        {/* Products Button */}
        <button
          style={{
            marginRight: "10px",
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
        {/* Product Types Button */}
        <button
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: activeTab === "product-types" ? "#007bff" : "#e0e0e0",
            color: activeTab === "product-types" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setActiveTab("product-types")}
        >
          Product Types
        </button>
        {/* Users Button */}
        <button
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: activeTab === "users" ? "#007bff" : "#e0e0e0",
            color: activeTab === "users" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      <div>
        {activeTab === "categories" && <CategoriesManager />}
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "product-types" && <ProductTypesManager />}
        {activeTab === "users" && <UsersManager />} {/* Render UsersManager */}
      </div>
    </div>
  );
}
