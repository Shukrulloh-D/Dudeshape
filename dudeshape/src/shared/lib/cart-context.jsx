import { createContext, useContext } from 'react';
import { useSection } from '@/shared/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: items = [] } = useSection('cart');

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
