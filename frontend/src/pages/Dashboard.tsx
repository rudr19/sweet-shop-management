import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Sweet } from '../types';
import { sweetsAPI } from '../services/api';
import SweetCard from '../components/SweetCard';

const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter state
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchSweets = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await sweetsAPI.getAll();
      setSweets(data);
      setFilteredSweets(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSearch = () => {
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

    setFilteredSweets(filtered);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchCategory('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredSweets(sweets);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    handleSearch();
  }, [searchName, searchCategory, minPrice, maxPrice, sweets]);

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <h3>Profile</h3>
          <p><strong>Email:</strong></p>
          <p>{user?.email}</p>
          {isAdmin && (
            <p style={{ marginTop: '12px' }}>
              <span className="admin-badge">Admin</span>
            </p>
          )}
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-nav-item active">
            Dashboard
          </div>
          {isAdmin && (
            <div className="sidebar-nav-item" onClick={() => navigate('/admin')}>
              Admin Panel
            </div>
          )}
          <div className="sidebar-nav-item" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Sweet Shop Dashboard</h1>
        </header>

      <div className="search-section">
        <h2>Search & Filter</h2>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Filter by category..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="search-input"
          />
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="search-input price-input"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="search-input price-input"
          />
          <button onClick={handleReset} className="btn-secondary">
            Reset
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading sweets...</div>
      ) : (
        <div className="sweets-grid">
          {filteredSweets.length === 0 ? (
            <p className="no-results">No sweets found</p>
          ) : (
            filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                isAdmin={isAdmin}
                onUpdate={fetchSweets}
              />
            ))
          )}
        </div>
      )}
      </main>
    </div>
  );
};

export default Dashboard;
