import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './auth-modal.module.scss';
import { closeAuthModal, toggleAuthMode } from '../../../store/slices/authSlice';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = () => {
  const dispatch = useDispatch();
  const { modalOpen, mode } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user); // ✅ Add this

  // ✅ Auto-close modal on login/signup
  useEffect(() => {
    if (user) {
      dispatch(closeAuthModal());
    }
  }, [user, dispatch]);

  if (!modalOpen) return null;

  const handleClose = () => dispatch(closeAuthModal());
  const handleToggle = () => dispatch(toggleAuthMode());

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>

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
      </div>
    </div>
  );
};

export default AuthModal;
