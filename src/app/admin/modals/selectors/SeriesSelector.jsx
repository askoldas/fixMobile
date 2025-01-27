export default function SeriesSelector({ series, onAdd, onRemove, selectedSeries }) {
    // Fallback to an empty array if selectedSeries is invalid
    const validSelectedSeries = Array.isArray(selectedSeries) ? selectedSeries : [];
  
    return (
      <div>
        <select
          onChange={(e) => onAdd(e.target.value)}
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        >
          <option value="">Select Series</option>
          {series.map((seriesItem) => (
            <option key={seriesItem.id} value={seriesItem.id}>
              {seriesItem.name}
            </option>
          ))}
        </select>
        <ul>
          {validSelectedSeries.map((series) => (
            <li key={series}>
              {series.find((item) => item.id === series)?.name}{" "}
              <button onClick={() => onRemove(series)}>×</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  