'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, Menu, X, Package, User, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useState, useEffect, useRef } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
]

export function Navbar() {
  const { data: session } = useSession()
  const totalItems = useCartStore((s) => s.totalItems())
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--g-cream)',
          borderBottom: scrolled ? '1px solid var(--g-cream-border)' : '1px solid transparent',
          transition: 'border-color 0.2s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ flexShrink: 0, lineHeight: 0 }}>
            <Image src="/logo.png" alt="Webship" width={100} height={26} priority />
          </Link>

          {/* Desktop nav links */}
          <nav style={{ alignItems: 'center', gap: 36 }} className="hidden md:flex">
            {navLinks.map((l) => {
              const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontSize: 15,
                    color: isActive ? 'var(--g-red)' : 'var(--g-ink)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'color 0.15s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-red)')}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive ? 'var(--g-red)' : 'var(--g-ink)')}
                >
                  {l.label}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      right: 0,
                      height: 1.5,
                      backgroundColor: 'var(--g-red)',
                      borderRadius: 2,
                    }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 20 }}>
            {/* Cart */}
            <Link href="/cart" style={{ position: 'relative', lineHeight: 0, color: 'var(--g-ink)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-red)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--g-ink)')}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  height: 16, minWidth: 16, padding: '0 3px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  backgroundColor: 'var(--g-red)', color: '#fff',
                  borderRadius: 99,
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session?.user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 15, color: 'var(--g-ink)', background: 'none',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-red)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--g-ink)')}
                >
                  {session.user.name?.split(' ')[0] ?? 'Account'}
                  <ChevronDown size={14} style={{ transition: 'transform 0.15s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                    backgroundColor: 'var(--g-white)',
                    border: '1px solid var(--g-cream-border)',
                    borderRadius: 10, overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                    minWidth: 180, zIndex: 100,
                  }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--g-cream-border)' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--g-ink)', margin: 0 }}>{session.user.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--g-ink-soft)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.user.email}
                      </p>
                    </div>
                    {[
                      ...(session.user.role === 'ADMIN' ? [{ href: '/admin/dashboard', label: 'Admin Dashboard', icon: null }] : []),
                      { href: '/account', label: 'My Account', icon: <User size={14} /> },
                      { href: '/account/orders', label: 'My Orders', icon: <Package size={14} /> },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 14px', fontSize: 14, color: 'var(--g-ink)',
                          textDecoration: 'none', transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-cream)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--g-cream-border)' }}>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '9px 14px', fontSize: 14, color: 'var(--g-red)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-cream)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Link
                  href="/login"
                  style={{ fontSize: 15, color: 'var(--g-ink)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--g-red)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--g-ink)')}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '9px 20px',
                    backgroundColor: 'var(--g-red)',
                    color: '#fff',
                    fontSize: 14, fontWeight: 500,
                    borderRadius: 100,
                    textDecoration: 'none',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--g-red-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--g-red)')}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right: cart + hamburger */}
          <div className="flex md:hidden" style={{ alignItems: 'center', gap: 16 }}>
            <Link href="/cart" style={{ position: 'relative', lineHeight: 0, color: 'var(--g-ink)' }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  height: 16, minWidth: 16, padding: '0 3px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  backgroundColor: 'var(--g-red)', color: '#fff',
                  borderRadius: 99,
                }}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(v => !v)}
              style={{ lineHeight: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--g-ink)', padding: 4 }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)' }}
          />
          {/* Panel */}
          <div style={{
            position: 'absolute',
            top: 64, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--g-cream)',
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            <nav style={{ padding: '16px 24px 0', flexGrow: 1 }}>
              {navLinks.map((l) => {
                const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{
                      display: 'block',
                      fontSize: 28, fontWeight: 500, lineHeight: 1.2,
                      color: isActive ? 'var(--g-red)' : 'var(--g-ink)',
                      textDecoration: 'none',
                      padding: '14px 0',
                      borderBottom: '1px solid var(--g-cream-border)',
                      transition: 'color 0.15s',
                    }}
                  >
                    {l.label}
                  </Link>
                )
              })}
            </nav>

            <div style={{ padding: '24px', borderTop: '1px solid var(--g-cream-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {session?.user ? (
                <>
                  <Link href="/account" style={{ fontSize: 16, color: 'var(--g-ink)', textDecoration: 'none' }}>My Account</Link>
                  <Link href="/account/orders" style={{ fontSize: 16, color: 'var(--g-ink)', textDecoration: 'none' }}>My Orders</Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{ textAlign: 'left', fontSize: 16, color: 'var(--g-red)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ fontSize: 16, color: 'var(--g-ink)', textDecoration: 'none' }}>Log In</Link>
                  <Link
                    href="/register"
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: '12px 24px', borderRadius: 100,
                      backgroundColor: 'var(--g-red)', color: '#fff',
                      fontSize: 15, fontWeight: 500, textDecoration: 'none',
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
