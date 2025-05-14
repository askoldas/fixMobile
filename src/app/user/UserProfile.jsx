'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/global/components/base/Button';
import styles from '@/app/user/userProfile.module.scss';

export default function UserProfile() {
  const router = useRouter();
  const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    legal: { street: '', city: '', zip: '', country: '' },
    delivery: { street: '', city: '', zip: '', country: '' },
    sameAsLegal: true,
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/');
        return;
      }

      setUser(firebaseUser);

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        const legal = data.legal || { street: '', city: '', zip: '', country: '' };
        const delivery = data.delivery || { street: '', city: '', zip: '', country: '' };
        const sameAsLegal = !data.delivery || JSON.stringify(legal) === JSON.stringify(delivery);

        setForm({
          fullName: data.fullName || '',
          phone: data.phone || '',
          legal,
          delivery,
          sameAsLegal,
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleChange = (e, section, field) => {
    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: e.target.value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSameAsLegalToggle = () => {
    setForm((prev) => ({
      ...prev,
      sameAsLegal: !prev.sameAsLegal,
      delivery: !prev.sameAsLegal ? { ...prev.legal } : { street: '', city: '', zip: '', country: '' },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      fullName: form.fullName,
      phone: form.phone,
      legal: form.legal,
      delivery: form.sameAsLegal ? form.legal : form.delivery,
    };

    await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
    setSuccess(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Profile</h1>
      {success && <p className={styles.successMessage}>Profile updated successfully!</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Email</label>
          <input type="email" value={user.email} disabled className={styles.inputDisabled} />
        </div>

        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <h2 className={styles.sectionTitle}>Legal Address</h2>
        {['street', 'city', 'zip', 'country'].map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              value={form.legal[field]}
              onChange={(e) => handleChange(e, 'legal', field)}
              className={styles.input}
            />
          </div>
        ))}

        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.sameAsLegal}
            onChange={handleSameAsLegalToggle}
          />
          <label>Delivery address same as legal</label>
        </div>

        {!form.sameAsLegal && (
          <>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>
            {['street', 'city', 'zip', 'country'].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  value={form.delivery[field]}
                  onChange={(e) => handleChange(e, 'delivery', field)}
                  className={styles.input}
                />
              </div>
            ))}
          </>
        )}

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
