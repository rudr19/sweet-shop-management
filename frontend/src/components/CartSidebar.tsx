import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from '../utils/toast';

const CartSidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    closeCart,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1100,
            transition: 'opacity var(--transition-base)',
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isCartOpen ? 0 : '-400px',
          width: '400px',
          maxWidth: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
          zIndex: 1200,
          transition: 'right var(--transition-base)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              margin: 0,
              marginBottom: 'var(--spacing-xs)',
            }}>
              🛒 Shopping Cart
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 'var(--text-2xl)',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)',
              color: 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-lg)',
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-2xl)',
              color: 'var(--color-text-secondary)',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🛒</div>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Your cart is empty</h4>
              <p style={{ fontSize: 'var(--text-sm)' }}>Start adding some sweets!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {cartItems.map((item) => (
                <div
                  key={item.sweet.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--color-gray-50)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Item Image Placeholder */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    border: '1px solid var(--color-border)',
                  }}>
                    🍬
                  </div>

                  {/* Item Details */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      {item.sweet.name}
                    </h4>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      marginBottom: 'var(--spacing-sm)',
                    }}>
                      ${Number(item.sweet.price).toFixed(2)} each
                    </p>

                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                        className="btn btn-secondary"
                        style={{
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          fontSize: 'var(--text-sm)',
                          minWidth: '32px',
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-medium)',
                        minWidth: '30px',
                        textAlign: 'center',
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                        className="btn btn-secondary"
                        style={{
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          fontSize: 'var(--text-sm)',
                          minWidth: '32px',
                        }}
                        disabled={item.quantity >= item.sweet.quantity}
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          removeFromCart(item.sweet.id);
                          toast.success('Item removed from cart');
                        }}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 'var(--text-lg)',
                          color: 'var(--color-danger)',
                          padding: 'var(--spacing-xs)',
                        }}
                        title="Remove from cart"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div style={{
                      marginTop: 'var(--spacing-xs)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-primary)',
                    }}>
                      Subtotal: ${(Number(item.sweet.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cartItems.length > 0 && (
                <button
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                  style={{
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--color-danger)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-danger)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-danger)';
                  }}
                >
                  🗑️ Clear Cart
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-gray-50)',
          }}>
            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)',
            }}>
              <span style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)',
              }}>
                Total:
              </span>
              <span style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-primary)',
              }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
              }}
            >
              🛍️ Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
