import React, { useEffect, useState } from 'react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: React.ReactNode;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading: controlledLoading,
  children,
  className = '',
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = controlledLoading !== undefined ? controlledLoading : internalLoading;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  const confirmBtnVariantClass =
    variant === 'danger'
      ? 'sra-btn--danger'
      : variant === 'warning'
      ? 'sra-btn--warning'
      : 'sra-btn--primary';

  return (
    <div
      className="sra-dialog-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="presentation"
    >
      <div
        className={`sra-dialog ${className}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sra-dialog-title"
        aria-describedby="sra-dialog-desc"
      >
        <div className="sra-dialog__header">
          <h2 id="sra-dialog-title" className="sra-dialog__title">
            {title}
          </h2>
        </div>

        <div id="sra-dialog-desc" className="sra-dialog__body">
          {message && <p style={{ margin: 0 }}>{message}</p>}
          {children}
        </div>

        <div className="sra-dialog__footer">
          <button
            type="button"
            className="sra-btn sra-btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`sra-btn ${confirmBtnVariantClass}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
