'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { SerializedProductRow } from '@/lib/serialize'

type Product = SerializedProductRow

export function ProductTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function toggleActive(id: string) {
    setLoading(id)
    await fetch(`/api/admin/products/${id}/toggle`, { method: 'PATCH' })
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
    setLoading(null)
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(id)
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts((ps) => ps.filter((p) => p.id !== id))
    setLoading(null)
    router.refresh()
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No products found.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-12" />
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Category</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground hidden sm:table-cell">Status</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                {p.images[0] ? (
                  <div className="relative h-9 w-9 rounded overflow-hidden bg-muted">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="36px" />
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded bg-muted" />
                )}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium leading-none">{p.name}</p>
                {p._count.variants > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{p._count.variants} variants</p>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.category.name}</td>
              <td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(p.price))}</td>
              <td className="px-4 py-3 text-center hidden sm:table-cell">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {p.active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => toggleActive(p.id)}
                    disabled={loading === p.id}
                    title={p.active ? 'Hide product' : 'Show product'}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {p.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(p.id, p.name)}
                    disabled={loading === p.id}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
