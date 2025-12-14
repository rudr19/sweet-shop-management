import React from 'react';
import type { Sweet } from '../types';

interface DeleteConfirmModalProps {
  sweet: Sweet;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ sweet, onClose, onConfirm, loading = false }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header" style={{
          borderBottom: '2px solid var(--color-danger)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-danger-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-2xl)',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-danger)',
              margin: 0,
            }}>
              Delete Sweet?
            </h2>
          </div>
        </div>

        <div className="modal-body">
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
            lineHeight: 1.6,
          }}>
            Are you sure you want to delete <strong>{sweet.name}</strong>? This action cannot be undone.
          </p>

          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Category:
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-medium)',
                marginLeft: 'var(--spacing-xs)',
              }}>
                {sweet.category}
              </span>
            </div>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Price:
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-medium)',
                marginLeft: 'var(--spacing-xs)',
              }}>
                ${Number(sweet.price).toFixed(2)}
              </span>
            </div>
            <div>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Stock:
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: sweet.quantity > 0 ? 'var(--color-warning)' : 'var(--color-text-primary)',
                fontWeight: 'var(--font-medium)',
                marginLeft: 'var(--spacing-xs)',
              }}>
                {sweet.quantity} item{sweet.quantity !== 1 ? 's' : ''}
                {sweet.quantity > 0 && ' (will be lost)'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <span className="spinner"></span>
                Deleting...
              </span>
            ) : (
              '🗑️ Delete Forever'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
