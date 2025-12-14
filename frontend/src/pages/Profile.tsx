import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerLayout from '../components/CustomerLayout';
import { toast } from '../utils/toast';
import { profileAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileAPI.get();
        setProfileData({
          fullName: data.full_name || user?.email?.split('@')[0] || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          zipCode: data.zip_code || ''
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      await profileAPI.update({
        full_name: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        zip_code: profileData.zipCode
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
            👤 My Profile
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
          }}>
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {/* Profile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)',
            paddingBottom: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              👤
            </div>
            <div>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                {profileData.fullName || 'User'}
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                {user?.isAdmin ? '👑 Admin' : '👤 Customer'}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
                style={{
                  marginLeft: 'auto',
                  padding: 'var(--spacing-sm) var(--spacing-lg)',
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Profile Form */}
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-lg)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-lg)',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="input"
                  style={{
                    width: '100%',
                    backgroundColor: isEditing ? 'white' : 'var(--color-gray-50)',
                  }}
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
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="input"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-gray-50)',
                  }}
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
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+1 234 567 890"
                className="input"
                style={{
                  width: '100%',
                  backgroundColor: isEditing ? 'white' : 'var(--color-gray-50)',
                }}
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
                Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
                placeholder="123 Main Street"
                className="input"
                style={{
                  width: '100%',
                  backgroundColor: isEditing ? 'white' : 'var(--color-gray-50)',
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 'var(--spacing-lg)',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}>
                  City
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  disabled={!isEditing}
                  placeholder="New York"
                  className="input"
                  style={{
                    width: '100%',
                    backgroundColor: isEditing ? 'white' : 'var(--color-gray-50)',
                  }}
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
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={profileData.zipCode}
                  onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                  disabled={!isEditing}
                  placeholder="10001"
                  className="input"
                  style={{
                    width: '100%',
                    backgroundColor: isEditing ? 'white' : 'var(--color-gray-50)',
                  }}
                />
              </div>
            </div>

            {isEditing && (
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'flex-end',
                marginTop: 'var(--spacing-md)',
              }}>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                  }}
                >
                  💾 Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--spacing-lg)',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📦</div>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}>
              0
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              Total Orders
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>💰</div>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}>
              $0.00
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              Total Spent
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>⭐</div>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}>
              0
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              Rewards Points
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Profile;
