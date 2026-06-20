import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const customer = await db.user.findUnique({
    where: { id, role: 'CUSTOMER' },
    select: {
      id: true, name: true, email: true, createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { select: { productName: true, quantity: true, price: true } } },
      },
    },
  })
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ customer })
}
