import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './auth-modal.module.scss';
import { closeAuthModal, toggleAuthMode } from '../../../store/slices/authSlice';
import LoginForm from './LoginForm'; // Import LoginForm (SignupForm can be added later)
import SignupForm from './SignupForm';


const AuthModal = () => {
  const dispatch = useDispatch();
  const { modalOpen, mode } = useSelector((state) => state.auth);

  if (!modalOpen) return null; // Don't render if modal is closed

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
  {mode === 'login' ? (
    <LoginForm />
  ) : (
    // SignupForm will replace this
    <div className={styles.formArea}>
  {mode === 'login' ? (
    <LoginForm />
  ) : (
    <SignupForm />
  )}
</div>
  )}
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
