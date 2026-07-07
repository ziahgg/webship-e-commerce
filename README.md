# 🛍️ Webship — Full-Stack E-Commerce Platform

A production-ready e-commerce web application featuring a customer storefront and a role-protected admin dashboard, built on **Next.js 16 (App Router)** with **TypeScript**, **PostgreSQL/Prisma**, **NextAuth v5**, and **Stripe**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma) ![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)

---

## 📖 Overview

Webship is a complete online store built to demonstrate a modern, full-stack e-commerce workflow end to end — from product browsing and cart management to checkout, payment processing, and order fulfillment. It ships with two distinct experiences:

- A **customer storefront** for browsing products, managing a cart, checking out with Stripe, and tracking order history.
- An **admin dashboard** for managing products, orders, and customers, with sales statistics and image uploads.

Access control, payment handling, and data validation are all implemented server-side, making this a realistic reference for how a small-to-medium e-commerce platform is structured in production.

---

## ✨ Key Features

### Customer-Facing

- 🏠 Homepage with hero section and featured products
- 🔍 Product catalog with search, filtering, and category browsing
- 🛒 Persistent shopping cart (survives page reloads via `localStorage`)
- 💳 Secure checkout with Stripe Checkout Sessions
- 📦 Order history and order detail views
- 👤 Account management (profile, addresses)
- 🔐 Email/password authentication with protected routes

### Admin Dashboard

