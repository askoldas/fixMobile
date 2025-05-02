'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 

import styles from '@/app/shop/styles/checkout.module.scss'; 

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state) => state.cart);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError('Please fill in all fields.');
      return;
    }

    if (cart.items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'orders'), {
        contactInfo: form,
        items: cart.items,
        totalPrice: cart.totalPrice,
        createdAt: serverTimestamp(),
        status: 'pending',
      });

      dispatch(clearCart());
      router.push('/shop'); // or create a /thank-you page
    } catch (err) {
      console.error('Order submission failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Shipping Address"
          value={form.address}
          onChange={handleChange}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Place Order'}
        </button>
      </form>

      <div className={styles.cartSummary}>
        <h2>Order Summary</h2>
        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.items.map((item) => (
              <li key={item.productId}>
                {item.name} × {item.quantity} — €{(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        <p className={styles.total}>Total: €{cart.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}
