import { formatCurrency } from '@/lib/utils'

interface TopProduct {
  productId: string
  name: string
  totalQty: number
  totalRevenue: number
}

export function TopProducts({ data }: { data: TopProduct[] }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">Top Products by Revenue</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sales yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left font-medium text-muted-foreground">Product</th>
              <th className="pb-2 text-right font-medium text-muted-foreground">Units</th>
              <th className="pb-2 text-right font-medium text-muted-foreground">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={p.productId} className="border-b last:border-0">
                <td className="py-2.5 pr-4">
                  <span className="text-muted-foreground mr-2">{i + 1}.</span>
                  {p.name}
                </td>
                <td className="py-2.5 text-right text-muted-foreground">{p.totalQty}</td>
                <td className="py-2.5 text-right font-medium">{formatCurrency(p.totalRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
