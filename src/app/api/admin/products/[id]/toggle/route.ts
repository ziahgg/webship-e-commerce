import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const product = await db.product.findUnique({ where: { id }, select: { active: true } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await db.product.update({
    where: { id },
    data: { active: !product.active },
    select: { id: true, active: true },
  })
  return NextResponse.json({ product: updated })
}
