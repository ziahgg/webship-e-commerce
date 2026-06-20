# Toko Online — E-Commerce Website

Website e-commerce lengkap dengan storefront customer dan admin dashboard.

## Tech Stack

- **Framework:** Next.js 16 (App Router + TypeScript)
- **Database:** PostgreSQL via [Neon](https://neon.tech) + Prisma ORM
- **Auth:** NextAuth v5 (role-based: CUSTOMER / ADMIN)
- **Payment:** Stripe (Checkout Sessions + Webhooks)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Gambar:** Cloudinary
- **State:** Zustand (cart, persisted ke localStorage)

---

## Cara Install & Jalankan Lokal

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd website-ecommerce
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Isi nilai di `.env`:

| Variable | Cara Mendapatkan |
|---|---|
| `DATABASE_URL` | Buat project di [neon.tech](https://neon.tech), copy connection string |
| `NEXTAUTH_SECRET` | Jalankan: `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Secret key (pakai `sk_test_` dulu) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Publishable key (`pk_test_`) |
| `STRIPE_WEBHOOK_SECRET` | Lihat bagian Stripe Webhook di bawah |
| `CLOUDINARY_*` | [Cloudinary Dashboard](https://cloudinary.com/console) → API Keys |

### 3. Setup Database

```bash
# Migrate schema ke database
npm run db:migrate

# Isi data awal (kategori, produk contoh, admin user)
npm run db:seed
```

Akun default setelah seed:
- **Admin:** `admin@toko.com` / `admin123`
- **Customer:** `customer@example.com` / `customer123`

### 4. Setup Stripe Webhook (lokal)

Install [Stripe CLI](https://stripe.com/docs/stripe-cli), lalu:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy `whsec_...` yang muncul ke `STRIPE_WEBHOOK_SECRET` di `.env`.

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Halaman

| URL | Deskripsi |
|---|---|
| `/` | Homepage (hero, produk unggulan) |
| `/products` | Katalog dengan filter & search |
| `/products/[slug]` | Detail produk |
| `/cart` | Keranjang belanja |
| `/checkout` | Checkout (alamat + pembayaran Stripe) |
| `/account` | Profil & riwayat pesanan customer |
| `/login` / `/register` | Auth customer |
| `/admin/dashboard` | Dashboard statistik penjualan |
| `/admin/products` | CRUD produk + upload gambar |
| `/admin/orders` | Manajemen pesanan |
| `/admin/customers` | Daftar customer |

---

## Cara Deploy ke Vercel

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import project
3. Isi semua environment variables (sama seperti `.env` tapi `NEXTAUTH_URL` diisi URL Vercel)
4. Deploy!
5. Setup Stripe webhook production: Stripe Dashboard → Developers → Webhooks → Add endpoint → URL: `https://yourdomain.com/api/webhooks/stripe`

## Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run db:migrate   # Jalankan database migration
npm run db:seed      # Seed data awal
npm run db:studio    # Buka Prisma Studio (GUI database)
npm run format       # Format kode dengan Prettier
```
