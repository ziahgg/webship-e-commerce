import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from './auth.config'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, name: true, email: true, password: true, role: true, image: true },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role as string, image: user.image }
      },
    }),
  ],
})
