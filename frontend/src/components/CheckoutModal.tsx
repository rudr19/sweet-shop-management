import React from 'react';
import { createPortal } from 'react-dom';
import type { Sweet } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  sweet?: Sweet;
  totalItems: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  sweet,
  totalItems,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Full Screen Smooth Blur Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      />

      {/* Floating Bottom Notification Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          right: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(102, 126, 234, 0.1)',
          zIndex: 9999,
          padding: 'var(--spacing-md) var(--spacing-lg)',
          animation: 'slideUpFromBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* Horizontal Layout - Centered Container */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xl)',
          flexWrap: 'wrap',
        }}>
          {/* Left Section - Success Icon + Product Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            flex: '1 1 400px',
          }}>
            {/* Success Checkmark */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-success)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: 'white',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}>
              ✓
            </div>

            {sweet && (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
              }}>
                {/* Product Icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}>
                  🍬
                </div>

                {/* Product Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {sweet.name}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    ${Number(sweet.price).toFixed(2)} • {sweet.category}
                  </div>
                </div>

                {/* Cart Count Badge */}
                <div style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px var(--spacing-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-bold)',
                  flexShrink: 0,
                }}>
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            flex: '0 0 auto',
          }}>
            <button
              onClick={onClose}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-medium)',
                border: '1px solid var(--color-border)',
                background: 'white',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                borderRadius: 'var(--radius)',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                e.currentTarget.style.borderColor = 'var(--color-gray-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              Continue Shopping
            </button>
            <button
              onClick={onProceedToCheckout}
              className="btn btn-primary"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              <span>🛍️</span>
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </>,
    document.body
  );
};

export default CheckoutModal;
