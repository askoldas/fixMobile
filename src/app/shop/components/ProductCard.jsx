import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { openCart } from '@/store/slices/uiSlice';
import styles from '../styles/shop.module.scss';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartOpen = useSelector((state) => state.ui.cartOpen); // ✅ read cart state

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    if (!cartOpen) {
      dispatch(openCart()); // ✅ only open if currently closed
    }
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
