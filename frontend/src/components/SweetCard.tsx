import React, { useState } from 'react';
import type { Sweet } from '../types';
import { sweetsAPI } from '../services/api';

interface SweetCardProps {
  sweet: Sweet;
  isAdmin: boolean;
  onUpdate: () => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, isAdmin, onUpdate }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePurchase = async () => {
    if (purchaseQuantity <= 0 || purchaseQuantity > sweet.quantity) {
      setMessage('Invalid quantity');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await sweetsAPI.purchase(sweet.id, purchaseQuantity);
      setMessage('Purchase successful!');
      setPurchaseQuantity(1);
      onUpdate();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await sweetsAPI.delete(sweet.id);
      onUpdate();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sweet-card">
      <h3>{sweet.name}</h3>
      <div className="sweet-info">
        <p className="category">{sweet.category}</p>
        <p className="price">${Number(sweet.price).toFixed(2)}</p>
        <p className={`quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
          Stock: {sweet.quantity}
        </p>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="sweet-actions">
        {!isAdmin && sweet.quantity > 0 && (
          <div className="purchase-section">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
              className="quantity-input"
            />
            <button
              onClick={handlePurchase}
              disabled={loading || sweet.quantity === 0}
              className="btn-primary"
            >
              {loading ? 'Purchasing...' : 'Purchase'}
            </button>
          </div>
        )}

        {!isAdmin && sweet.quantity === 0 && <p className="out-of-stock-text">Out of Stock</p>}

        {isAdmin && (
          <button onClick={handleDelete} className="btn-danger" disabled={loading}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;
