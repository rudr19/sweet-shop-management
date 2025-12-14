import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      toast.success('Login successful! Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: '0 0 50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '-100px',
          left: '-100px',
        }}></div>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          bottom: '-50px',
          right: '-50px',
        }}></div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            fontSize: '6rem',
            marginBottom: 'var(--spacing-xl)',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
          }}>
            🍭
          </div>
          <h1 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 'var(--spacing-md)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            Sweet Shop
          </h1>
          <p style={{
            fontSize: 'var(--text-xl)',
            marginBottom: 'var(--spacing-xl)',
            opacity: 0.9,
          }}>
            "Sweetness in every bite"
          </p>

          <div style={{
            textAlign: 'left',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>✓</span>
              <span>Fresh sweets daily</span>
            </div>
            <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>✓</span>
              <span>Best prices guaranteed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>✓</span>
              <span>Fast delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-2xl)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
        }}>
          <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}>
              Welcome Back
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
            }}>
              Login to your Sweet Shop account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--spacing-xl)' }}>
            {/* Email Input */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: 'var(--spacing-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-gray-400)',
                }}>
                  📧
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="input"
                  style={{
                    paddingLeft: '44px',
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: 'var(--spacing-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-gray-400)',
                }}>
                  🔒
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  className="input"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '44px',
                    width: '100%',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--spacing-md)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--text-lg)',
                    padding: 0,
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)' }}>
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)',
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: '1px',
              backgroundColor: 'var(--color-border)',
            }}></div>
            <span style={{
              position: 'relative',
              backgroundColor: '#f9fafb',
              padding: '0 var(--spacing-md)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
            }}>
              Don't have an account?
            </span>
          </div>

          {/* Register Link */}
          <Link to="/register" style={{
            display: 'block',
            textAlign: 'center',
            padding: 'var(--spacing-md)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-semibold)',
            textDecoration: 'none',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
          >
            Create New Account
          </Link>

          {/* Demo Credentials */}
          <div style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
          }}>
            <div style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--spacing-xs)' }}>
              Demo Accounts:
            </div>
            <div>👑 Admin: admin@sweetshop.com / admin123</div>
            <div>👤 Customer: customer@sweetshop.com / customer123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
