import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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

  // Group recent orders by day
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

  return NextResponse.json({
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    totalOrders,
    totalProducts,
    totalCustomers,
    salesByDay: Object.entries(salesByDay).map(([date, revenue]) => ({ date, revenue })),
    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      name: p.productName,
      totalQty: p._sum.quantity ?? 0,
      totalRevenue: Number(p._sum.price ?? 0),
    })),
  })
}
