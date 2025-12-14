import React, { useState, useEffect } from 'react';
import CustomerLayout from '../components/CustomerLayout';
import { ordersAPI } from '../services/api';
import { toast } from '../utils/toast';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Orders');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const status = activeFilter === 'All Orders' ? undefined : activeFilter;
        const data = await ordersAPI.getAll(status);

        // Transform data to match component format
        setOrders(data.map((order: any) => ({
          id: `ORD-${String(order.id).padStart(3, '0')}`,
          date: order.created_at,
          status: order.status,
          total: parseFloat(order.total_amount),
          items: parseInt(order.item_count) || 0
        })));
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [activeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'var(--color-success)';
      case 'Shipped':
        return 'var(--color-primary)';
      case 'Processing':
        return 'var(--color-warning)';
      case 'Cancelled':
        return 'var(--color-danger)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '✅';
      case 'Shipped':
        return '🚚';
      case 'Processing':
        return '⏳';
      case 'Cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  return (
    <CustomerLayout>
      <div style={{
        maxWidth: '1000px',
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
            📦 My Orders
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
          }}>
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-lg)' }}>📦</div>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
            }}>
              No Orders Yet
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              Start shopping to see your orders here!
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn btn-primary"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-lg)',
              }}
            >
              🛍️ Start Shopping
            </button>
          </div>
        ) : (
          /* Orders List */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)',
          }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-lg)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr 120px 100px auto',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'center',
                }}>
                  {/* Order ID */}
                  <div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '2px',
                    }}>
                      Order ID
                    </div>
                    <div style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-primary)',
                    }}>
                      {order.id}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '2px',
                    }}>
                      Order Date
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                    }}>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '2px',
                    }}>
                      Status
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: `${getStatusColor(order.status)}15`,
                      color: getStatusColor(order.status),
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                    }}>
                      <span>{getStatusIcon(order.status)}</span>
                      <span>{order.status}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '2px',
                    }}>
                      Total
                    </div>
                    <div style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-text-primary)',
                    }}>
                      ${order.total.toFixed(2)}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    className="btn btn-secondary"
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      fontSize: 'var(--text-sm)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    View Details →
                  </button>
                </div>

                {/* Order Items Summary */}
                <div style={{
                  marginTop: 'var(--spacing-md)',
                  paddingTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}>
                  {order.items} item{order.items !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-md)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            justifyContent: 'center',
          }}>
            {['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="btn btn-secondary"
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: 'var(--text-sm)',
                  backgroundColor: activeFilter === tab ? 'var(--color-primary)' : undefined,
                  color: activeFilter === tab ? 'white' : undefined,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Orders;
