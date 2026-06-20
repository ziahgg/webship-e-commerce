import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from './login-form'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="Webship" width={130} height={34} priority />
          </Link>
          <h1 className="text-xl font-semibold mt-3">Sign In to Your Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
