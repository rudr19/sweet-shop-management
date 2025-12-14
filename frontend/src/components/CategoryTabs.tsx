import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const categoryIcons: { [key: string]: string } = {
    'All': '🍬',
    'Bengali': '🎊',
    'Dry Fruit': '🌰',
    'Chocolate': '🍫',
    'Candy': '🍭',
    'Cookies': '🍪',
    'Cake': '🍰',
    'Ice Cream': '🍦',
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-md)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: 'var(--spacing-xl)',
    }}>
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        overflowX: 'auto',
        paddingBottom: 'var(--spacing-xs)',
      }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              border: activeCategory === category
                ? '2px solid var(--color-primary)'
                : '2px solid transparent',
              backgroundColor: activeCategory === category
                ? 'var(--color-primary-light)'
                : 'var(--color-gray-50)',
              color: activeCategory === category
                ? 'var(--color-primary)'
                : 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: activeCategory === category
                ? 'var(--font-semibold)'
                : 'var(--font-medium)',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
                e.currentTarget.style.borderColor = 'var(--color-gray-300)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category) {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>
              {categoryIcons[category] || '🍬'}
            </span>
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
