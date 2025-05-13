'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeAuthModal, toggleAuthMode } from '@/store/slices/authSlice';
import Modal from '@/global/components/ui/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import styles from './auth-modal.module.scss';

const AuthModal = () => {
  const dispatch = useDispatch();
  const { modalOpen, mode, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(closeAuthModal());
    }
  }, [user, dispatch]);

  if (!modalOpen) return null;

  const handleClose = () => dispatch(closeAuthModal());
  const handleToggle = () => dispatch(toggleAuthMode());

  return (
    <Modal onClose={handleClose}>
      <h2>{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>

      <div className={styles.formArea}>
        {mode === 'login' ? <LoginForm /> : <SignupForm />}
      </div>

      <div className={styles.switchMode}>
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <span onClick={handleToggle}>Sign Up</span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span onClick={handleToggle}>Log In</span>
          </p>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
