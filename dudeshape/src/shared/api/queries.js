import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

/**
 * Хук-обёртка для получения списка с сервера.
 * useSection('products') → GET /api/products → data
 */
export function useSection(section) {
  return useQuery({
    queryKey: ['section', section],
    queryFn: async () => {
      const { data } = await api.get(`/${section}`);
      return data;
    },
  });
}

/**
 * Добавление в корзину. После успеха — инвалидируем ключ 'cart',
 * чтобы UI обновился автоматически.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, qty = 1 }) => {
      const { data } = await api.post('/cart', { productId, qty });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', 'cart'] });
    },
  });
}

/**
 * Удаление из корзины — то же самое.
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/cart/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', 'cart'] });
    },
  });
}

/**
 * Подписка на рассылку.
 */
export function useSubscribe() {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await api.post('/subscribe', { email });
      return data;
    },
  });
}
