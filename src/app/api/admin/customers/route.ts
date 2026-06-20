import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = 20

  const where = {
    role: 'CUSTOMER' as const,
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [customers, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
          select: { total: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.user.count({ where }),
  ])

  const data = customers.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    createdAt: c.createdAt,
    orderCount: c._count.orders,
    totalSpent: c.orders.reduce((s, o) => s + Number(o.total), 0),
  }))

  return NextResponse.json({ customers: data, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}
