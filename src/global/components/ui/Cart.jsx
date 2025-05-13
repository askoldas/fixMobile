import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '@/store/slices/cartSlice';
import { closeCart } from '@/store/slices/uiSlice';
import { useRouter } from 'next/navigation';
import Button from '@/global/components/base/Button';
import styles from '@/global/components/ui/cart.module.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const cartOpen = useSelector((state) => state.ui.cartOpen);

  const handleClose = () => dispatch(closeCart());
  const handleCheckout = () => {
    dispatch(closeCart());
    router.push('/shop/checkout');
  };

  return (
    <div className={`${styles.cartDrawer} ${cartOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2>Your Cart</h2>
        <Button
          variant="secondary"
          size="s"
          onClick={handleClose}
          aria-label="Close cart"
        >
          ✕
        </Button>
      </div>

      <div className={styles.content}>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} className={styles.item}>
              <strong>{item.name}</strong>
              <p>€{item.price.toFixed(2)}</p>
              <div className={styles.itemControls}>
                <Button
                  size="s"
                  variant="secondary"
                  onClick={() => dispatch(decreaseQuantity(item.productId))}
                >
                  −
                </Button>
                <span>{item.quantity}</span>
                <Button
                  size="s"
                  variant="secondary"
                  onClick={() => dispatch(increaseQuantity(item.productId))}
                >
                  +
                </Button>
                <Button
                  size="s"
                  variant="secondary"
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className={styles.removeButton}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <span>Total:</span>
          <strong>€{totalPrice.toFixed(2)}</strong>
        </div>
        <Button
          onClick={handleCheckout}
          variant="primary"
          size="m"
          disabled={items.length === 0}
          style={{ width: '100%' }}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
