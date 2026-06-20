import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const path = request.nextUrl.pathname

      if (path.startsWith('/admin')) return isLoggedIn && auth?.user?.role === 'ADMIN'
      if (path.startsWith('/account') || path.startsWith('/checkout') || path.startsWith('/orders')) return isLoggedIn
      return true
    },
  },
  providers: [],
}
