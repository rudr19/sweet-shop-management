import React, { useState } from 'react';
import type { Sweet } from '../types';

interface RestockModalProps {
  sweet: Sweet;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  loading?: boolean;
}

const RestockModal: React.FC<RestockModalProps> = ({ sweet, onClose, onConfirm, loading = false }) => {
  const [quantity, setQuantity] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0) {
      onConfirm(quantity);
    }
  };

  const newTotal = sweet.quantity + quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-2xl)',
            }}>
              📦
            </div>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Restock Sweet
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Sweet Info */}
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                {sweet.name}
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                {sweet.category} • ${Number(sweet.price).toFixed(2)}
              </div>
              <div style={{
                marginTop: 'var(--spacing-sm)',
                paddingTop: 'var(--spacing-sm)',
                borderTop: '1px solid var(--color-border)',
              }}>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  Current Stock:
                </span>
                <span style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  color: sweet.quantity < 5 ? 'var(--color-danger)' : 'var(--color-success)',
                  marginLeft: 'var(--spacing-sm)',
                }}>
                  {sweet.quantity} items
                </span>
              </div>
            </div>

            {/* Quantity Input */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="restockQuantity" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--color-text-primary)',
              }}>
                Quantity to Add *
              </label>
              <input
                id="restockQuantity"
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="input"
                placeholder="Enter quantity"
                required
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                }}
              />
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)',
              }}>
                Tip: Enter the number of items you're adding to inventory
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setQuantity(amount)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    flex: 1,
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  +{amount}
                </button>
              ))}
            </div>

            {/* Preview */}
            {quantity > 0 && (
              <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-success-light)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-success)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      New Total Stock
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      {sweet.quantity} + {quantity} =
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--color-success)',
                  }}>
                    {newTotal}
                  </div>
                </div>
              </div>
            )}
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
              type="submit"
              className="btn btn-success"
              disabled={loading || quantity <= 0}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span className="spinner"></span>
                  Restocking...
                </span>
              ) : (
                '✓ Restock'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;
