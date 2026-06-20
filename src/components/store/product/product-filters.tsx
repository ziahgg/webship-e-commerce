'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { Category } from '@/generated/prisma/client'
import { X } from 'lucide-react'

interface Props { categories: Category[] }

const PRICE_RANGES = [
  { label: 'Under $15', min: '', max: '15' },
  { label: '$15 – $35', min: '15', max: '35' },
  { label: '$35 – $75', min: '35', max: '75' },
  { label: 'Over $75', min: '75', max: '' },
]

export function ProductFilters({ categories }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    router.push(`/products?${next}`)
  }

  const currentCategory = params.get('category') ?? ''
  const currentMin = params.get('minPrice') ?? ''
  const currentMax = params.get('maxPrice') ?? ''
  const hasFilters = !!(currentCategory || currentMin || currentMax)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => router.push('/products')}>
            <X className="h-3 w-3" />Reset
          </Button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={currentCategory === cat.slug}
                onCheckedChange={() => setParam('category', currentCategory === cat.slug ? null : cat.slug)}
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Price</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => {
            const active = currentMin === r.min && currentMax === r.max
            return (
              <label key={r.label} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={active}
                  onCheckedChange={() => {
                    if (active) {
                      setParam('minPrice', null); setParam('maxPrice', null)
                    } else {
                      const next = new URLSearchParams(params.toString())
                      if (r.min) next.set('minPrice', r.min); else next.delete('minPrice')
                      if (r.max) next.set('maxPrice', r.max); else next.delete('maxPrice')
                      next.delete('page')
                      router.push(`/products?${next}`)
                    }
                  }}
                />
                <span className="text-sm">{r.label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
