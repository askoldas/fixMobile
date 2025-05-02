import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import styles from '../styles/shop.module.scss';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className={styles.productCard}>
      {product.imageUrls && product.imageUrls[0] && (
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className={styles.productImage}
        />
      )}
      <h2 className={styles.productName}>{product.name}</h2>
      <p className={styles.productPrice}>€{product.price}</p>
      <button onClick={handleAddToCart} className={styles.productButton}>
        Add to Cart
      </button>
    </div>
  );
}
