import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerLayout from '../components/CustomerLayout';
import { toast } from '../utils/toast';
import { profileAPI } from '../services/api';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await profileAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
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
        }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)',
          }}>
            ⚙️ Settings
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
          }}>
            Manage your account preferences
          </p>
        </div>

        {/* Notifications Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            🔔 Notifications
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}>
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
              { key: 'orderUpdates', label: 'Order Updates', description: 'Get updates about your orders' },
              { key: 'promotions', label: 'Promotions & Offers', description: 'Receive special offers and discounts' },
              { key: 'newsletter', label: 'Newsletter', description: 'Subscribe to our newsletter' },
            ].map((item) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--color-gray-50)',
                }}
              >
                <div>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: '2px',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    {item.description}
                  </div>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '28px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings[item.key as keyof typeof settings] ? 'var(--color-primary)' : 'var(--color-gray-300)',
                    borderRadius: '28px',
                    transition: 'background-color var(--transition-fast)',
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '20px',
                      width: '20px',
                      left: settings[item.key as keyof typeof settings] ? '26px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: 'left var(--transition-fast)',
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveSettings}
            className="btn btn-primary"
            style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
            }}
          >
            💾 Save Settings
          </button>
        </div>

        {/* Change Password */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            🔒 Change Password
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
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
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
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
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
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="btn btn-primary"
              style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
              }}
            >
              🔑 Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid var(--color-danger-light)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-danger)',
            marginBottom: 'var(--spacing-md)',
          }}>
            ⚠️ Danger Zone
          </h2>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => toast.error('Account deletion is disabled in demo mode')}
            className="btn btn-danger"
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
            }}
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Settings;
