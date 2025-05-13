'use client';

import React, { useEffect, useState } from 'react';
import { fetchPaginatedDocuments } from '@/lib/firebaseUtils';
import ProductList from './components/ProductList';
import Button from '@/global/components/base/Button';
import styles from './styles/shop.module.scss'; // ✅ Import SCSS module

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 24;

  const fetchProducts = async (isNextPage = false) => {
    setLoading(true);
    try {
      const { docs, lastVisible } = await fetchPaginatedDocuments(
        'Products',
        {},
        pageSize,
        isNextPage ? lastDoc : null
      );

      setProducts((prev) => (isNextPage ? [...prev, ...docs] : docs));
      setLastDoc(lastVisible);

      if (docs.length < pageSize) setHasMore(false);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading && products.length === 0) {
    return <div className={styles.loadingMessage}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.shopPage}>
      <h1 className={styles.pageTitle}>Product List</h1>

      <ProductList products={products} />

      {hasMore && !loading && (
        <div className={styles.loadMoreContainer}>
          <Button
            variant="primary"
            size="m"
            onClick={() => fetchProducts(true)}
          >
            Load More
          </Button>
        </div>
      )}

      {loading && products.length > 0 && (
        <p className={styles.loadingMessage}>Loading more products...</p>
      )}
    </div>
  );
}
