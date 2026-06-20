import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import { adminApiRateLimit } from '@/lib/rate-limit'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  const limited = await adminApiRateLimit(req)
  if (limited) return limited

  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 5 MB.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadImage(buffer)
  return NextResponse.json({ url })
}
