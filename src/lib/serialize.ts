/**
 * Centralized Prisma Decimal → number converters for RSC → Client Component boundaries.
 *
 * WHY: Prisma Decimal is a class instance. React's RSC serialization protocol rejects
 * class instances passed as props to 'use client' components. These helpers convert
 * every Decimal field to a plain number and explicitly pick only the fields each
 * component needs — no spread that could accidentally carry hidden Decimal fields.
 */

type DecimalLike = { toNumber: () => number } | string | number

function d(v: DecimalLike): number
function d(v: DecimalLike | null | undefined): number | null
function d(v: DecimalLike | null | undefined): number | null {
  if (v == null) return null
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseFloat(v)
  return v.toNumber()
}

// ─── Product ────────────────────────────────────────────────────────────────

export type SerializedProductRow = {
  id: string
  name: string
  images: string[]
  price: number
  active: boolean
  featured: boolean
  category: { name: string }
  _count: { variants: number }
}

/** For ProductTable (list view). Picks only the fields the component uses. */
export function serializeProductRow(p: {
  id: string
  name: string
  images: string[]
  price: DecimalLike
  active: boolean
  featured: boolean
  category: { name: string }
  _count: { variants: number }
}): SerializedProductRow {
  return {
    id: p.id,
    name: p.name,
    images: p.images,
    price: d(p.price) as number,
    active: p.active,
    featured: p.featured,
    category: p.category,
    _count: p._count,
  }
}

export type SerializedProductDetail = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  images: string[]
  featured: boolean
  active: boolean
  categoryId: string
  variants: SerializedVariant[]
}

export type SerializedVariant = {
  id: string
  name: string
  value: string
  stock: number
  priceDelta: number
}

/** For ProductForm (edit view). */
export function serializeProductDetail(p: {
  id: string
  name: string
  slug: string
  description: string
  price: DecimalLike
  comparePrice: DecimalLike | null | undefined
  images: string[]
  featured: boolean
  active: boolean
  categoryId: string
  variants: Array<{
    id: string
    name: string
    value: string
    stock: number
    priceDelta: DecimalLike
  }>
}): SerializedProductDetail {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: d(p.price) as number,
    comparePrice: p.comparePrice != null ? (d(p.comparePrice) as number) : null,
    images: p.images,
    featured: p.featured,
    active: p.active,
    categoryId: p.categoryId,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      value: v.value,
      stock: v.stock,
      priceDelta: d(v.priceDelta) as number,
    })),
  }
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type SerializedOrderRow = {
  id: string
  status: string
  total: number
  createdAt: Date
  user: { name: string | null; email: string }
  _count: { items: number }
}

/** For OrderTable (list view). */
export function serializeOrderRow(o: {
  id: string
  status: string
  total: DecimalLike
  createdAt: Date
  user: { name: string | null; email: string }
  _count: { items: number }
}): SerializedOrderRow {
  return {
    id: o.id,
    status: o.status,
    total: d(o.total) as number,
    createdAt: o.createdAt,
    user: o.user,
    _count: o._count,
  }
}
