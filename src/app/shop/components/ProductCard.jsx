import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { openCart } from '@/store/slices/uiSlice';
import { useImageUrl } from '@/hooks/useImageUrl';
import Button from '@/global/components/base/Button';
import styles from '../styles/shop.module.scss';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartOpen = useSelector((state) => state.ui.cartOpen);
  const imageUrl = useImageUrl(product.imageUrls?.[0] || null);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    if (!cartOpen) {
      dispatch(openCart());
    }
  };

  return (
    <div className={styles.productCard}>
      {imageUrl ? (
        <img src={imageUrl} alt={product.name} className={styles.productImage} />
      ) : (
        <div className={styles.productImagePlaceholder}>Image loading...</div>
      )}
      <h2 className={styles.productName}>{product.name}</h2>
      <p className={styles.productPrice}>€{product.price}</p>

      <Button
        variant="secondary"
        size="m"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
}
