import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/shared/lib/cart-context';
import { FavoritesProvider } from '@/shared/lib/favorites-context';

/**
 * Один QueryClient на всё приложение.
 * staleTime: 60 секунд — данные считаются свежими, повторный заход не дёргает сервер.
 * retry: 1 — один повтор при ошибке сети.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
