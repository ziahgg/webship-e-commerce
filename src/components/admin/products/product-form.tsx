'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { ImageUpload } from './image-upload'
import { Trash2, Plus } from 'lucide-react'
import type { SerializedProductDetail } from '@/lib/serialize'

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name required'),
  value: z.string().min(1, 'Value required'),
  stock: z.coerce.number().int().min(0),
  priceDelta: z.coerce.number(),
})

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z.coerce.number().min(0).optional(),
  categoryId: z.string().min(1, 'Category required'),
  featured: z.boolean(),
  active: z.boolean(),
  images: z.array(z.string()).min(1, 'At least one image required'),
  variants: z.array(variantSchema),
})

type ProductFormData = z.infer<typeof productSchema>

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  initialData?: SerializedProductDetail
}

function emptyVariant() {
  return { name: 'Size', value: '', stock: 0, priceDelta: 0 }
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? 0,
    comparePrice: initialData?.comparePrice ?? undefined,
    categoryId: initialData?.categoryId ?? '',
    featured: initialData?.featured ?? false,
    active: initialData?.active ?? true,
    images: initialData?.images ?? [],
    variants: initialData?.variants?.map((v) => ({
      ...v,
      priceDelta: v.priceDelta ?? 0,
    })) ?? [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  function setField<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  function addVariant() {
    setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }))
  }

  function removeVariant(i: number) {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))
  }

  function updateVariant(i: number, patch: Partial<{ id: string; name: string; value: string; stock: number; priceDelta: number }>) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')

    const parsed = productSchema.safeParse(form)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.')
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/admin/products/${initialData!.id}` : '/api/admin/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        const data = await res.json()
        setServerError(data.error ?? 'Save failed')
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setServerError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {serverError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Name */}
      <Field label="Product Name" error={errors.name}>
        <input
          className="input-base"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="e.g. Premium Plain T-Shirt"
        />
      </Field>

      {/* Description */}
      <Field label="Description" error={errors.description}>
        <textarea
          className="input-base min-h-[100px] resize-y"
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Describe the product..."
        />
      </Field>

      {/* Price + Compare */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (USD)" error={errors.price}>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-base"
            value={form.price || ''}
            onChange={(e) => setField('price', parseFloat(e.target.value) || 0)}
          />
        </Field>
        <Field label="Compare Price (optional)" error={errors.comparePrice}>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-base"
            value={form.comparePrice ?? ''}
            onChange={(e) => {
              const v = e.target.value ? parseFloat(e.target.value) : undefined
              setField('comparePrice', v)
            }}
            placeholder="Strike-through price"
          />
        </Field>
      </div>

      {/* Category */}
      <Field label="Category" error={errors.categoryId}>
        <select
          className="input-base"
          value={form.categoryId}
          onChange={(e) => setField('categoryId', e.target.value)}
        >
          <option value="">Select category...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      {/* Images */}
      <Field label="Images" error={errors.images}>
        <ImageUpload images={form.images} onChange={(imgs) => setField('images', imgs)} />
      </Field>

      {/* Flags */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setField('featured', e.target.checked)}
            className="h-4 w-4 rounded border"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setField('active', e.target.checked)}
            className="h-4 w-4 rounded border"
          />
          Active (visible in store)
        </label>
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Variants</label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add variant
          </button>
        </div>
        {form.variants.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">No variants — product has a single price &amp; stock.</p>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_80px_90px_32px] gap-2 text-xs font-medium text-muted-foreground px-1">
              <span>Option name</span>
              <span>Value</span>
              <span>Stock</span>
              <span>+Price</span>
              <span />
            </div>
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_90px_32px] gap-2 items-center">
                <input
                  className="input-base text-sm"
                  value={v.name}
                  onChange={(e) => updateVariant(i, { name: e.target.value })}
                  placeholder="Size"
                />
                <input
                  className="input-base text-sm"
                  value={v.value}
                  onChange={(e) => updateVariant(i, { value: e.target.value })}
                  placeholder="XL"
                />
                <input
                  type="number"
                  min="0"
                  className="input-base text-sm"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value) || 0 })}
                />
                <input
                  type="number"
                  step="0.01"
                  className="input-base text-sm"
                  value={v.priceDelta}
                  onChange={(e) => updateVariant(i, { priceDelta: parseFloat(e.target.value) || 0 })}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-5 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
