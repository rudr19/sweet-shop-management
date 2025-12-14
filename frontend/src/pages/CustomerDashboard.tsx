import React, { useState, useEffect } from 'react';
import type { Sweet } from '../types';
import { sweetsAPI } from '../services/api';
import CustomerLayout from '../components/CustomerLayout';
import CategoryTabs from '../components/CategoryTabs';
import CustomerProductCard from '../components/CustomerProductCard';
import { toast } from '../utils/toast';

const CustomerDashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(sweets.map(s => s.category)))];

  // Filter and sort
  useEffect(() => {
    let filtered = [...sweets];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(query) ||
        sweet.category.toLowerCase().includes(query) ||
        (sweet.description && sweet.description.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(sweet => sweet.category === activeCategory);
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
  }, [activeCategory, sortBy, sweets, searchQuery]);

  return (
    <CustomerLayout onSearch={setSearchQuery} searchQuery={searchQuery}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: 'var(--spacing-xl) var(--spacing-xl)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            marginBottom: 'var(--spacing-sm)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}>
            Welcome to Sweet Shop! 🍭
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            opacity: 0.9,
          }}>
            Discover the finest selection of sweets, chocolates, and treats!
          </p>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'var(--spacing-xl)',
        display: 'flex',
        gap: 'var(--spacing-xl)',
      }}>
        {/* Category Sidebar */}
        <aside style={{
          width: '250px',
          flexShrink: 0,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: '80px',
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
            }}>
              <span>📂</span>
              <span>Categories</span>
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
            }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    backgroundColor: activeCategory === category ? 'var(--color-primary)' : 'transparent',
                    color: activeCategory === category ? 'white' : 'var(--color-text-primary)',
                    fontWeight: activeCategory === category ? 'var(--font-semibold)' : 'var(--font-normal)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                    fontSize: 'var(--text-sm)',
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== category) {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== category) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>

        {/* Filter & Sort Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
          }}>
            {filteredSweets.length} product{filteredSweets.length !== 1 ? 's' : ''} found
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            <label style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select"
              style={{
                minWidth: '180px',
              }}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
          }}>
            <div className="spinner spinner-lg"></div>
            <p style={{
              marginTop: 'var(--spacing-md)',
              color: 'var(--color-text-secondary)',
            }}>
              Loading delicious sweets...
            </p>
          </div>
        ) : filteredSweets.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--spacing-sm)',
            }}>
              No sweets found
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)',
          }}>
            {filteredSweets.map((sweet) => (
              <CustomerProductCard key={sweet.id} sweet={sweet} />
            ))}
          </div>
        )}

        {/* Features Section */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          padding: 'var(--spacing-xl)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)',
            color: 'var(--color-text-primary)',
          }}>
            Why Choose Sweet Shop?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🍬</div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                Fresh Daily
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                All our sweets are made fresh every day with the finest ingredients
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💰</div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                Best Prices
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Competitive pricing with regular discounts and special offers
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🚚</div>
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--spacing-sm)',
              }}>
                Fast Delivery
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Quick and reliable delivery straight to your doorstep
              </p>
            </div>
          </div>
        </div>
        </div> {/* End Main Content Area */}
      </div> {/* End Sidebar + Main Container */}
    </CustomerLayout>
  );
};

export default CustomerDashboard;
