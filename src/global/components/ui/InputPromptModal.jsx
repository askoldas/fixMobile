'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '@/global/components/base/Button';
import styles from './modal.module.scss';


export default function InputPromptModal({
  isOpen,
  onClose,
  onSubmit,
  label = 'Enter value',
  initialValue = '',
  confirmLabel = 'Submit',
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <Modal onClose={onClose}>
  <label className={styles.modalLabel}>{label}</label>
  <input
    className={styles.modalInput}
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  <div className={styles.modalActions}>
    <Button variant="secondary" size="s" onClick={onClose}>
      Cancel
    </Button>
    <Button variant="primary" size="s" onClick={handleSubmit}>
      {confirmLabel}
    </Button>
  </div>
</Modal>
  );
}
