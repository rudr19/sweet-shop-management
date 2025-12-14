import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Sweet, CreateSweet } from '../types';
import { sweetsAPI } from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { toast } from '../utils/toast';

const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateSweet>({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    image_url: '',
  });

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [restockId, setRestockId] = useState<number | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchSweets();
  }, [isAdmin, navigate]);

  const fetchSweets = async () => {
    try {
      const data = await sweetsAPI.getAll();
      setSweets(data);
    } catch (err: any) {
      toast.error('Failed to load sweets');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await sweetsAPI.update(editingId, formData);
        toast.success('Sweet updated successfully!');
        setEditingId(null);
      } else {
        await sweetsAPI.create(formData);
        toast.success('Sweet created successfully!');
      }

      setFormData({ name: '', category: '', price: 0, quantity: 0, image_url: '' });
      fetchSweets();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingId(sweet.id);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: Number(sweet.price),
      quantity: sweet.quantity,
      image_url: sweet.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: 0, quantity: 0, image_url: '' });
  };

  const handleRestock = async (id: number) => {
    if (restockQuantity <= 0) {
      toast.error('Restock quantity must be positive');
      return;
    }

    setLoading(true);

    try {
      await sweetsAPI.restock(id, restockQuantity);
      toast.success('Restocked successfully!');
      setRestockId(null);
      setRestockQuantity(0);
      fetchSweets();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);

    try {
      await sweetsAPI.delete(id);
      toast.success('Sweet deleted successfully!');
      setDeleteId(null);
      fetchSweets();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const getStockBadgeClass = (quantity: number) => {
    if (quantity === 0) return '';
    if (quantity < 5) return 'badge-danger';
    if (quantity < 20) return 'badge-warning';
    return 'badge-success';
  };

  const getStockText = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 5) return 'Low Stock';
    if (quantity < 20) return 'Limited';
    return 'In Stock';
  };

  return (
    <div>
      <Header />
      <Sidebar />

      {/* Main Content */}
      <main style={{
        marginLeft: '240px',
        marginTop: '64px',
        padding: 'var(--spacing-xl)',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: 'var(--color-background)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Page Header */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}>
              ⚙️ Admin Panel
            </h1>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
            }}>
              Manage your sweet shop inventory
            </p>
          </div>

          {/* Add/Edit Sweet Form */}
          <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-text-primary)',
            }}>
              {editingId ? '✏️ Edit Sweet' : '➕ Add New Sweet'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    marginBottom: 'var(--spacing-xs)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Sweet Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Gulab Jamun"
                    className="input"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    marginBottom: 'var(--spacing-xs)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="e.g., Milk Based"
                    className="input"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    marginBottom: 'var(--spacing-xs)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                    placeholder="0.00"
                    className="input"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    marginBottom: 'var(--spacing-xs)',
                    color: 'var(--color-text-primary)',
                  }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    required
                    placeholder="0"
                    className="input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--color-text-primary)',
                }}>
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="input"
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <span className="spinner"></span>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    editingId ? '✓ Update Sweet' : '+ Add Sweet'
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Manage Sweets */}
          <div className="card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-lg)',
            }}>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--color-text-primary)',
              }}>
                📦 Inventory Management
              </h2>
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Total: {sweets.length} sweets
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--color-gray-50)',
                    borderBottom: '2px solid var(--color-border)',
                  }}>
                    <th style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      Name
                    </th>
                    <th style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      Category
                    </th>
                    <th style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      Price
                    </th>
                    <th style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'left',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      Stock
                    </th>
                    <th style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'right',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sweets.map((sweet) => (
                    <tr key={sweet.id} style={{
                      borderBottom: '1px solid var(--color-border)',
                    }}>
                      <td style={{
                        padding: 'var(--spacing-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        color: 'var(--color-text-primary)',
                      }}>
                        {sweet.name}
                      </td>
                      <td style={{
                        padding: 'var(--spacing-md)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {sweet.category}
                      </td>
                      <td style={{
                        padding: 'var(--spacing-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--color-success)',
                      }}>
                        ${Number(sweet.price).toFixed(2)}
                      </td>
                      <td style={{ padding: 'var(--spacing-md)' }}>
                        <span className={`badge ${getStockBadgeClass(sweet.quantity)}`}>
                          {sweet.quantity} - {getStockText(sweet.quantity)}
                        </span>
                      </td>
                      <td style={{
                        padding: 'var(--spacing-md)',
                        textAlign: 'right',
                      }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEdit(sweet)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 'var(--text-xs)' }}
                          >
                            ✏️ Edit
                          </button>

                          {restockId === sweet.id ? (
                            <>
                              <input
                                type="number"
                                min="1"
                                value={restockQuantity}
                                onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                                className="input"
                                style={{
                                  width: '80px',
                                  padding: 'var(--spacing-xs)',
                                  fontSize: 'var(--text-xs)',
                                }}
                                placeholder="Qty"
                              />
                              <button
                                onClick={() => handleRestock(sweet.id)}
                                className="btn btn-success btn-sm"
                                style={{ fontSize: 'var(--text-xs)' }}
                                disabled={loading}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setRestockId(null)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: 'var(--text-xs)' }}
                              >
                                ✗
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setRestockId(sweet.id);
                                setRestockQuantity(10);
                              }}
                              className="btn btn-success btn-sm"
                              style={{ fontSize: 'var(--text-xs)' }}
                            >
                              📦 Restock
                            </button>
                          )}

                          {deleteId === sweet.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(sweet.id)}
                                className="btn btn-danger btn-sm"
                                style={{ fontSize: 'var(--text-xs)' }}
                                disabled={loading}
                              >
                                Confirm?
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: 'var(--text-xs)' }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteId(sweet.id)}
                              className="btn btn-danger btn-sm"
                              style={{ fontSize: 'var(--text-xs)' }}
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sweets.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-2xl)',
                  color: 'var(--color-text-secondary)',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📦</div>
                  <p>No sweets in inventory. Add your first sweet above!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
