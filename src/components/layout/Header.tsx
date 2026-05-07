'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { ShoppingBag, User, Menu, X, ChevronDown, LogOut, Settings } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes somos', href: '/quienes-somos' },
  {
    label: 'Nuestros servicios',
    href: '/servicios',
    children: [
      { label: 'Servicios & Terapias', href: '/servicios' },
      { label: 'Clases grupales', href: '/clases' },
      { label: 'Asesoramiento natural', href: '/asesoramiento' },
    ],
  },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Contacto', href: '/contacto' },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const totalItems = useCartStore((s) => s.totalItems)
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const cartCount = totalItems()
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)
  const closeMenus = () => {
    setMobileOpen(false)
    setServicesOpen(false)
    setUserMenuOpen(false)
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[oklch(0.979_0.004_90/0.95)] backdrop-blur-md border-b border-[oklch(0.656_0.016_78/0.15)] shadow-[0_1px_20px_oklch(0.21_0_0/0.05)]'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0" aria-label="Serlab Natura — inicio" onClick={closeMenus}>
              <Image
                src="/logo-serlab-natura.webp"
                alt="Serlab Natura"
                width={1674}
                height={515}
                className="h-10 lg:h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.href} ref={servicesRef} className="relative">
                    <button
                      onClick={() => setServicesOpen((v) => !v)}
                      className={[
                        'flex items-center gap-1 px-3 py-2 text-sm tracking-wide transition-colors duration-200',
                        isActive(link.href)
                          ? 'text-[oklch(0.668_0.063_64)]'
                          : 'text-[oklch(0.21_0_0)] hover:text-[oklch(0.668_0.063_64)]',
                      ].join(' ')}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-[oklch(0.979_0.004_90)] border border-[oklch(0.656_0.016_78/0.15)] shadow-lg animate-slide-down">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeMenus}
                            className="block px-5 py-3 text-sm text-[oklch(0.21_0_0)] hover:bg-[oklch(0.962_0.005_90)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150 border-b border-[oklch(0.656_0.016_78/0.1)] last:border-0"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className={[
                      'px-3 py-2 text-sm tracking-wide link-underline transition-colors duration-200',
                      isActive(link.href)
                        ? 'text-[oklch(0.668_0.063_64)] link-underline-cobre'
                        : 'text-[oklch(0.21_0_0)] hover:text-[oklch(0.668_0.063_64)] link-underline-cobre',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Cart */}
              <Link
                href="/carrito"
                onClick={closeMenus}
                className="relative flex items-center justify-center w-10 h-10 text-[oklch(0.21_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-200"
                aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} artículos` : ''}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[oklch(0.668_0.063_64)] text-[oklch(0.979_0.004_90)] text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User account */}
              {isAuthenticated && user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center justify-center w-10 h-10 text-[oklch(0.21_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-200"
                    aria-label="Mi cuenta"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-[oklch(0.979_0.004_90)] border border-[oklch(0.656_0.016_78/0.15)] shadow-lg animate-slide-down">
                      <div className="px-5 py-3 border-b border-[oklch(0.656_0.016_78/0.1)]">
                        <p className="text-xs text-[oklch(0.656_0.016_78)]">Conectado como</p>
                        <p className="text-sm font-medium text-[oklch(0.21_0_0)] truncate">{user.firstName} {user.lastName}</p>
                      </div>
                      <Link href="/cuenta" onClick={closeMenus} className="flex items-center gap-2 px-5 py-3 text-sm text-[oklch(0.21_0_0)] hover:bg-[oklch(0.962_0.005_90)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150">
                        <Settings className="w-4 h-4" /> Mi cuenta
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" onClick={closeMenus} className="flex items-center gap-2 px-5 py-3 text-sm text-[oklch(0.21_0_0)] hover:bg-[oklch(0.962_0.005_90)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150">
                          <Settings className="w-4 h-4" /> Panel admin
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-5 py-3 text-sm text-left text-[oklch(0.21_0_0)] hover:bg-[oklch(0.962_0.005_90)] hover:text-red-600 transition-colors duration-150 border-t border-[oklch(0.656_0.016_78/0.1)]"
                      >
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={closeMenus}
                  className="hidden lg:flex items-center gap-1.5 ml-1 px-4 py-2 text-xs tracking-[0.1em] uppercase font-medium border border-[oklch(0.21_0_0)] text-[oklch(0.21_0_0)] hover:bg-[oklch(0.21_0_0)] hover:text-[oklch(0.979_0.004_90)] transition-all duration-300"
                >
                  Acceder
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 text-[oklch(0.21_0_0)]"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-[oklch(0.21_0_0/0.4)]"
            onClick={closeMenus}
          />
          <nav
            className="absolute top-16 left-0 right-0 bg-[oklch(0.979_0.004_90)] border-b border-[oklch(0.656_0.016_78/0.2)] px-6 pt-4 pb-8 animate-slide-down"
            aria-label="Menú móvil"
          >
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenus}
                  className={[
                    'block py-3.5 text-base border-b border-[oklch(0.656_0.016_78/0.1)] last:border-0 transition-colors duration-150',
                    isActive(link.href)
                      ? 'text-[oklch(0.668_0.063_64)]'
                      : 'text-[oklch(0.21_0_0)]',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
                {link.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={closeMenus}
                    className="block pl-4 py-2.5 text-sm text-[oklch(0.656_0.016_78)] border-b border-[oklch(0.656_0.016_78/0.08)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150"
                  >
                    — {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-6 flex flex-col gap-3">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-full py-3 text-center text-sm border border-[oklch(0.21_0_0/0.3)] text-[oklch(0.21_0_0)]"
                >
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={closeMenus}
                    className="block py-3 text-center text-sm border border-[oklch(0.21_0_0)] text-[oklch(0.21_0_0)]"
                  >
                    Acceder
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMenus}
                    className="block py-3 text-center text-sm bg-[oklch(0.21_0_0)] text-[oklch(0.979_0.004_90)]"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Spacer so content doesn't sit behind fixed header */}
      <div className="h-16 lg:h-20" aria-hidden />
    </>
  )
}
