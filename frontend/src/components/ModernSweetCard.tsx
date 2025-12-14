import React, { useState } from 'react';
import type { Sweet, CreateSweet } from '../types';
import { sweetsAPI } from '../services/api';
import { toast } from '../utils/toast';
import PurchaseModal from './PurchaseModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import RestockModal from './RestockModal';
import AddEditSweetModal from './AddEditSweetModal';

interface ModernSweetCardProps {
  sweet: Sweet;
  isAdmin: boolean;
  onUpdate: () => void;
}

const ModernSweetCard: React.FC<ModernSweetCardProps> = ({
  sweet,
  isAdmin,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handlePurchase = async (quantity: number) => {
    setLoading(true);
    try {
      await sweetsAPI.purchase(sweet.id, quantity);
      toast.success(`Successfully purchased ${quantity} ${sweet.name}!`);
      setShowPurchaseModal(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await sweetsAPI.delete(sweet.id);
      toast.success(`${sweet.name} deleted successfully!`);
      setShowDeleteModal(false);
      setShowMenu(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (quantity: number) => {
    setLoading(true);
    try {
      await sweetsAPI.restock(sweet.id, quantity);
      toast.success(`Restocked ${quantity} units of ${sweet.name}!`);
      setShowRestockModal(false);
      setShowMenu(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: CreateSweet) => {
    setLoading(true);
    try {
      await sweetsAPI.update(sweet.id, data);
      toast.success(`${sweet.name} updated successfully!`);
      setShowEditModal(false);
      setShowMenu(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = () => {
    if (sweet.quantity === 0) return 'var(--color-gray-400)';
    if (sweet.quantity < 5) return 'var(--color-danger)';
    if (sweet.quantity < 20) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const getStockBadge = () => {
    if (sweet.quantity === 0) return { text: 'Out of Stock', class: '' };
    if (sweet.quantity < 5) return { text: 'Low Stock!', class: 'badge-danger' };
    if (sweet.quantity < 20) return { text: 'Limited', class: 'badge-warning' };
    return { text: 'In Stock', class: 'badge-success' };
  };

  const stockBadge = getStockBadge();

  return (
    <>
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      transition: 'all var(--transition-base)',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* Image Placeholder */}
      <div style={{
        width: '100%',
        height: '180px',
        backgroundColor: 'var(--color-gray-100)',
        borderRadius: 'var(--radius)',
        marginBottom: 'var(--spacing-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        overflow: 'hidden',
      }}>
        {sweet.image_url ? (
          <img src={sweet.image_url} alt={sweet.name} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }} />
        ) : (
          <span>🍬</span>
        )}
      </div>

      {/* Stock Badge */}
      <div style={{ position: 'absolute', top: 'var(--spacing-md)', right: 'var(--spacing-md)' }}>
        <span className={`badge ${stockBadge.class}`}>
          {stockBadge.text}
        </span>
      </div>

      {/* Admin Menu */}
      {isAdmin && (
        <div style={{ position: 'absolute', top: 'var(--spacing-md)', left: 'var(--spacing-md)' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: 'var(--text-lg)',
              boxShadow: 'var(--shadow)',
            }}
          >
            ⋮
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 'var(--spacing-xs)',
              backgroundColor: 'white',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 10,
              minWidth: '140px',
            }}>
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowMenu(false);
                }}
                className="btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0 }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  setShowRestockModal(true);
                  setShowMenu(false);
                }}
                className="btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0 }}
              >
                📦 Restock
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setShowMenu(false);
                }}
                className="btn-ghost btn-sm"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  color: 'var(--color-danger)',
                  borderRadius: 0,
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sweet Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          marginBottom: 'var(--spacing-xs)',
          color: 'var(--color-text-primary)',
        }}>
          {sweet.name}
        </h3>

        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-md)',
        }}>
          {sweet.category}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}>
          <span style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-success)',
          }}>
            ${Number(sweet.price).toFixed(2)}
          </span>
          <span style={{
            fontSize: 'var(--text-sm)',
            color: getStockColor(),
            fontWeight: 'var(--font-medium)',
          }}>
            Stock: {sweet.quantity}
          </span>
        </div>
      </div>

      {/* Purchase Button - Only for Customers */}
      {!isAdmin && (
        sweet.quantity > 0 ? (
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="btn btn-success"
            style={{ width: '100%' }}
          >
            🛒 Buy Now
          </button>
        ) : (
          <button disabled className="btn" style={{
            backgroundColor: 'var(--color-gray-200)',
            color: 'var(--color-gray-500)',
            cursor: 'not-allowed',
            width: '100%',
          }}>
            Out of Stock
          </button>
        )
      )}
    </div>

    {/* Modals */}
    {showPurchaseModal && (
      <PurchaseModal
        sweet={sweet}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handlePurchase}
        loading={loading}
      />
    )}

    {showDeleteModal && (
      <DeleteConfirmModal
        sweet={sweet}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
    )}

    {showRestockModal && (
      <RestockModal
        sweet={sweet}
        onClose={() => setShowRestockModal(false)}
        onConfirm={handleRestock}
        loading={loading}
      />
    )}

    {showEditModal && (
      <AddEditSweetModal
        sweet={sweet}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEdit}
        loading={loading}
      />
    )}
    </>
  );
};

export default ModernSweetCard;
