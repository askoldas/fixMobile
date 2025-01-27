// selectors/BrandSelector.jsx
import React from "react";

export default function BrandSelector({ brands, onAdd, onRemove, selectedBrands }) {
  return (
    <div>
      <select
        onChange={(e) => onAdd(e.target.value)}
        style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
      >
        <option value="">Select Brand</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
      <ul>
        {selectedBrands.map((brand) => (
          <li key={brand}>
            {brands.find((cat) => cat.id === brand)?.name}{" "}
            <button onClick={() => onRemove(brand)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
