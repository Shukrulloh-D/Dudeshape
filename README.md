# Dudeshape — Cosmetic Store

A modern single-page e-commerce landing for a cosmetic brand. Built with React + Vite, styled with CSS Modules, and powered by a small Express backend.

![Dudeshape preview](./public/images/preview.png)

---

## ✨ Features

- **Hero slider** with 3 banners, previous / next arrows and counter
- **Product search** — search from the hero, results filter the catalog section
- **Product cards** with *Buy Now* and *Add To Cart* buttons
- **Shopping cart** — quantity +/-, remove item, clear cart, checkout
- **User authentication** — sign in / sign up with validation, session stored in localStorage
- **Reviews slider** with animated transitions between testimonials
- **Newsletter subscription** form
- **Brands strip** with grayscale → color hover
- **Side menu drawer** and **profile / cart modals**
- **Loading & error states** on every section (React Query)
- **Responsive** down to 320px width

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| UI | React 18, Vite |
| Routing | React Router |
| HTTP | Axios |
| Data fetching | TanStack React Query |
| Styling | CSS Modules + CSS variables |
| Backend | Node.js, Express, CORS |
| Storage | JSON file (`db.json`) as a fake database |

---

## 🚀 Quick Start

Clone the repo and start **two terminals**.

### Terminal 1 — backend

```bash
cd dudeshape-server
npm install
npm start

📁 Project Structure

dudeshape/                  # frontend
├── public/
│   └── images/             # static images
├── src/
│   ├── app/                # providers, global styles
│   ├── pages/home/         # home page + its sections
│   ├── widgets/            # header, footer, modals
│   ├── entities/           # product, brand, stat, review
│   ├── features/           # (empty) user interactions
│   └── shared/             # api, lib, ui kit
└── vite.config.js

dudeshape-server/           # backend
├── db.json                 # fake database
├── server.js               # express app
└── package.json

The frontend follows Feature-Sliced Design — code is split into layers, each layer can only import from layers below it.

🔌 API Endpoints

Method	Endpoint	Description
GET	/api/banners	Hero slides
GET	/api/brands	Client logos
GET	/api/products	Product list
GET	/api/products/:id	Single product
GET	/api/stats	Stats counters
GET	/api/reviews	Testimonials
GET	/api/beauty	Perfect-beauty image
GET	/api/cart	Current cart
POST	/api/cart	Add to cart
PATCH	/api/cart/:id	Update quantity
DELETE	/api/cart/:id	Remove item
DELETE	/api/cart	Clear cart
POST	/api/login	Fake login
POST	/api/register	Fake register
POST	/api/subscribe	Newsletter

🎨 Design Tokens

All colors and sizes live in src/app/styles/index.css:

:root {
  --dark: #1a1a1a;      /* main text */
  --accent: #e07a5f;    /* hover / accent */
  --text-muted: #6b7280;
  --bg-soft: #fdf8f5;
  --border: #e5e7eb;
}

Change these values → whole site updates.

📸 Images

All images live in public/images/. Required files:

logo.png            hero.png            beauty.png
reviewer.png
product-1.png       product-2.png
brand-airbnb.png    brand-hubspot.png   brand-google.png
brand-microsoft.png brand-walmart.png   brand-fedex.png
icon-user.png       icon-cart.png       icon-menu.png
icon-facebook.png   icon-twitter.png    icon-instagram.png

Replace them with your own — just keep the same file names.

🧠 How It Works

Data flow

component → useSection('products')
         → React Query caches the result
         → axios GET /api/products
         → Express reads db.json → returns JSON
         → component renders

Every section handles three states:

    loading → shows <Loader />

    error → shows <ErrorMessage />

    success → renders data

Cart

Cart lives on the server (db.json → cart array). React Query keeps it in sync.
When you add an item, useAddToCart invalidates the cart query, and the badge in the header updates instantly.

Auth

Login / register hit the fake /api/login and /api/register endpoints.
On success, the JWT-like token and user object are stored in localStorage via UserProvider.
On page reload, the user is restored from storage.

🔧 Available Scripts

Frontend (dudeshape/):

npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build

## Базовый код для человека, который клонирует проект

Создай `HOW-TO-RUN.md`:

```bash
nano HOW-TO-RUN.md

