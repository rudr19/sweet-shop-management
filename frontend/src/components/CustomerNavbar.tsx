import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface CustomerNavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ onSearch, searchQuery: externalSearchQuery }) => {
  const { user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearchQuery;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (value: string) => {
    if (onSearch) {
      onSearch(value);
    } else {
      setLocalSearchQuery(value);
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--spacing-xl)',
      gap: 'var(--spacing-xl)',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '2rem' }}>🍭</span>
        <div>
          <div style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-primary)',
            lineHeight: 1,
          }}>
            Sweet Shop
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1,
          }}>
            Sweetness in every bite
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          flex: '1 1 auto',
          maxWidth: '600px',
          minWidth: '200px',
          position: 'relative',
        }}
      >
        <input
          type="text"
          placeholder="Search for sweets, chocolates, candies..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input"
          style={{
            width: '100%',
            paddingLeft: '40px',
            paddingRight: '40px',
          }}
        />
        <span style={{
          position: 'absolute',
          left: 'var(--spacing-md)',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'var(--text-lg)',
          color: 'var(--color-gray-400)',
        }}>
          🔍
        </span>
      </div>

      {/* Right Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
        flexShrink: 0,
        marginLeft: 'auto',
      }}>
        {/* Cart Icon with Badge */}
        <button
          onClick={toggleCart}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.75rem',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius)',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: 'var(--color-danger)',
              color: 'white',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
            }}>
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-text-primary)',
            }}>
              {user?.email?.split('@')[0] || 'User'}
            </span>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              transition: 'transform var(--transition-fast)',
              transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowUserMenu(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999,
                }}
              />

              {/* Menu */}
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden',
              }}>
                {/* User Info */}
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-gray-50)',
                }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-text-primary)',
                  }}>
                    {user?.email?.split('@')[0] || 'User'}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    {user?.email}
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: 'var(--spacing-xs)' }}>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/orders');
                    }}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>📦</span>
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/payment-methods');
                    }}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>💳</span>
                    <span>Payment Methods</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                </div>

                {/* Logout */}
                <div style={{
                  padding: 'var(--spacing-xs)',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-danger)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
