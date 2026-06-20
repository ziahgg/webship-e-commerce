import type { Metadata } from 'next'
import { RegisterForm } from './register-form'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="Webship" width={130} height={34} priority />
          </Link>
          <h1 className="text-xl font-semibold mt-3">Create an Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