- 📊 Sales dashboard with revenue and order statistics
- 🗂️ Full product CRUD, including variants (size/color/stock) and image uploads
- 📑 Order management with status updates (Pending → Paid → Processing → Shipped → Delivered / Cancelled)
- 👥 Customer directory with order count and lifetime spend
- 🔒 Role-gated access — every admin route is protected at both the middleware and API layer

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + TypeScript |
| UI | React 19, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) |
| Database | PostgreSQL ([Neon](https://neon.tech), serverless) |
| ORM | Prisma 7 (dual adapter: `@prisma/adapter-neon` in production, `@prisma/adapter-pg` in development) |
| Authentication | NextAuth v5 (Credentials provider, JWT sessions, role-based access) |
| Payments | Stripe (Checkout Sessions + signed webhooks) |
| Image hosting | Cloudinary (SDK integrated; admin uploads currently stored under `public/uploads`) |
| Client state | Zustand (cart, persisted to `localStorage`) |
| Forms & validation | React Hook Form + Zod |
| Charts | Recharts (admin dashboard) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # /login, /register
│   ├── (store)/             # Customer storefront: /, /products, /cart, /checkout, /account...
│   ├── admin/                # Admin dashboard: /admin/dashboard, /products, /orders, /customers
│   └── api/
│       ├── admin/            # Admin CRUD endpoints (products, orders, customers, stats)
│       ├── auth/              # NextAuth handlers + registration
│       ├── checkout/          # Stripe checkout session creation
│       └── webhooks/stripe/  # Stripe webhook handler
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── admin/                 # Admin tables, forms, sidebar
│   └── store/                 # Storefront layout, product, cart, checkout components
├── lib/
│   ├── auth.ts / auth.config.ts  # NextAuth configuration & callbacks
│   ├── db.ts                     # Prisma client (Neon adapter)
│   ├── stripe.ts                 # Stripe client helpers
│   ├── cloudinary.ts             # Cloudinary upload utilities
│   └── rate-limit.ts             # In-memory rate limiter
├── store/cart.ts             # Zustand cart store
├── types/                    # Shared types & NextAuth type augmentation
└── proxy.ts                  # Route-protection middleware (Next.js 16 convention)

prisma/
├── schema.prisma             # Database schema
├── seed.ts                   # Seed script (demo accounts, categories, products)
└── migrations/

scripts/migrate-neon.mjs      # Neon-specific migration helper
```

> **Note:** This project uses `src/proxy.ts` instead of the conventional root-level `middleware.ts` — see [AGENTS.md](AGENTS.md) for Next.js 16 API changes relevant to this codebase.

---

## 🏗️ Architecture Overview

- **App Router with route groups** — `(auth)` and `(store)` group related routes without affecting the URL structure, keeping the customer and admin experiences cleanly separated.
- **Server-side data access** — Prisma queries run in Route Handlers and Server Components; no ORM calls are exposed to the client.
- **Dual Prisma adapter** — `@prisma/adapter-neon` is used in production for Neon's serverless driver, while `@prisma/adapter-pg` supports a standard local Postgres connection in development.
- **Stateless auth** — NextAuth issues JWT sessions, avoiding a server-side session store.
- **Event-driven order updates** — Stripe webhooks (not client callbacks) are the source of truth for payment status, with idempotent event handling.

---

## 🔐 Authentication

- **Provider:** Credentials (email + password) via NextAuth v5.
- **Session strategy:** JWT — `role` and `user.id` are embedded in the token and exposed via `session.user`.
- **Password storage:** Hashed with `bcryptjs` (12 salt rounds).
- **Route protection:** `src/proxy.ts` middleware enforces:
  - `/admin/**` → requires `role === "ADMIN"`
  - `/account`, `/checkout`, `/orders` → requires an authenticated session
  - All other routes remain public
- **Defense in depth:** every admin API route re-validates the session and role server-side, rather than relying on middleware alone.

---

## 🗄️ Database

PostgreSQL, managed with Prisma. Core models:

| Model | Purpose |
|---|---|
| `User` | Account, hashed password, role (`CUSTOMER` \| `ADMIN`) |
| `Category` | Product categories |
| `Product` | Product listing (price, images, featured/active flags) |
| `ProductVariant` | Variant options (e.g. size/color) with independent stock and price delta |
| `CartItem` | Persisted per-user cart line item |
| `Order` / `OrderItem` | Order records with shipping address, Stripe session/payment intent IDs, and line items |
| `Address` | Saved shipping addresses |
| `Wishlist` | Saved products per user |

**Enums:** `Role` (`CUSTOMER`, `ADMIN`), `OrderStatus` (`PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

---

## 🔌 API

All endpoints are implemented as Next.js Route Handlers under `src/app/api`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | `GET`/`POST` | NextAuth sign-in/sign-out handlers |
| `/api/auth/register` | `POST` | Customer registration (Zod-validated, rate-limited) |
| `/api/checkout` | `POST` | Creates a Stripe Checkout Session and pending order |
| `/api/webhooks/stripe` | `POST` | Verifies Stripe signature, applies order status updates idempotently |
| `/api/admin/products` | `GET`/`POST` | List (search/filter/paginate) and create products with variants |
| `/api/admin/products/[id]` | `GET`/`PUT`/`DELETE` | Fetch, update, or delete a product |
| `/api/admin/products/[id]/toggle` | `POST` | Toggle a product's active status |
| `/api/admin/upload` | `POST` | Uploads a product image (JPEG/PNG/WebP/GIF, max 5 MB) |
| `/api/admin/orders` | `GET` | List orders with status filter and pagination |
| `/api/admin/orders/[id]` | `GET`/`PUT` | Fetch or update an order |
| `/api/admin/orders/[id]/status` | `POST` | Update order status |
| `/api/admin/customers` | `GET` | List customers with search and pagination |
| `/api/admin/customers/[id]` | `GET` | Customer detail with order history |
| `/api/admin/stats` | `GET` | Dashboard statistics (revenue, order/product counts) |

All `/api/admin/**` routes require an authenticated `ADMIN` session and are rate-limited.

---

## 🛡️ Security

- **Input validation** — every mutating endpoint validates its payload with a Zod schema via `.safeParse()`.
- **Password hashing** — `bcryptjs` with 12 salt rounds; plaintext passwords are never persisted or logged.
- **Webhook signature verification** — `stripe.webhooks.constructEvent()` rejects unsigned or tampered payloads.
- **Idempotent webhook handling** — processed Stripe event IDs are tracked on the order to prevent duplicate processing.
- **Rate limiting** — in-memory, IP-based limiter (`src/lib/rate-limit.ts`) with per-route policies:

  | Route group | Limit |
  |---|---|
  | Auth (register/login) | 10 requests / 15 min |
  | Checkout | 5 requests / 60 sec |
  | Admin API | 30 requests / 60 sec |

- **Authorization in depth** — role checks happen both in middleware (`src/proxy.ts`) and again inside each admin handler, so a middleware bypass alone cannot grant access.

---

## ⚡ Performance

- **Server Components by default** — data-heavy pages (product catalog, admin tables) fetch on the server, reducing client-side JavaScript.
- **Serverless-friendly database access** — the Neon adapter uses HTTP/WebSocket-based connections suited to serverless deployment (e.g. Vercel), avoiding connection-pool exhaustion.
- **Client state kept minimal** — only the cart is persisted client-side (Zustand + `localStorage`); everything else is fetched fresh from the server.

---

## 🚀 Getting Started

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd website-ecommerce
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection string from [Neon](https://neon.tech) (Connect → pooler/WebSocket) |
| `DIRECT_URL` | Direct (non-pooled) connection string, required for Prisma migrations |
| `NEXTAUTH_URL` | Base URL of the app (`http://localhost:3000` locally) |
| `NEXTAUTH_SECRET` | Session signing secret — generate with `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (use `sk_test_...` locally) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...` locally) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret from `stripe listen` (see step 4 below) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name, exposed to the client |
| `NEXT_PUBLIC_APP_URL` | Public app URL, used for absolute links (e.g. emails, Stripe redirects) |

### 3. Set up the database

```bash
# Apply the Prisma schema to your database
npm run db:migrate

# Seed initial data (categories, sample products, demo accounts)
npm run db:seed
```

Demo accounts created by the seed script:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@store.com` | `admin123` |
| Customer | `customer@example.com` | `customer123` |

### 4. Set up the Stripe webhook (local development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `.env`.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add all environment variables from `.env` — set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.
4. Deploy.
5. Register the production webhook: **Stripe Dashboard → Developers → Webhooks → Add endpoint**, using `https://yourdomain.com/api/webhooks/stripe`, then copy the resulting signing secret into `STRIPE_WEBHOOK_SECRET` on Vercel.

---

## 📜 Scripts

```bash
npm run dev            # Start the development server
npm run build          # Build for production
npm run start           # Start the production server
npm run lint             # Run ESLint
npm run db:generate     # Generate the Prisma client
npm run db:migrate      # Run Prisma migrations (development)
npm run db:push         # Push schema changes without creating a migration
npm run db:seed         # Seed the database with initial data
npm run db:migrate:neon # Run the Neon-specific migration script
npm run db:studio       # Open Prisma Studio (database GUI)
npm run format           # Format the codebase with Prettier
```

---

## 🔭 Future Improvements

- Add automated tests (unit, integration, and end-to-end) — none are currently configured.
- Replace the in-memory rate limiter with a distributed store (e.g. Redis) for multi-instance deployments.
- Complete the Cloudinary integration for admin uploads (currently written to local disk under `public/uploads`).
- Add explicit CSRF protection for state-changing requests beyond framework defaults.
- Support additional auth providers (e.g. OAuth) alongside Credentials.

---

## 🤖 AI-Assisted Development

Portions of this project's scaffolding, documentation, and iterative development were completed with the assistance of AI coding tools. All generated code was reviewed, tested, and adapted to fit the project's architecture and requirements.

---

## 📄 License

No license file is currently included in this repository. All rights reserved unless a license is added.

---

## 👤 Author

**ziahgg**
GitHub: [@ziahgg](https://github.com/ziahgg)
