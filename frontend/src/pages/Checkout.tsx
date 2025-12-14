import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from '../utils/toast';
import { ordersAPI } from '../services/api';
import CustomerLayout from '../components/CustomerLayout';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty!');
      navigate('/dashboard');
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone ||
        !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setIsProcessing(true);

    try {
      // Create real order via API
      await ordersAPI.create({
        cartItems,
        totalAmount: totalPrice,
        shippingInfo: shippingAddress
      });

      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.response?.data?.error || 'Failed to place order');
    }
  };

  if (orderPlaced) {
    return (
      <CustomerLayout>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--spacing-2xl)',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-lg)' }}>✅</div>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-success)',
              marginBottom: 'var(--spacing-md)',
            }}>
              Order Placed Successfully!
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xl)',
            }}>
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-gray-50)',
              borderRadius: 'var(--radius)',
              marginBottom: 'var(--spacing-xl)',
            }}>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                Order Total
              </div>
              <div style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-primary)',
              }}>
                ${totalPrice.toFixed(2)}
              </div>
            </div>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--spacing-xl)',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: 'var(--spacing-xl)',
        }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)',
          }}>
            🛍️ Checkout
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
          }}>
            Complete your order
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 'var(--spacing-xl)',
        }}>
          {/* Left Column - Shipping Details */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
              }}>
                Shipping Information
              </h2>

              <div style={{
                display: 'grid',
                gap: 'var(--spacing-md)',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="John Doe"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-md)',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="john@example.com"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="+1 234 567 890"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="123 Main Street"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: 'var(--spacing-md)',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="New York"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="10001"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method (Placeholder) */}
              <div style={{
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-xl)',
                borderTop: '1px solid var(--color-border)',
              }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-md)',
                }}>
                  Payment Method
                </h3>
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>💳</span>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '80px',
            }}>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
              }}>
                Order Summary
              </h2>

              {/* Cart Items */}
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: 'var(--spacing-lg)',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.sweet.id}
                      style={{
                        display: 'flex',
                        gap: 'var(--spacing-sm)',
                        paddingBottom: 'var(--spacing-md)',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'var(--color-gray-50)',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                      }}>
                        🍬
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--color-text-primary)',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.sweet.name}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                        }}>
                          Qty: {item.quantity} × ${Number(item.sweet.price).toFixed(2)}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-primary)',
                        flexShrink: 0,
                      }}>
                        ${(Number(item.sweet.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{
                paddingTop: 'var(--spacing-lg)',
                borderTop: '2px solid var(--color-border)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Subtotal ({totalItems} items):
                  </span>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-primary)',
                  }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--spacing-sm)',
                }}>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Shipping:
                  </span>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-success)',
                  }}>
                    FREE
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--color-border)',
                  marginBottom: 'var(--spacing-lg)',
                }}>
                  <span style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-bold)',
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

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                >
                  {isProcessing ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)' }}>
                      <span className="spinner"></span>
                      Processing...
                    </span>
                  ) : (
                    <>🛍️ Place Order</>
                  )}
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    marginTop: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Checkout;
