'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useAuth from '@/hooks/useAuth';
import Button from '@/global/components/base/Button';
import styles from './auth-modal.module.scss';

const SignupForm = () => {
  const router = useRouter();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);

      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe(); // ensure it only runs once
          router.push('/user');
        }
      });
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button
        type="submit"
        variant="primary"
        size="m"
        disabled={loading}
      >
        {loading ? 'Creating Account…' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignupForm;
