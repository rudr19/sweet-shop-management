import React, { ReactNode } from 'react';
import CustomerNavbar from './CustomerNavbar';
import CartSidebar from './CartSidebar';

interface CustomerLayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

/**
 * CustomerLayout - E-commerce style layout for customers ONLY
 * Features:
 * - Full-width navbar (no sidebar)
 * - Shopping cart functionality
 * - Search bar
 * - User dropdown
 */
const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, onSearch, searchQuery }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
    }}>
      {/* Customer Navbar - No Sidebar */}
      <CustomerNavbar onSearch={onSearch} searchQuery={searchQuery} />

      {/* Main Content - Full Width */}
      <main style={{
        paddingTop: '64px', // Account for fixed navbar
        minHeight: 'calc(100vh - 64px)',
      }}>
        {children}
      </main>

      {/* Cart Sidebar - CUSTOMER ONLY */}
      <CartSidebar />
    </div>
  );
};

export default CustomerLayout;
