import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Sweet } from '../types';

interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (sweet: Sweet, quantity: number) => void;
  removeFromCart: (sweetId: number) => void;
  updateQuantity: (sweetId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sweetshop_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sweetshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (sweet: Sweet, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.sweet.id === sweet.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { sweet, quantity }];
      }
    });
  };

  const removeFromCart = (sweetId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.sweet.id !== sweetId));
  };

  const updateQuantity = (sweetId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.sweet.id === sweetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.sweet.price) * item.quantity,
    0
  );

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
