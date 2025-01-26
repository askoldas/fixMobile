'use client';

import React, { useEffect, useState } from 'react';
import { fetchDocuments } from '@/lib/firebaseUtils';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchDocuments('products'); // Fetch products from Firestore
        console.log(productsData); // Debugging: log fetched data
        setProducts(productsData);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
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
    </div>
  );
}
