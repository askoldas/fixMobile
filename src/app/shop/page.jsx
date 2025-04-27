'use client';

import React, { useEffect, useState } from 'react';
import { fetchPaginatedDocuments } from '@/lib/firebaseUtils';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null); // Tracks the last document for pagination
  const [hasMore, setHasMore] = useState(true); // Indicates if more products are available

  const pageSize = 5; // Number of products per page

  const fetchProducts = async (isNextPage = false) => {
    setLoading(true);
    try {
      const { docs, lastVisible } = await fetchPaginatedDocuments(
        'Products', // Firestore collection name
        {}, // No filters in this example, but you can add filters like { brand: "Huawei" }
        pageSize, // Limit per page
        isNextPage ? lastDoc : null // Use lastDoc for pagination
      );

      setProducts((prev) => (isNextPage ? [...prev, ...docs] : docs));
      setLastDoc(lastVisible); // Update last document for the next page

      if (docs.length < pageSize) setHasMore(false); // No more products available
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch the first page on component mount
  }, []);

  if (loading && products.length === 0) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            {/* Display the first image from imageUrls */}
            {product.imageUrls && product.imageUrls[0] && (
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="w-full h-48 object-cover mt-2 rounded"
              />
            )}
            {/* Product Details */}
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-500">${product.price}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <button
          onClick={() => fetchProducts(true)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load More
        </button>
      )}

      {loading && products.length > 0 && <p className="text-center mt-4">Loading more products...</p>}
    </div>
  );
}
