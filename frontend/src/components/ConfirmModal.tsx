import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            zIndex: 9999,
          }}
        >
          {/* Title */}
          <h3 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}>
            {title}
          </h3>

          {/* Message */}
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xl)',
            lineHeight: 1.6,
          }}>
            {message}
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="btn btn-danger"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
