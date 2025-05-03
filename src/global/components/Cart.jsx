import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '@/store/slices/cartSlice';
import { closeCart } from '@/store/slices/uiSlice';
import { useRouter } from 'next/navigation';
import styles from '@/global/styles/Cart.module.scss';

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const cartOpen = useSelector((state) => state.ui.cartOpen);

  const handleClose = () => dispatch(closeCart());
  const handleCheckout = () => {
    dispatch(closeCart());
    router.push('/checkout');
  };

  return (
    <div className={`${styles.cartDrawer} ${cartOpen ? styles.open : styles.closed}`}>
      <div className="cart-header" style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
        <button onClick={handleClose} style={{ float: 'right', fontSize: '1.2rem' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} style={{ marginBottom: '1rem' }}>
              <strong>{item.name}</strong>
              <p>€{item.price.toFixed(2)}</p>
              <div>
                <button onClick={() => dispatch(decreaseQuantity(item.productId))}>−</button>
                <span style={{ margin: '0 0.5rem' }}>{item.quantity}</span>
                <button onClick={() => dispatch(increaseQuantity(item.productId))}>+</button>
                <button onClick={() => dispatch(removeFromCart(item.productId))} style={{ marginLeft: '1rem', color: 'red' }}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #ddd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span>Total:</span>
          <strong>€{totalPrice.toFixed(2)}</strong>
        </div>
        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          style={{ width: '100%', padding: '0.75rem', background: 'black', color: 'white' }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
