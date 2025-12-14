import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Sweet } from '../types';
import { toast } from '../utils/toast';
import CheckoutModal from './CheckoutModal';

interface CustomerProductCardProps {
  sweet: Sweet;
}

const CustomerProductCard: React.FC<CustomerProductCardProps> = ({ sweet }) => {
  const navigate = useNavigate();
  const { addToCart, openCart, toggleCart, totalItems, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleAddToCart = () => {
    if (sweet.quantity === 0) {
      toast.error('This item is out of stock!');
      return;
    }

    // Add 1 item to cart like standard e-commerce apps
    addToCart(sweet, 1);

    // Show checkout modal
    setShowCheckoutModal(true);
  };

  const handleBuyNow = () => {
    if (sweet.quantity === 0) {
      toast.error('This item is out of stock!');
      return;
    }

    // Clear cart, add this item, and go directly to checkout
    clearCart();
    addToCart(sweet, 1);
    navigate('/checkout');
  };

  const handleProceedToCheckout = () => {
    setShowCheckoutModal(false);
    openCart();
  };

  const handleContinueShopping = () => {
    setShowCheckoutModal(false);
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all var(--transition-base)',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }}
    >
      {/* Image Placeholder */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '100%', // 1:1 aspect ratio
        backgroundColor: 'var(--color-gray-100)',
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '5rem',
        }}>
          🍬
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)',
            backgroundColor: 'var(--color-danger)',
            color: 'white',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
          }}>
            OUT OF STOCK
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)',
            backgroundColor: 'var(--color-warning)',
            color: 'white',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
          }}>
            LOW STOCK
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: 'var(--spacing-lg)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Category */}
        <div style={{
          display: 'inline-block',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-medium)',
          color: 'var(--color-primary)',
          backgroundColor: 'var(--color-primary-light)',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-full)',
          marginBottom: 'var(--spacing-sm)',
          alignSelf: 'flex-start',
        }}>
          {sweet.category}
        </div>

        {/* Name */}
        <h3 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          margin: 0,
          marginBottom: 'var(--spacing-sm)',
          lineHeight: 1.3,
        }}>
          {sweet.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          margin: 0,
          marginBottom: 'var(--spacing-md)',
          lineHeight: 1.5,
          flex: 1,
        }}>
          {sweet.description || 'Delicious sweet treat that will satisfy your cravings!'}
        </p>

        {/* Price & Stock */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
        }}>
          <div>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-primary)',
            }}>
              ${Number(sweet.price).toFixed(2)}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
            }}>
              per unit
            </div>
          </div>
          <div style={{
            textAlign: 'right',
          }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: isOutOfStock ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            }}>
              {isOutOfStock ? 'Out of stock' : `${sweet.quantity} in stock`}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-sm)',
        }}>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-secondary"
            style={{
              padding: 'var(--spacing-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              opacity: isOutOfStock ? 0.6 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            }}
          >
            {isOutOfStock ? '❌ Out' : '🛒 Add'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{
              padding: 'var(--spacing-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              opacity: isOutOfStock ? 0.6 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              backgroundColor: isOutOfStock ? 'var(--color-gray-300)' : undefined,
            }}
          >
            {isOutOfStock ? 'Stock' : '⚡ Buy Now'}
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleContinueShopping}
        onProceedToCheckout={handleProceedToCheckout}
        sweet={sweet}
        totalItems={totalItems}
      />
    </div>
  );
};

export default CustomerProductCard;
