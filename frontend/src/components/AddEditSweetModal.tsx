import React, { useState, useEffect } from 'react';
import type { Sweet, CreateSweet } from '../types';

interface AddEditSweetModalProps {
  sweet?: Sweet | null;
  onClose: () => void;
  onSubmit: (data: CreateSweet) => void;
  loading?: boolean;
}

const CATEGORIES = [
  'Milk Based',
  'Syrup Based',
  'Dry Fruit',
  'Flour Based',
  'Fried',
  'Bengali',
  'South Indian',
  'Chocolate',
  'Other',
];

const AddEditSweetModal: React.FC<AddEditSweetModalProps> = ({ sweet, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<CreateSweet>({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    image_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: Number(sweet.price),
        quantity: sweet.quantity,
        image_url: sweet.image_url || '',
      });
    }
  }, [sweet]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sweet name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isEdit = !!sweet;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isEdit ? 'var(--color-primary-light)' : 'var(--color-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-2xl)',
            }}>
              {isEdit ? '✏️' : '➕'}
            </div>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              {isEdit ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Sweet Name */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="sweetName" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)',
              }}>
                Sweet Name *
              </label>
              <input
                id="sweetName"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                }}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Gulab Jamun"
                required
              />
              {errors.name && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-danger)',
                  marginTop: 'var(--spacing-xs)',
                }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Category */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="category" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)',
              }}>
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setErrors({ ...errors, category: '' });
                }}
                className={`select ${errors.category ? 'input-error' : ''}`}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-danger)',
                  marginTop: 'var(--spacing-xs)',
                }}>
                  {errors.category}
                </div>
              )}
            </div>

            {/* Price and Quantity Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              {/* Price */}
              <div>
                <label htmlFor="price" style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--color-text-primary)',
                }}>
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
                    setErrors({ ...errors, price: '' });
                  }}
                  className={`input ${errors.price ? 'input-error' : ''}`}
                  placeholder="0.00"
                  required
                />
                {errors.price && (
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-danger)',
                    marginTop: 'var(--spacing-xs)',
                  }}>
                    {errors.price}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  marginBottom: 'var(--spacing-xs)',
                  color: 'var(--color-text-primary)',
                }}>
                  Stock Quantity *
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 });
                    setErrors({ ...errors, quantity: '' });
                  }}
                  className={`input ${errors.quantity ? 'input-error' : ''}`}
                  placeholder="0"
                  required
                />
                {errors.quantity && (
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-danger)',
                    marginTop: 'var(--spacing-xs)',
                  }}>
                    {errors.quantity}
                  </div>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="imageUrl" style={{
                display: 'block',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)',
              }}>
                Image URL (Optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="input"
                placeholder="https://example.com/image.jpg"
              />
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-xs)',
              }}>
                Optional: Enter a URL for the sweet's image
              </div>
            </div>

            {/* Preview if editing */}
            {isEdit && (
              <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-border)',
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}>
                  Preview:
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-primary)',
                }}>
                  <strong>{formData.name || 'Sweet Name'}</strong> • {formData.category || 'Category'} • ${formData.price.toFixed(2)} • Stock: {formData.quantity}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span className="spinner"></span>
                  {isEdit ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                isEdit ? '✓ Update Sweet' : '+ Add Sweet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditSweetModal;
