import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Sweet, CreateSweet } from '../types';
import { sweetsAPI } from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ModernSweetCard from '../components/ModernSweetCard';
import StatsCard from '../components/StatsCard';
import AddEditSweetModal from '../components/AddEditSweetModal';
import { toast } from '../utils/toast';

const ModernDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Search and filter state
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const data = await sweetsAPI.getAll();
      setSweets(data);
      setFilteredSweets(data);
    } catch (err: any) {
      toast.error('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleFilter = () => {
    let filtered = [...sweets];

    if (searchName) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchCategory) {
      filtered = filtered.filter(sweet =>
        sweet.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(sweet => Number(sweet.price) >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(sweet => Number(sweet.price) <= Number(maxPrice));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'stock':
          return b.quantity - a.quantity;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredSweets(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchName, searchCategory, minPrice, maxPrice, sortBy, sweets]);

  const handleReset = () => {
    setSearchName('');
    setSearchCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
  };

  const handleAddSweet = async (data: CreateSweet) => {
    setModalLoading(true);
    try {
      await sweetsAPI.create(data);
      toast.success('Sweet added successfully!');
      setShowAddModal(false);
      fetchSweets();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add sweet');
    } finally {
      setModalLoading(false);
    }
  };

  // Stats calculation
  const stats = {
    totalSweets: sweets.length,
    lowStock: sweets.filter(s => s.quantity < 10).length,
    outOfStock: sweets.filter(s => s.quantity === 0).length,
    totalValue: sweets.reduce((sum, s) => sum + (Number(s.price) * s.quantity), 0),
    totalRevenue: sweets.reduce((sum, s) => sum + (Number(s.price) * s.quantity), 0),
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
          {/* Stats Cards (Admin Only) */}
          {isAdmin && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <StatsCard
                  icon="🍬"
                  label="Total Products"
                  value={stats.totalSweets}
                  bgColor="var(--color-primary-light)"
                />
                <StatsCard
                  icon="💰"
                  label="Total Revenue"
                  value={`$${stats.totalRevenue.toFixed(2)}`}
                  bgColor="var(--color-success-light)"
                />
                <StatsCard
                  icon="⚠️"
                  label="Low Stock"
                  value={stats.lowStock}
                  bgColor="var(--color-warning-light)"
                />
                <StatsCard
                  icon="❌"
                  label="Out of Stock"
                  value={stats.outOfStock}
                  bgColor="var(--color-danger-light)"
                />
              </div>

              {/* Quick Actions */}
              <div className="card mb-5" style={{
                background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%)',
                border: '2px dashed var(--color-primary)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--spacing-lg)',
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      ⚡ Quick Actions
                    </h3>
                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                    }}>
                      Manage your inventory and products
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="btn btn-primary"
                      style={{
                        fontSize: 'var(--text-base)',
                        padding: 'var(--spacing-md) var(--spacing-xl)',
                      }}
                    >
                      ➕ Add New Sweet
                    </button>
                    <button
                      onClick={() => navigate('/admin')}
                      className="btn btn-secondary"
                      style={{
                        fontSize: 'var(--text-base)',
                        padding: 'var(--spacing-md) var(--spacing-xl)',
                      }}
                    >
                      ⚙️ Manage Inventory
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Search & Filter Section */}
          <div className="card mb-4">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>🔍 Search & Filter</h2>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Filter by category..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input"
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select"
                style={{ maxWidth: '200px' }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock Level</option>
              </select>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset Filters
              </button>
              <div style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>
                {filteredSweets.length} sweet(s) found
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div className="spinner spinner-lg"></div>
              <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                Loading sweets...
              </p>
            </div>
          ) : filteredSweets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div style={{ fontSize: '4rem' }}>🔍</div>
              <h3 style={{ marginTop: 'var(--spacing-md)' }}>No sweets found</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredSweets.map((sweet) => (
                <ModernSweetCard
                  key={sweet.id}
                  sweet={sweet}
                  isAdmin={isAdmin}
                  onUpdate={fetchSweets}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Sweet Modal */}
      {showAddModal && (
        <AddEditSweetModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSweet}
          loading={modalLoading}
        />
      )}
    </div>
  );
};

export default ModernDashboard;
