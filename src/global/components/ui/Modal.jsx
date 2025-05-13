'use client';

import React from 'react';
import styles from './modal.module.scss';

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
