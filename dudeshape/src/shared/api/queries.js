import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

const KEY = (s) => ['section', s];

export function useSection(section) {
  return useQuery({
    queryKey: KEY(section),
    queryFn: async () => (await api.get(`/${section}`)).data,
  });
}

function useCartMutation(mutationFn) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY('cart') }),
  });
}

export const useAddToCart = () =>
  useCartMutation(({ productId, qty = 1 }) => api.post('/cart', { productId, qty }).then((r) => r.data));

export const useUpdateCartQty = () =>
  useCartMutation(({ id, qty }) => api.patch(`/cart/${id}`, { qty }).then((r) => r.data));

export const useRemoveFromCart = () =>
  useCartMutation((id) => api.delete(`/cart/${id}`).then((r) => r.data));

export const useClearCart = () =>
  useCartMutation(() => api.delete('/cart').then((r) => r.data));

export const useSubscribe = () =>
  useMutation({
    mutationFn: (email) => api.post('/subscribe', { email }).then((r) => r.data),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }) => api.post('/login', { email, password }).then((r) => r.data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: ({ name, email, password }) =>
      api.post('/register', { name, email, password }).then((r) => r.data),
  });
