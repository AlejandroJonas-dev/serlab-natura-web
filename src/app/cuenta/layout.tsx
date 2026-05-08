'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Calendar,
  LogOut,
  Package,
  Sparkles,
  User as UserIcon,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'

const NAV = [
  { href: '/cuenta', label: 'Resumen', Icon: Sparkles, exact: true },
  { href: '/cuenta/pedidos', label: 'Mis pedidos', Icon: Package },
  { href: '/cuenta/reservas', label: 'Mis reservas', Icon: Calendar },
  { href: '/cuenta/perfil', label: 'Mi perfil', Icon: UserIcon },
]

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, pathname, router])

  if (!isAuthenticated || !user) {
    return (
      <main
        className="min-h-[60vh] flex items-center justify-center"
        style={{ background: 'oklch(0.979 0.004 90)' }}
      >
        <div
          className="h-6 w-6 border-2 border-[oklch(0.668_0.063_64)] border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
      </main>
    )
  }

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Breadcrumb */}
      <div
        className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span>Mi cuenta</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28">
            <div
              className="p-6 mb-4"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="rule-cobre" />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  Hola
                </span>
              </div>
              <p
                className="text-2xl mt-2"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                {user.firstName}
              </p>
              <p className="text-xs mt-1 truncate" style={{ color: 'oklch(0.45 0 0)' }}>
                {user.email}
              </p>
              <div
                className="mt-5 pt-4 border-t border-[oklch(0.656_0.016_78/0.15)] flex items-center justify-between"
              >
                <span className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  Puntos de fidelidad
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {user.loyaltyPoints}
                </span>
              </div>
            </div>

            <nav aria-label="Mi cuenta">
              <ul className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
                {NAV.map(({ href, label, Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex items-center gap-3 px-5 py-4 text-sm transition-colors"
                        style={{
                          background: active
                            ? 'oklch(0.962 0.005 90)'
                            : 'oklch(0.979 0.004 90)',
                          color: active ? 'oklch(0.668 0.063 64)' : 'oklch(0.45 0 0)',
                          fontWeight: active ? 500 : 400,
                          borderLeft: active
                            ? '2px solid oklch(0.668 0.063 64)'
                            : '2px solid transparent',
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    </li>
                  )
                })}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-5 py-4 text-sm transition-colors hover:text-[oklch(0.55_0.18_25)]"
                    style={{
                      background: 'oklch(0.979 0.004 90)',
                      color: 'oklch(0.45 0 0)',
                      borderLeft: '2px solid transparent',
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </nav>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="mt-4 flex items-center justify-between p-4 transition-colors"
                style={{
                  background: 'oklch(0.21 0 0)',
                  color: 'oklch(0.979 0.004 90)',
                }}
              >
                <span className="text-xs tracking-[0.2em] uppercase">Panel admin</span>
                <span aria-hidden>→</span>
              </Link>
            )}
          </aside>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </main>
  )
}
