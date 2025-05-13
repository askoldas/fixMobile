import { useEffect, useRef, useState } from 'react';

export default function useFilteredProducts({
  products,
  categories,
  selectedType,
  selectedBrand,
  selectedSeries,
  selectedModel,
}) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const prevFiltersRef = useRef({ selectedType, selectedBrand, selectedSeries, selectedModel });

  useEffect(() => {
    let filtered = [...products];

    if (selectedType) {
      filtered = filtered.filter(
        (product) => product.productTypeId === selectedType.value
      );
    }

    if (selectedModel) {
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.modelIds) &&
          product.modelIds.includes(selectedModel.value)
      );
    } else if (selectedSeries) {
      const models = categories
        .filter((cat) => cat.type === 'model' && cat.parent === selectedSeries.value)
        .map((m) => m.id);
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.modelIds) &&
          product.modelIds.some((id) => models.includes(id))
      );
    } else if (selectedBrand) {
      const series = categories
        .filter((cat) => cat.type === 'series' && cat.parent === selectedBrand.value)
        .map((s) => s.id);
      const models = categories
        .filter((cat) => cat.type === 'model' && series.includes(cat.parent))
        .map((m) => m.id);
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.modelIds) &&
          product.modelIds.some((id) => models.includes(id))
      );
    }

    setFilteredProducts(filtered);

    const filtersChanged =
      prevFiltersRef.current.selectedType !== selectedType ||
      prevFiltersRef.current.selectedBrand !== selectedBrand ||
      prevFiltersRef.current.selectedSeries !== selectedSeries ||
      prevFiltersRef.current.selectedModel !== selectedModel;

    if (filtersChanged) {
      prevFiltersRef.current.onFiltersChange?.();
    }

    prevFiltersRef.current = {
      selectedType,
      selectedBrand,
      selectedSeries,
      selectedModel,
    };
  }, [products, categories, selectedType, selectedBrand, selectedSeries, selectedModel]);

  return filteredProducts;
}
