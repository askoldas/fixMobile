// selectors/ProductTypeSelector.jsx
import React from "react";

export default function ProductTypeSelector({ productTypes, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
    >
      <option value="">Select Product Type</option>
      {productTypes.map((type) => (
        <option key={type.id} value={type.id}>
          {type.name}
        </option>
      ))}
    </select>
  );
}
