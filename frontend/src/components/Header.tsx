import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 'var(--z-sticky)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--spacing-lg)',
      gap: 'var(--spacing-lg)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <span style={{ fontSize: 'var(--text-2xl)' }}>🍭</span>
        <h1 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-primary)',
          margin: 0,
        }}>
          Sweet Shop
        </h1>
      </div>

      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: 'var(--spacing-md)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-gray-400)',
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{
              paddingLeft: '40px',
              backgroundColor: 'var(--color-gray-50)',
              border: '1px solid var(--color-gray-200)',
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginLeft: 'auto' }}>
        {/* Admin Badge */}
        {isAdmin && (
          <span className="badge badge-primary">
            Admin
          </span>
        )}

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-semibold)',
            }}
          >
            {getUserInitials()}
          </button>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '200px',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                  {user?.email}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {isAdmin ? 'Administrator' : 'Customer'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-danger)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
