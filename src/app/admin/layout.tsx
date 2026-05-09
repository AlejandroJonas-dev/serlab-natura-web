'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Calendar,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  ShoppingBag,
  Sparkles,
  Users as UsersIcon,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'

const NAV: Array<{
  href: string
  label: string
  Icon: typeof LayoutDashboard
  exact?: boolean
}> = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/pedidos', label: 'Pedidos', Icon: ShoppingBag },
  { href: '/admin/reservas', label: 'Reservas', Icon: Calendar },
  { href: '/admin/productos', label: 'Productos', Icon: Package },
  { href: '/admin/servicios', label: 'Servicios', Icon: Sparkles },
  { href: '/admin/clases', label: 'Clases', Icon: GraduationCap },
  { href: '/admin/usuarios', label: 'Usuarios', Icon: UsersIcon },
  { href: '/admin/reviews', label: 'Reseñas', Icon: MessageSquare },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }
    if (user && user.role !== 'ADMIN') {
      router.replace('/cuenta')
    }
  }, [isAuthenticated, pathname, router, user])

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'oklch(0.18 0.005 90)' }}
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
    <div
      className="min-h-screen flex"
      style={{ background: 'oklch(0.96 0.005 90)' }}
    >
      {/* Sidebar — desktop */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30"
        style={{
          background: 'oklch(0.21 0 0)',
          color: 'oklch(0.85 0 0)',
        }}
      >
        <SidebarContent
          pathname={pathname}
          userName={`${user.firstName} ${user.lastName}`}
          userEmail={user.email}
          onLogout={handleLogout}
          onNavigate={() => {}}
        />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <button
            type="button"
            className="absolute inset-0 bg-[oklch(0.21_0_0/0.6)]"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <aside
            className="relative flex flex-col w-72 max-w-[85vw]"
            style={{
              background: 'oklch(0.21 0 0)',
              color: 'oklch(0.85 0 0)',
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[oklch(0.85_0_0)]"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              pathname={pathname}
              userName={`${user.firstName} ${user.lastName}`}
              userEmail={user.email}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8 h-14 border-b"
          style={{
            background: 'oklch(0.99 0.004 90 / 0.92)',
            backdropFilter: 'blur(8px)',
            borderColor: 'oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center"
              style={{ color: 'oklch(0.21 0 0)' }}
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Panel de administración
            </span>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 text-xs transition-colors hover:text-[oklch(0.668_0.063_64)]"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Ver web pública
          </Link>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-8">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  userName,
  userEmail,
  onLogout,
  onNavigate,
}: {
  pathname: string
  userName: string
  userEmail: string
  onLogout: () => void
  onNavigate: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" onClick={onNavigate} className="inline-flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ background: 'oklch(0.979 0.004 90)' }}
          >
            <Image
              src="/logo-serlab-natura.webp"
              alt="Serlab Natura"
              width={1674}
              height={515}
              className="w-7 h-auto"
            />
          </div>
          <div>
            <p
              className="text-sm leading-tight"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.979 0.004 90)',
              }}
            >
              Serlab Natura
            </p>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto" aria-label="Admin">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
                  style={{
                    background: active ? 'oklch(0.668 0.063 64)' : 'transparent',
                    color: active ? 'oklch(0.99 0.004 90)' : 'oklch(0.85 0 0)',
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User block */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="px-2 mb-3">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'oklch(0.99 0.004 90)' }}
          >
            {userName}
          </p>
          <p
            className="text-[11px] truncate"
            style={{ color: 'oklch(0.6 0 0)' }}
          >
            {userEmail}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-white/5"
          style={{ color: 'oklch(0.7 0 0)' }}
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  )
}
