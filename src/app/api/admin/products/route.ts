import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { adminApiRateLimit } from '@/lib/rate-limit'
import { slugify } from '@/lib/utils'

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  stock: z.number().int().min(0),
  priceDelta: z.number().min(0),
})

const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().nullable().optional(),
  categoryId: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  variants: z.array(variantSchema).default([]),
})

function adminGuard(session: { user?: { role?: string } } | null) {
  return !session?.user || session.user.role !== 'ADMIN'
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (adminGuard(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const categoryId = searchParams.get('categoryId') ?? ''
  const status = searchParams.get('status') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = 20

  const where = {
    ...(q && { name: { contains: q, mode: 'insensitive' as const } }),
    ...(categoryId && { categoryId }),
    ...(status === 'active' && { active: true }),
    ...(status === 'inactive' && { active: false }),
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        variants: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}

export async function POST(req: NextRequest) {
  const limited = await adminApiRateLimit(req)
  if (limited) return limited

  const session = await auth()
  if (adminGuard(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const { variants, ...data } = parsed.data
  const slug = slugify(data.name)

  // Ensure unique slug
  const existing = await db.product.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const product = await db.product.create({
    data: {
      ...data,
      slug: finalSlug,
      comparePrice: data.comparePrice ?? undefined,
      variants: { create: variants },
    },
    include: { category: true, variants: true },
  })

  return NextResponse.json({ product }, { status: 201 })
}
