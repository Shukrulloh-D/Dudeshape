import { createContext, useContext } from 'react';
import { useSection } from '@/shared/api';

const CartContext = createContext(null);

/**
 * Корзина живёт в React Query — не надо свой useState.
 * items берём из /api/cart (тот же useSection), count и total считаем на лету.
 */
export function CartProvider({ children }) {
  const { data: items = [] } = useSection('cart');

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
