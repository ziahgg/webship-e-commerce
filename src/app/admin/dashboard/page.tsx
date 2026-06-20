import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/admin/dashboard/stats-cards'
import { SalesChart } from '@/components/admin/dashboard/sales-chart'
import { TopProducts } from '@/components/admin/dashboard/top-products'

async function fetchStats() {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const [totalOrders, totalProducts, totalCustomers, revenueAgg, recentOrders, topProducts] =
    await Promise.all([
      db.order.count(),
      db.product.count(),
      db.user.count({ where: { role: 'CUSTOMER' } }),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      }),
      db.order.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        select: { createdAt: true, total: true },
      }),
      db.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { price: 'desc' } },
        take: 5,
      }),
    ])

  const salesByDay: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    salesByDay[d.toISOString().slice(0, 10)] = 0
  }
  for (const o of recentOrders) {
    const day = o.createdAt.toISOString().slice(0, 10)
    if (salesByDay[day] !== undefined) {
      salesByDay[day] += Number(o.total)
    }
  }

  return {
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    totalOrders,
    totalProducts,
    totalCustomers,
    salesByDay: Object.entries(salesByDay).map(([date, revenue]) => ({ date, revenue })),
    topProducts: topProducts
      .filter((p) => p.productId != null)
      .map((p) => ({
        productId: p.productId as string,
        name: p.productName,
        totalQty: p._sum.quantity ?? 0,
        totalRevenue: Number(p._sum.price ?? 0),
      })),
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const stats = await fetchStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your store&apos;s performance</p>
      </div>

      <StatsCards data={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SalesChart data={stats.salesByDay} />
        <TopProducts data={stats.topProducts} />
      </div>
    </div>
  )
}
