import React, { useState } from 'react';
import type { Sweet } from '../types';

interface PurchaseModalProps {
  sweet: Sweet;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  loading?: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ sweet, onClose, onConfirm, loading = false }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < sweet.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const total = (Number(sweet.price) * quantity).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(quantity);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--color-text-primary)',
          }}>
            Purchase {sweet.name}?
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Sweet Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius)',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--color-gray-100)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
              }}>
                {sweet.image_url ? (
                  <img src={sweet.image_url} alt={sweet.name} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                  }} />
                ) : (
                  '🍬'
                )}
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-text-primary)',
                }}>
                  {sweet.name}
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  {sweet.category}
                </div>
                <div style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-success)',
                  marginTop: 'var(--spacing-xs)',
                }}>
                  ${Number(sweet.price).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--color-text-primary)',
              }}>
                Quantity (Available: {sweet.quantity})
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
              }}>
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="btn btn-secondary"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    fontSize: 'var(--text-lg)',
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(Math.max(val, 1), sweet.quantity));
                  }}
                  className="input"
                  style={{
                    width: '80px',
                    textAlign: 'center',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= sweet.quantity}
                  className="btn btn-secondary"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    fontSize: 'var(--text-lg)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Calculation */}
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
                <div style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-secondary)',
                }}>
                  ${Number(sweet.price).toFixed(2)} × {quantity} =
                </div>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-success)',
                }}>
                  ${total}
                </div>
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
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : (
                '✓ Confirm Purchase'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;
