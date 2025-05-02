import React from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/shop.module.scss';

export default function ProductList({ products }) {
  return (
    <div className={styles.productList}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
