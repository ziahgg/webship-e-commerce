'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Minus, Plus, ChevronLeft } from 'lucide-react'
import { formatCurrency, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import { ProductCard } from './product-card'

interface Variant { id: string; name: string; value: string; stock: number; priceDelta: number | string | { toNumber: () => number } }
interface Product {
  id: string; name: string; slug: string; description: string
  price: number | string | { toNumber: () => number }
  comparePrice: number | string | { toNumber: () => number } | null
  images: string[]; featured: boolean
  category: { name: string; slug: string }
  variants: Variant[]
}

function toNum(v: number | string | { toNumber: () => number } | null): number | null {
  if (v === null) return null
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseFloat(v)
  return v.toNumber()
}

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const basePrice = toNum(product.price)!
  const comparePrice = toNum(product.comparePrice)
  const discount = calculateDiscount(basePrice, comparePrice)
  const addItem = useCartStore((s) => s.addItem)

  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length === 1 ? product.variants[0] : null
  )
  const [qty, setQty] = useState(1)

  const variantGroups = product.variants.reduce<Record<string, Variant[]>>((acc, v) => {
    (acc[v.name] ??= []).push(v)
    return acc
  }, {})

  const currentPrice = selectedVariant
    ? basePrice + toNum(selectedVariant.priceDelta)!
    : basePrice

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a product variant first')
      return
    }
    const stock = selectedVariant ? selectedVariant.stock : 99
    addItem({
      id: product.id + (selectedVariant?.id ?? ''),
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? '',
      price: currentPrice,
      variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : null,
      stock,
    }, qty)
    toast.success('Added to cart!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
        <ChevronLeft className="h-4 w-4" />Back to Catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
            {product.images[activeImage] ? (
              <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No Image</div>
            )}
            {discount && <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive">-{discount}%</Badge>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative h-16 w-16 shrink-0 rounded-lg border-2 overflow-hidden transition-colors ${i === activeImage ? 'border-primary' : 'border-transparent'}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <Link href={`/products?category=${product.category.slug}`} className="text-sm text-muted-foreground hover:text-primary">
              {product.category.name}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCurrency(currentPrice)}</span>
            {comparePrice && comparePrice > basePrice && (
              <span className="text-lg text-muted-foreground line-through">{formatCurrency(comparePrice)}</span>
            )}
          </div>

          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName}>
              <p className="text-sm font-medium mb-2">
                {groupName}:{' '}
                {selectedVariant?.name === groupName && <span className="text-muted-foreground">{selectedVariant.value}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(selectedVariant?.id === v.id ? null : v)}
                    disabled={v.stock === 0}
                    className={`px-4 py-1.5 text-sm rounded-md border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-primary bg-primary/10 font-medium'
                        : v.stock === 0
                        ? 'border-muted text-muted-foreground line-through cursor-not-allowed'
                        : 'border-input hover:border-primary'
                    }`}
                  >
                    {v.value}
                    {toNum(v.priceDelta)! > 0 && ` (+${formatCurrency(toNum(v.priceDelta)!)})`}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <Button variant="outline" size="icon" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>

          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
