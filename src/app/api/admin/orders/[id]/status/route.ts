import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const VALID_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const

const schema = z.object({
  status: z.enum(VALID_STATUSES),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const order = await db.order.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  })
  return NextResponse.json({ order })
}
