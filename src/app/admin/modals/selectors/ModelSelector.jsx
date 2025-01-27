// selectors/ModelSelector.jsx
import React from "react";

export default function ModelSelector({ models, onAdd, onRemove, selectedModels }) {
  return (
    <div>
      <select
        onChange={(e) => onAdd(e.target.value)}
        style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
      >
        <option value="">Select Model</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <ul>
        {selectedModels.map((model) => (
          <li key={model}>
            {models.find((item) => item.id === model)?.name}{" "}
            <button onClick={() => onRemove(model)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
