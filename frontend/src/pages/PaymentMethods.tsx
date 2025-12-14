import React, { useState } from 'react';
import CustomerLayout from '../components/CustomerLayout';
import { toast } from '../utils/toast';

const PaymentMethods: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Mock payment methods - in a real app, this would come from an API
  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: 2,
      type: 'card',
      last4: '8888',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2025,
      isDefault: false,
    },
  ];

  const handleAddCard = () => {
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
      toast.error('Please fill in all card details');
      return;
    }
    toast.success('Payment method added successfully!');
    setShowAddCard(false);
    setCardData({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <CustomerLayout>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'var(--spacing-xl)',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
            }}>
              💳 Payment Methods
            </h1>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
            }}>
              Manage your saved payment methods
            </p>
          </div>
          {!showAddCard && (
            <button
              onClick={() => setShowAddCard(true)}
              className="btn btn-primary"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
              }}
            >
              ➕ Add Card
            </button>
          )}
        </div>

        {/* Add Card Form */}
        {showAddCard && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: 'var(--spacing-xl)',
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              Add New Card
            </h3>

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
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="input"
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
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardData.cardName}
                  onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                  placeholder="John Doe"
                  className="input"
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
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="input"
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
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginTop: 'var(--spacing-md)',
              }}>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-sm)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-sm)',
                  }}
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)',
        }}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-lg)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: method.isDefault ? '2px solid var(--color-primary)' : 'none',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-lg)',
              }}>
                {/* Card Icon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                }}>
                  {getCardIcon(method.brand)}
                </div>

                {/* Card Details */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)',
                  }}>
                    <span style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-primary)',
                    }}>
                      {method.brand} •••• {method.last4}
                    </span>
                    {method.isDefault && (
                      <span style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-bold)',
                      }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                }}>
                  {!method.isDefault && (
                    <button
                      onClick={() => toast.success('Set as default payment method')}
                      className="btn btn-secondary"
                      style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => toast.success('Payment method removed')}
                    style={{
                      padding: 'var(--spacing-sm)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-lg)',
                    }}
                    title="Remove card"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Payment Options */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-lg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}>
            Other Payment Options
          </h3>
          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)',
              }}>
                Cash on Delivery
              </div>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Pay when you receive your order
              </div>
            </div>
            <span style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
            }}>
              AVAILABLE
            </span>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default PaymentMethods;
