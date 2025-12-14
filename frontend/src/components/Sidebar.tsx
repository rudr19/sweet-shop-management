import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInitials = () => {
    if (!user?.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard', adminOnly: false },
    { icon: '🍬', label: 'All Sweets', path: '/dashboard', adminOnly: false },
    { icon: '➕', label: 'Add Sweet', path: '/admin', adminOnly: true },
    { icon: '⚙️', label: 'Manage Inventory', path: '/admin', adminOnly: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: '64px',
      width: '240px',
      height: 'calc(100vh - 64px)',
      backgroundColor: 'white',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Profile Card */}
      <div style={{
        padding: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
          }}>
            {getUserInitials()}
          </div>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.email}
            </div>
            <div style={{
              marginTop: 'var(--spacing-xs)',
            }}>
              <span className={isAdmin ? 'badge badge-primary' : 'badge'} style={{
                backgroundColor: isAdmin ? 'var(--color-primary-light)' : 'var(--color-gray-100)',
                color: isAdmin ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}>
                {isAdmin ? 'Admin' : 'Customer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: 'var(--spacing-md)' }}>
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xs)',
                border: 'none',
                borderRadius: 'var(--radius)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={handleLogout}
          className="btn btn-ghost w-full"
          style={{
            color: 'var(--color-danger)',
            justifyContent: 'flex-start',
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
