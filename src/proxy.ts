import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user
  const role = session?.user?.role

  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')
  const isProtectedRoute =
    nextUrl.pathname.startsWith('/account') || nextUrl.pathname.startsWith('/checkout')

  if (isAdminRoute && (!isLoggedIn || role !== 'ADMIN')) {
    return NextResponse.redirect(
      new URL(isLoggedIn ? '/' : `/login?callbackUrl=${nextUrl.pathname}`, nextUrl)
    )
  }
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
