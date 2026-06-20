import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authRateLimit } from '@/lib/rate-limit'

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export async function POST(req: NextRequest) {
  const limited = await authRateLimit(req)
  if (limited) return limited

  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data', issues: parsed.error.issues }, { status: 400 })
  }

  const { name, email, password } = parsed.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: { name, email, password: hashed, role: 'CUSTOMER' },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}
