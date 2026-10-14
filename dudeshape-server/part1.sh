#!/bin/bash

# ==========================================
# 1. СЕРВЕР
# ==========================================
mkdir -p ../dudeshape-server
cd ../dudeshape-server

cat > package.json << 'END'
{
  "name": "dudeshape-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5"
  }
}
END

cat > server.js << 'END'
/* eslint-env node */
import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'node:fs/promises';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const readDb = async () => JSON.parse(await readFile('./db.json', 'utf-8'));
const writeDb = (data) => writeFile('./db.json', JSON.stringify(data, null, 2));

// Простой GET по секции: /api/products, /api/brands, /api/stats, /api/reviews
app.get('/api/:section', async (req, res) => {
  const db = await readDb();
  const data = db[req.params.section];
  if (data === undefined) return res.status(404).json({ message: 'Not found' });
  res.json(data);
});

// GET одного товара
app.get('/api/products/:id', async (req, res) => {
  const db = await readDb();
  const product = db.products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST — добавить в корзину
app.post('/api/cart', async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const db = await readDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const existing = db.cart.find((item) => item.id === productId);
  if (existing) existing.qty += qty;
  else db.cart.push({ id: product.id, title: product.title, price: product.price, qty });

  await writeDb(db);
  res.json(db.cart);
});

// DELETE — убрать из корзины
app.delete('/api/cart/:id', async (req, res) => {
  const db = await readDb();
  db.cart = db.cart.filter((item) => item.id !== Number(req.params.id));
  await writeDb(db);
  res.json(db.cart);
});

// POST — подписка
app.post('/api/subscribe', (req, res) => {
  res.json({ ok: true, email: req.body.email });
});

app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}`));
END

cat > db.json << 'END'
{
  "banners": [
    {
      "id": 1,
      "title": "Get Your Best Cosmetic Products Here",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
      "image": "/images/hero.png"
    }
  ],

  "brands": [
    { "id": 1, "name": "airbnb",    "logo": "/images/brand-airbnb.png" },
    { "id": 2, "name": "HubSpot",   "logo": "/images/brand-hubspot.png" },
    { "id": 3, "name": "Google",    "logo": "/images/brand-google.png" },
    { "id": 4, "name": "Microsoft", "logo": "/images/brand-microsoft.png" },
    { "id": 5, "name": "Walmart",   "logo": "/images/brand-walmart.png" },
    { "id": 6, "name": "FedEx",     "logo": "/images/brand-fedex.png" }
  ],

  "products": [
    {
      "id": 1,
      "title": "Cosmetic products",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
      "price": 120,
      "image": "/images/product-1.png"
    },
    {
      "id": 2,
      "title": "Cosmetic products",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
      "price": 120,
      "image": "/images/product-2.png"
    }
  ],

  "stats": [
    { "id": 1, "value": "100%", "label": "Organic Products" },
    { "id": 2, "value": "2M+",  "label": "Yearly Sales" },
    { "id": 3, "value": "1.9M+","label": "Happy Customer" }
  ],

  "reviews": [
    {
      "id": 1,
      "title": "Amazing Cosmetic",
      "rating": 5,
      "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      "author": "Rusmin Islam",
      "role": "Designer",
      "avatar": "/images/reviewer.png"
    }
  ],

  "cart": []
}
END

cd ../dudeshape
echo "Сервер готов: dudeshape-server/"

# ==========================================
# 2. АЛИАСЫ + СТИЛИ
# ==========================================
cat > vite.config.js << 'END'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
END

cat > jsconfig.json << 'END'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
END

cat > index.html << 'END'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dudeshape — Cosmetic Store</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
END

mkdir -p src/app/styles
mkdir -p src/shared/api
mkdir -p src/shared/lib
mkdir -p src/shared/ui/{button,container,loader,error-message,surface-title,modal}
mkdir -p src/entities/{product,brand,stat,review}
mkdir -p src/widgets/{header,footer,cart-modal}
mkdir -p src/pages/home/sections/{hero,brands-strip,popular-products,stats,perfect-beauty}

cat > src/app/styles/index.css << 'END'
:root {
  --dark: #1a1a1a;
  --dark-soft: #2f2f2f;
  --text: #1a1a1a;
  --text-muted: #6b7280;
  --bg: #ffffff;
  --bg-soft: #fdf8f5;
  --border: #e5e7eb;
  --accent: #e07a5f;
  --font: 'Inter', system-ui, sans-serif;
  --radius: 6px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; background: none; }
ul { list-style: none; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}
.fade-up { animation: fadeUp 0.5s ease backwards; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg-soft); }
::-webkit-scrollbar-thumb { background: var(--dark); border-radius: 4px; }
END

# ==========================================
# 3. MAIN + APP (с React Query)
# ==========================================
cat > src/main.jsx << 'END'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app';
import '@/app/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
END

cat > src/app/providers.jsx << 'END'
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
END

cat > src/app/app.jsx << 'END'
import { Providers } from './providers';
import { HomePage } from '@/pages/home';

export function App() {
  return (
    <Providers>
      <HomePage />
    </Providers>
  );
}
END

echo "export { App } from './app';" > src/app/index.js

# ==========================================
# 4. SHARED / API
# ==========================================
cat > src/shared/api/client.js << 'END'
import axios from 'axios';

/**
 * Один axios-инстанс для всего проекта.
 * Все запросы идут через него — baseURL один раз, interceptors на месте.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem('token');
    return Promise.reject(error);
  }
);
END

cat > src/shared/api/queries.js << 'END'
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
END

echo "export { api } from './client';
export { useSection, useAddToCart, useRemoveFromCart, useSubscribe } from './queries';" > src/shared/api/index.js

# ==========================================
# 5. SHARED / LIB — контексты
# ==========================================
cat > src/shared/lib/cn.js << 'END'
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}
END

cat > src/shared/lib/cart-context.jsx << 'END'
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
END

cat > src/shared/lib/favorites-context.jsx << 'END'
import { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState([]);

  const toggle = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <FavoritesContext.Provider value={{ ids, toggle, isFavorite: (id) => ids.includes(id) }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
END

cat > src/shared/lib/index.js << 'END'
export { cn } from './cn';
export { CartProvider, useCart } from './cart-context';
export { FavoritesProvider, useFavorites } from './favorites-context';
END

# ==========================================
# 6. SHARED / UI
# ==========================================

# Button
cat > src/shared/ui/button/button.module.css << 'END'
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s, transform 0.15s;
}
.btn:active { transform: scale(0.98); }

.btn--dark { background: var(--dark); color: #fff; }
.btn--dark:hover { background: var(--dark-soft); }

.btn--outline { border: 1px solid var(--dark); color: var(--dark); background: transparent; }
.btn--outline:hover { background: var(--dark); color: #fff; }

.btn--accent { background: var(--accent); color: #fff; }
.btn--accent:hover { opacity: 0.9; }
END

cat > src/shared/ui/button/button.jsx << 'END'
import { cn } from '@/shared/lib';
import styles from './button.module.css';

export function Button({ children, variant = 'dark', className, ...props }) {
  return (
    <button className={cn(styles.btn, styles[`btn--${variant}`], className)} {...props}>
      {children}
    </button>
  );
}
END

echo "export { Button } from './button';" > src/shared/ui/button/index.js

# Container
cat > src/shared/ui/container/container.module.css << 'END'
.container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}
END

cat > src/shared/ui/container/container.jsx << 'END'
import { cn } from '@/shared/lib';
import styles from './container.module.css';

export function Container({ children, className }) {
  return <div className={cn(styles.container, className)}>{children}</div>;
}
END

echo "export { Container } from './container';" > src/shared/ui/container/index.js

# Loader
cat > src/shared/ui/loader/loader.module.css << 'END'
.wrap { padding: 60px; text-align: center; color: var(--text-muted); font-size: 14px; }
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-top-color: var(--dark);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-bottom: 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
END

cat > src/shared/ui/loader/loader.jsx << 'END'
import styles from './loader.module.css';

export function Loader({ text = 'Loading…' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <div>{text}</div>
    </div>
  );
}
END

echo "export { Loader } from './loader';" > src/shared/ui/loader/index.js

# ErrorMessage
cat > src/shared/ui/error-message/error-message.module.css << 'END'
.wrap { padding: 60px; text-align: center; color: #e63946; font-size: 14px; }
END

cat > src/shared/ui/error-message/error-message.jsx << 'END'
import styles from './error-message.module.css';

export function ErrorMessage({ message }) {
  return <div className={styles.wrap}>Failed to load: {message}</div>;
}
END

echo "export { ErrorMessage } from './error-message';" > src/shared/ui/error-message/index.js

# SectionTitle
cat > src/shared/ui/surface-title/surface-title.module.css << 'END'
.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin-bottom: 24px;
}
.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: var(--dark);
}
END

cat > src/shared/ui/surface-title/surface-title.jsx << 'END'
import styles from './surface-title.module.css';

export function SectionTitle({ children }) {
  return <h2 className={styles.title}>{children}</h2>;
}
END

echo "export { SectionTitle } from './surface-title';" > src/shared/ui/surface-title/index.js

# Modal
cat > src/shared/ui/modal/modal.module.css << 'END'
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.dialog {
  background: #fff;
  border-radius: var(--radius);
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide 0.25s ease;
}
@keyframes slide {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.title { font-size: 18px; font-weight: 700; }
.close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  color: var(--text-muted);
  transition: background 0.2s;
}
.close:hover { background: var(--bg-soft); }
.body { padding: 24px; }
END

cat > src/shared/ui/modal/modal.jsx << 'END'
import { useEffect } from 'react';
import styles from './modal.module.css';

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
END

echo "export { Modal } from './modal';" > src/shared/ui/modal/index.js

cat > src/shared/ui/index.js << 'END'
export { Button } from './button';
export { Container } from './container';
export { Loader } from './loader';
export { ErrorMessage } from './error-message';
export { SectionTitle } from './surface-title';
export { Modal } from './modal';
END

# ==========================================
# 7. ENTITIES
# ==========================================

# Product
cat > src/entities/product/product-card.module.css << 'END'
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06); }

.image { width: 100%; aspect-ratio: 1; object-fit: cover; background: var(--bg-soft); }

.body { padding: 28px 24px; display: flex; flex-direction: column; gap: 14px; }
.title { font-size: 22px; font-weight: 700; }
.description { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}
.actions { display: flex; gap: 8px; }
.price { font-size: 24px; font-weight: 700; }

.btnBuy {
  padding: 10px 20px;
  background: var(--dark);
  color: #fff;
  border-radius: var(--radius);
  font-size: 13px;
  transition: background 0.2s;
}
.btnBuy:hover { background: var(--dark-soft); }

.btnCart {
  padding: 10px 20px;
  border: 1px solid var(--dark);
  border-radius: var(--radius);
  font-size: 13px;
  transition: background 0.2s, color 0.2s;
}
.btnCart:hover { background: var(--dark); color: #fff; }
.btnCart:disabled { opacity: 0.5; cursor: not-allowed; }
END

cat > src/entities/product/product-card.jsx << 'END'
import { useAddToCart } from '@/shared/api';
import styles from './product-card.module.css';

export function ProductCard({ product }) {
  const { mutate: addToCart, isPending } = useAddToCart();

  return (
    <article className={styles.card}>
      <img className={styles.image} src={product.image} alt={product.title} />
      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.btnBuy}>Buy Now</button>
            <button
              className={styles.btnCart}
              onClick={() => addToCart({ productId: product.id, qty: 1 })}
              disabled={isPending}
            >
              {isPending ? '…' : 'Add To Cart'}
            </button>
          </div>
          <span className={styles.price}>${product.price}</span>
        </div>
      </div>
    </article>
  );
}
END

echo "export { ProductCard } from './product-card';" > src/entities/product/index.js

# Brand
cat > src/entities/brand/brand-item.module.css << 'END'
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  filter: grayscale(1);
  opacity: 0.6;
  transition: filter 0.25s, opacity 0.25s;
}
.item:hover { filter: grayscale(0); opacity: 1; }
.item img { max-height: 32px; width: auto; }
END

cat > src/entities/brand/brand-item.jsx << 'END'
import styles from './brand-item.module.css';

export function BrandItem({ brand }) {
  return (
    <div className={styles.item}>
      <img src={brand.logo} alt={brand.name} />
    </div>
  );
}
END

echo "export { BrandItem } from './brand-item';" > src/entities/brand/index.js

# Stat
cat > src/entities/stat/stat-item.module.css << 'END'
.item { text-align: center; }
.value {
  font-size: 48px;
  font-weight: 800;
  color: var(--text);
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.value::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--dark);
}
.label { font-size: 15px; color: var(--text-muted); }
END

cat > src/entities/stat/stat-item.jsx << 'END'
import styles from './stat-item.module.css';

export function StatItem({ stat }) {
  return (
    <div className={styles.item}>
      <div className={styles.value}>{stat.value}</div>
      <div className={styles.label}>{stat.label}</div>
    </div>
  );
}
END

echo "export { StatItem } from './stat-item';" > src/entities/stat/index.js

# Review
cat > src/entities/review/review-block.module.css << 'END'
.block {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  align-items: center;
}
.photo { width: 100%; aspect-ratio: 1; object-fit: cover; }
.title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.stars { color: #f4b400; font-size: 18px; letter-spacing: 3px; margin-bottom: 16px; }
.text { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-style: italic; }
.author { font-size: 16px; font-weight: 700; }
.role { font-size: 13px; color: var(--text-muted); }
.controls { display: flex; gap: 12px; margin-top: 24px; }
.ctrl {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--text);
  transition: background 0.2s, color 0.2s;
}
.ctrl:hover { background: var(--dark); color: #fff; border-color: var(--dark); }

@media (max-width: 900px) { .block { grid-template-columns: 1fr; } }
END

cat > src/entities/review/review-block.jsx << 'END'
import styles from './review-block.module.css';

export function ReviewBlock({ review }) {
  return (
    <div className={styles.block}>
      <img className={styles.photo} src={review.avatar} alt={review.author} />
      <div>
        <h3 className={styles.title}>{review.title}</h3>
        <div className={styles.stars}>{'★'.repeat(review.rating)}</div>
        <p className={styles.text}>“{review.text}”</p>
        <div className={styles.author}>{review.author}</div>
        <div className={styles.role}>{review.role}</div>
        <div className={styles.controls}>
          <button className={styles.ctrl}>‹</button>
          <button className={styles.ctrl}>›</button>
        </div>
      </div>
    </div>
  );
}
END

echo "export { ReviewBlock } from './review-block';" > src/entities/review/index.js

echo ""
echo "ЧАСТЬ 1 ГОТОВА"
