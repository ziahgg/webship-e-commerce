import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Customer {
  id: string
  name: string | null
  email: string
  createdAt: Date | string
  orderCount: number
  totalSpent: number
}

export function CustomerTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        No customers found.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Orders</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total Spent</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden md:table-cell">Joined</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">View</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium leading-none">{c.name ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.email}</p>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{c.orderCount}</td>
              <td className="px-4 py-3 text-right font-medium">{formatCurrency(c.totalSpent)}</td>
              <td className="px-4 py-3 text-right text-muted-foreground text-xs hidden md:table-cell">
                {formatDate(new Date(c.createdAt))}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/customers/${c.id}`} className="text-xs text-primary hover:underline">
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
