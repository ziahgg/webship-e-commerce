import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (order matters for FK constraints)
  await db.wishlist.deleteMany()
  await db.cartItem.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.productVariant.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.address.deleteMany()
  await db.user.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 12)
  const customerPassword = await bcrypt.hash('customer123', 12)

  await db.user.create({
    data: { name: 'Admin', email: 'admin@store.com', password: adminPassword, role: 'ADMIN' },
  })

  await db.user.create({
    data: { name: 'John Doe', email: 'customer@example.com', password: customerPassword, role: 'CUSTOMER' },
  })

  const [clothing, electronics, accessories] = await Promise.all([
    db.category.create({
      data: { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400' },
    }),
    db.category.create({
      data: { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    }),
    db.category.create({
      data: { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400' },
    }),
  ])

  const products = [
    {
      name: 'Premium Plain T-Shirt',
      slug: 'premium-plain-tshirt',
      description: 'High-quality plain t-shirt made from soft 100% combed cotton. Available in multiple colors, perfect for everyday wear.',
      price: 15.99,
      comparePrice: 24.99,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
      ],
      featured: true,
      categoryId: clothing.id,
      variants: [
        { name: 'Size', value: 'S', stock: 20, priceDelta: 0 },
        { name: 'Size', value: 'M', stock: 30, priceDelta: 0 },
        { name: 'Size', value: 'L', stock: 25, priceDelta: 0 },
        { name: 'Size', value: 'XL', stock: 15, priceDelta: 2.00 },
      ],
    },
    {
      name: 'Flannel Plaid Shirt',
      slug: 'flannel-plaid-shirt',
      description: 'Classic flannel plaid shirt with a warm, soft feel. Versatile enough for casual outings or semi-formal occasions.',
      price: 34.99,
      comparePrice: 49.99,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
      ],
      featured: true,
      categoryId: clothing.id,
      variants: [
        { name: 'Size', value: 'S', stock: 10, priceDelta: 0 },
        { name: 'Size', value: 'M', stock: 15, priceDelta: 0 },
        { name: 'Size', value: 'L', stock: 12, priceDelta: 0 },
        { name: 'Size', value: 'XL', stock: 8, priceDelta: 3.00 },
      ],
    },
    {
      name: 'Wireless Earbuds Pro',
      slug: 'wireless-earbuds-pro',
      description: 'Crystal-clear wireless earbuds with active noise cancellation and up to 8 hours of battery life on a single charge.',
      price: 49.99,
      comparePrice: 79.99,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
      ],
      featured: true,
      categoryId: electronics.id,
      variants: [
        { name: 'Color', value: 'Black', stock: 20, priceDelta: 0 },
        { name: 'Color', value: 'White', stock: 15, priceDelta: 0 },
      ],
    },
    {
      name: 'Sporty Smart Watch',
      slug: 'sporty-smart-watch',
      description: 'Feature-packed smartwatch with heart rate monitoring, built-in GPS, water resistance, and a 1.4" AMOLED display.',
      price: 89.99,
      comparePrice: null,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      ],
      featured: true,
      categoryId: electronics.id,
      variants: [
        { name: 'Color', value: 'Black', stock: 10, priceDelta: 0 },
        { name: 'Color', value: 'Silver', stock: 8, priceDelta: 0 },
      ],
    },
    {
      name: 'Canvas Shoulder Bag',
      slug: 'canvas-shoulder-bag',
      description: 'Durable premium canvas shoulder bag with a minimalist design. Spacious enough for daily essentials, stylish for any occasion.',
      price: 24.99,
      comparePrice: 39.99,
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
      ],
      featured: false,
      categoryId: accessories.id,
      variants: [],
    },
    {
      name: 'Classic Baseball Cap',
      slug: 'classic-baseball-cap',
      description: 'Premium embroidered baseball cap made from quality cotton with an adjustable strap for the perfect fit.',
      price: 14.99,
      comparePrice: null,
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
      ],
      featured: false,
      categoryId: accessories.id,
      variants: [
        { name: 'Color', value: 'Black', stock: 25, priceDelta: 0 },
        { name: 'Color', value: 'Navy', stock: 20, priceDelta: 0 },
        { name: 'Color', value: 'White', stock: 18, priceDelta: 0 },
      ],
    },
  ]

  for (const { variants, ...data } of products) {
    await db.product.create({
      data: {
        ...data,
        price: data.price,
        comparePrice: data.comparePrice ?? undefined,
        variants: { create: variants },
      },
    })
  }

  console.log('✅ Seeded: 1 admin, 1 customer, 3 categories, 6 products')
  console.log('📧 Admin:    admin@store.com / admin123')
  console.log('📧 Customer: customer@example.com / customer123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
