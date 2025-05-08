'use client';

import React, { useEffect, useState } from 'react';
import { fetchPaginatedDocuments } from '@/lib/firebaseUtils';
import ProductList from './components/ProductList';

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
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      <ProductList products={products} />

      {hasMore && !loading && (
        <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '24px',
          marginBottom: '32px',
        }}
      >
        <button
          onClick={() => fetchProducts(true)}
          style={{
            backgroundColor: '#ff6600',
            color: '#fff',
            padding: '12px 24px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Load More
        </button>
      </div>
      
      
      
      )}

      {loading && products.length > 0 && (
        <p className="text-center mt-4">Loading more products...</p>
      )}
    </div>
  );
}
