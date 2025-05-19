'use client';

import React from 'react';
import Modal from './Modal';
import Button from '@/global/components/base/Button';
import styles from './modal.module.scss';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <p>{message}</p>
      <div className={styles.modalActions}>
        <Button variant="secondary" size="s" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="primary" size="s" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}