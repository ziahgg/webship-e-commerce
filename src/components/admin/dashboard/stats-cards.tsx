import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatsData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}

export function StatsCards({ data }: { data: StatsData }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        icon={DollarSign}
        description="All paid orders"
      />
      <StatCard
        title="Total Orders"
        value={data.totalOrders.toString()}
        icon={ShoppingCart}
        description="All time"
      />
      <StatCard
        title="Products"
        value={data.totalProducts.toString()}
        icon={Package}
        description="Active listings"
      />
      <StatCard
        title="Customers"
        value={data.totalCustomers.toString()}
        icon={Users}
        description="Registered accounts"
      />
    </div>
  )
}
