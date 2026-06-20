import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const perPage = 20

  const where = status ? { status: status as 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' } : {}

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { select: { productName: true, quantity: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.order.count({ where }),
  ])

  return NextResponse.json({ orders, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}
