'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../Modal/Modal';
import styles from './ResultDisplay.module.css';

interface ResultDisplayProps {
  email: string | null;
  error: string | null;
}

// Combined component that renders either success result or error message as a popup
export function ResultDisplay({ email, error }: ResultDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Open modal when we have a result or error
  useEffect(() => {
    if (email || error) {
      setIsOpen(true);
    }
  }, [email, error]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // If no result and no error, render nothing
  if (!email && !error) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.modalResult}>
        {/* Render success result if email exists */}
        {email && (
          <div className={styles.result}>
            <h3 className={styles.resultTitle}>Email Derived Successfully!</h3>
            <div className={styles.resultEmail}>
              <strong>{email}</strong>
            </div>
            <p className={styles.resultMessage}>This email was derived based on the company&apos;s naming pattern.</p>
          </div>
        )}

        {/* Render error message if error exists */}
        {error && (
          <div className={styles.error}>
            <h3 className={styles.errorTitle}>Derivation Failed</h3>
            <div className={styles.errorMessage}>
              {error}
            </div>
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.button} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
