'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';

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
      <div className="modal-result">
        {/* Render success result if email exists */}
        {email && (
          <div className="result">
            <h3 className="result-title">Email Derived Successfully!</h3>
            <div className="result-email">
              <strong>{email}</strong>
            </div>
            <p className="result-message">This email was derived based on the company&apos;s naming pattern.</p>
          </div>
        )}

        {/* Render error message if error exists */}
        {error && (
          <div className="error">
            <h3 className="error-title">Derivation Failed</h3>
            <div className="error-message">
              {error}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
