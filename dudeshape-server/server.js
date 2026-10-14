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
