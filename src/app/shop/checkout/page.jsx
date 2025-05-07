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

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Latvia',
    street: '',
    apartment: '',
    city: '',
    municipality: '',
    postalCode: '',
    shippingAddress: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const [first, ...rest] = user.fullName?.split(' ') || [];
      setForm((prev) => ({
        ...prev,
        firstName: first || '',
        lastName: rest?.join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.legal?.country || 'Latvia',
        street: user.legal?.street || '',
        city: user.legal?.city || '',
        postalCode: user.legal?.zip || '',
        municipality: '',
        apartment: '',
        shippingAddress: formatAddress(user.delivery),
      }));
    }
  }, [user]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.street}, ${addr.city}, ${addr.zip}, ${addr.country}`;
  };

  const parseShippingAddress = (raw) => {
    const [street, city, zip, country] = raw.split(',').map((s) => s.trim());
    return { street, city, zip, country };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.street || !form.city || !form.postalCode) {
      setError('Please fill in all required billing fields.');
      return;
    }

    if (!sameAsBilling && !form.shippingAddress) {
      setError('Please enter a delivery address or check "Same as billing address".');
      return;
    }

    if (cart.items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const billingAddress = {
      country: form.country,
      street: form.street,
      apartment: form.apartment,
      city: form.city,
      municipality: form.municipality,
      zip: form.postalCode,
    };

    const shippingAddress = sameAsBilling ? billingAddress : parseShippingAddress(form.shippingAddress);
    const contactName = `${form.firstName} ${form.lastName}`;

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'orders'), {
        contactInfo: {
          name: contactName,
          email: form.email,
          phone: form.phone,
        },
        legalAddress: billingAddress,
        deliveryAddress: shippingAddress,
        items: cart.items,
        totalPrice: cart.totalPrice,
        createdAt: serverTimestamp(),
        status: 'pending',
      });

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
    <div className={styles.checkoutGrid}>
      <div className={styles.formColumn}>
        <h2>Contact Information</h2>
        <p className={styles.subtext}>We’ll use this email to send you details and updates about your order.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} />

          <h3>Billing address</h3>
          <select name="country" value={form.country} onChange={handleChange}>
            <option value="Latvia">Latvia</option>
          </select>

          <div className={styles.nameRow}>
            <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
            <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
          </div>

          <input name="street" placeholder="Address" value={form.street} onChange={handleChange} />
          <input name="apartment" placeholder="Apartment, suite, etc." value={form.apartment} onChange={handleChange} />

          <div className={styles.row}>
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <input name="municipality" placeholder="Municipality (optional)" value={form.municipality} onChange={handleChange} />
          </div>

          <div className={styles.row}>
            <input name="postalCode" placeholder="Postal code" value={form.postalCode} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          </div>

          <h3>Shipping address</h3>
          <div className={styles.checkboxWrapper}>
            <input id="sameAsBilling" type="checkbox" checked={sameAsBilling} onChange={() => setSameAsBilling(!sameAsBilling)} />
            <label htmlFor="sameAsBilling">Same as billing address</label>
          </div>

          {!sameAsBilling && (
            <textarea
              name="shippingAddress"
              placeholder="Shipping address (street, city, zip, country)"
              value={form.shippingAddress}
              onChange={handleChange}
            />
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Place Order'}
          </button>
        </form>
      </div>

      <div className={styles.cartSummary}>
        <h2>Order summary</h2>
        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.items.map((item) => (
                <li key={item.productId}>
                  {item.name} × {item.quantity} — €{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className={styles.total}>Total: €{cart.totalPrice.toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
}
