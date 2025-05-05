'use client';

import React, { useState, useEffect } from 'react';
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
  const user = useSelector((state) => state.auth.user);

  const [sameAsLegal, setSameAsLegal] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Populate fields from user profile
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        deliveryAddress: formatAddress(user.delivery),
      }));
    }
  }, [user]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.street}, ${addr.city}, ${addr.zip}, ${addr.country}`;
  };

  const parseAddress = (raw) => {
    const [street, city, zip, country] = raw.split(',').map((s) => s.trim());
    return { street, city, zip, country };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all contact fields.');
      return;
    }

    if (!sameAsLegal && !form.deliveryAddress) {
      setError('Please enter delivery address or check "Same as legal".');
      return;
    }

    if (cart.items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);

    try {
      const order = {
        contactInfo: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        legalAddress: user.legal || null,
        deliveryAddress: sameAsLegal ? user.legal : parseAddress(form.deliveryAddress),
        items: cart.items,
        totalPrice: cart.totalPrice,
        createdAt: serverTimestamp(),
        status: 'pending',
      };

      await addDoc(collection(db, 'orders'), order);

      dispatch(clearCart());
      router.push('/shop');
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

        <div>
          <label>Legal Address</label>
          <textarea
            readOnly
            value={formatAddress(user?.legal)}
            className={styles.readonly}
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={sameAsLegal}
            onChange={() => setSameAsLegal(!sameAsLegal)}
          />
          Same as legal address
        </label>

        {!sameAsLegal && (
          <textarea
            name="deliveryAddress"
            placeholder="Delivery Address (street, city, zip, country)"
            value={form.deliveryAddress}
            onChange={handleChange}
          />
        )}

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