markdown

# How to Run This Project

## Before you start

Install:
- **Node.js 18+** — https://nodejs.org
- **Git** — https://git-scm.com

Check they work:
```bash
node -v
npm -v
git --version

If all three print a version number — you're good.
Step 1. Clone the repo
bash

git clone https://github.com/YOUR_USERNAME/dudeshape.git
cd dudeshape

You should see two folders inside: dudeshape/ and dudeshape-server/.
Step 2. Start the backend

Open a new terminal and run:
bash

cd dudeshape-server
npm install
npm start

Wait until you see:
text

Server started: http://localhost:3001

Leave this terminal open. Don't close it.

Verify it works — open in browser:
text

http://localhost:3001/api/products

You should see JSON. If yes, backend is fine.
Step 3. Start the frontend

Open a second terminal (in the project root) and run:
bash

cd dudeshape
npm install
npm run dev

Wait until you see:
text

  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/

Open http://localhost:5173 in your browser.
Step 4. Configure API URL (if needed)

By default the app talks to http://localhost:3001/api.

If your backend runs on a different port, create a .env file inside dudeshape/:
text

VITE_API_URL=http://localhost:3001/api

Then restart npm run dev — Vite reads .env only on start.
Common issues

"Failed to load" in the browser

    Check the backend terminal is still running

    Open http://localhost:3001/api/products — should return JSON

    Check DevTools → Console for errors

Port 3001 already in use
bash

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>

Port 5173 already in use
Vite will offer another port (5174, 5175…). Just use the one it prints.

"Cannot find module"
You forgot npm install in one of the two folders. Run it in both.

"Network Error"

    Backend not running → start it

    .env wrong → check the file

    CORS issue → verify app.use(cors()) in server.js

How to work with the code

Add a new section on the home page:

    Create folder dudeshape/src/pages/home/sections/my-section/

    Add three files:

        my-section.jsx

        my-section.module.css

        index.js with export { MySection } from './my-section';

    Import in dudeshape/src/pages/home/home-page.jsx

    Add <MySection /> inside <main>

Add a new API endpoint:

    Add data to dudeshape-server/db.json under a new key

    It's automatically available at /api/<key> — the Express route /api/:section handles all sections

    Fetch from frontend: useSection('<key>')

Change colors:

Open dudeshape/src/app/styles/index.css and edit :root variables.
Deploy

Backend on Render:

    Push dudeshape-server/ to GitHub

    Render → New Web Service → pick repo

    Build: npm install, Start: npm start

    Get URL like https://your-server.onrender.com

Frontend on Vercel:

    Push dudeshape/ to GitHub

    Vercel → Import Project → pick repo

    Add env variable VITE_API_URL=https://your-server.onrender.com/api

    Deploy

Done.
text


Запусти `bash readme.sh`.

---

## Что в итоге

1. **`logic.sh`** — вся новая логика (профиль, меню, улучшенная корзина, все кнопки работают)
2. **`readme.sh`** — красивый README.md для GitHub
3. **`HOW-TO-RUN.md`** — пошаговая инструкция для того, кто клонирует проект

**Порядок:**
1. Запусти `bash logic.sh`
2. Запусти `bash readme.sh`
3. Создай `HOW-TO-RUN.md` (команда выше, отдельно, потому что в одном скрипте будет длинно)
4. Проверь что всё работает: `npm start` в сервере, `npm run dev` в фронте
5. `git add . && git commit -m "feat: profile, menu drawer, cart controls" && git push`

**Проверь:**
- Клик на 👤 → модалка логина/регистрации → после входа показывается аватар с буквой
- Клик на ☰ → выезжает меню справа
- В корзине есть `−` `+` у каждого товара
- Checkout очищает корзину

Если что-то падает — скинь ошибку.

