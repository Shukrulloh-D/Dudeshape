import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/shared/lib/cart-context';
import { FavoritesProvider } from '@/shared/lib/favorites-context';
import { UserProvider } from '@/shared/lib/user-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
