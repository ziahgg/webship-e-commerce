'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { formatCurrency, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  price: number | string | { toNumber: () => number }
  comparePrice: number | string | { toNumber: () => number } | null
  images: string[]
  featured?: boolean
  category: { name: string; slug: string }
}

function toNum(v: number | string | { toNumber: () => number } | null): number | null {
  if (v === null) return null
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseFloat(v)
  return v.toNumber()
}

export function ProductCard({ product }: { product: Product }) {
  const price = toNum(product.price)!
  const comparePrice = toNum(product.comparePrice)
  const discount = calculateDiscount(price, comparePrice)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? '',
      price,
      stock: 99,
    })
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="border rounded-xl overflow-hidden bg-background hover:shadow-md transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {discount && (
            <Badge className="absolute top-2 left-2 bg-destructive hover:bg-destructive">
              -{discount}%
            </Badge>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm">{formatCurrency(price)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-xs text-muted-foreground line-through">{formatCurrency(comparePrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs gap-1.5"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}
