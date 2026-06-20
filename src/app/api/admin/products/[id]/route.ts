import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { adminApiRateLimit } from '@/lib/rate-limit'
import { deleteImage, extractPublicId } from '@/lib/cloudinary'

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  value: z.string().min(1),
  stock: z.number().int().min(0),
  priceDelta: z.number().min(0),
})

const updateSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().nullable().optional(),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean(),
  active: z.boolean(),
  variants: z.array(variantSchema).default([]),
})

function adminGuard(session: { user?: { role?: string } } | null) {
  return !session?.user || session.user.role !== 'ADMIN'
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (adminGuard(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true, variants: { orderBy: [{ name: 'asc' }, { value: 'asc' }] } },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await adminApiRateLimit(req)
  if (limited) return limited

  const session = await auth()
  if (adminGuard(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const { variants, ...data } = parsed.data

  // Delete variants not in the new list, create/update the rest
  const existingVariants = await db.productVariant.findMany({ where: { productId: id } })
  const incomingIds = variants.filter(v => v.id).map(v => v.id!)
  const toDelete = existingVariants.filter(v => !incomingIds.includes(v.id))

  await db.$transaction([
    ...toDelete.map(v => db.productVariant.delete({ where: { id: v.id } })),
    ...variants.map(v =>
      v.id
        ? db.productVariant.update({ where: { id: v.id }, data: { name: v.name, value: v.value, stock: v.stock, priceDelta: v.priceDelta } })
        : db.productVariant.create({ data: { ...v, productId: id } })
    ),
    db.product.update({
      where: { id },
      data: { ...data, comparePrice: data.comparePrice ?? null },
    }),
  ])

  const product = await db.product.findUnique({
    where: { id },
    include: { category: true, variants: true },
  })
  return NextResponse.json({ product })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (adminGuard(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const product = await db.product.findUnique({ where: { id }, select: { images: true } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Delete images from Cloudinary (best-effort, don't fail if it errors)
  await Promise.allSettled(
    product.images
      .filter(url => url.includes('cloudinary.com'))
      .map(url => deleteImage(extractPublicId(url)))
  )

  await db.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
