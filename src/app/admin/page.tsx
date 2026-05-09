'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MessageSquare,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users as UsersIcon,
} from 'lucide-react'
import { adminApi, bookingsApi, ordersApi, reviewsApi } from '@/lib/api'
import type { Booking, DashboardStats, Order, Review } from '@/types'

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
  NO_SHOW: 'No asistió',
}

export default function AdminDashboardPage() {
  const statsQuery = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
  })
  const ordersQuery = useQuery({
    queryKey: ['admin-orders', { limit: 5 }],
    queryFn: () => ordersApi.getAll({ limit: 5 }).then((r) => r.data),
  })
  const bookingsQuery = useQuery({
    queryKey: ['admin-bookings', { limit: 5 }],
    queryFn: () => bookingsApi.getAll({ limit: 5 }).then((r) => r.data),
  })
  const pendingReviewsQuery = useQuery({
    queryKey: ['admin-reviews-pending'],
    queryFn: () => reviewsApi.getPending().then((r) => r.data),
  })

  const stats: DashboardStats | undefined = statsQuery.data?.data?.stats
  const orders: Order[] = ordersQuery.data?.data?.orders ?? []
  const bookings: Booking[] = bookingsQuery.data?.data?.bookings ?? []
  const pendingReviews: Review[] = pendingReviewsQuery.data?.data?.reviews ?? []

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Resumen general
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Dashboard
        </h1>
      </header>

      {/* KPI grid */}
      {statsQuery.isLoading ? (
        <SkeletonGrid />
      ) : statsQuery.isError || !stats ? (
        <ErrorBox message="No se pudieron cargar las estadísticas." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <KpiCard
            Icon={TrendingUp}
            label="Ingresos del mes"
            value={`${stats.orders.revenueThisMonth.toFixed(2).replace('.', ',')}€`}
            sub={`Total acumulado: ${stats.orders.revenue.toFixed(2).replace('.', ',')}€`}
            accent="oklch(0.551 0.041 147)"
          />
          <KpiCard
            Icon={ShoppingBag}
            label="Pedidos pendientes"
            value={String(stats.orders.pending)}
            sub={`${stats.orders.total} pedidos en total`}
            href="/admin/pedidos?status=PENDING"
            accent="oklch(0.668 0.063 64)"
          />
          <KpiCard
            Icon={Calendar}
            label="Reservas confirmadas"
            value={String(stats.bookings.confirmed)}
            sub={`${stats.bookings.pending} pendientes · ${stats.bookings.total} total`}
            href="/admin/reservas?status=CONFIRMED"
            accent="oklch(0.551 0.041 147)"
          />
          <KpiCard
            Icon={UserPlus}
            label="Nuevos usuarios"
            value={String(stats.users.newThisMonth)}
            sub={`${stats.users.active} activos · ${stats.users.total} total`}
            href="/admin/usuarios"
            accent="oklch(0.668 0.063 64)"
          />
        </div>
      )}

      {/* Inventory + moderation row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <SmallStatCard
            Icon={Package}
            label="Productos activos"
            value={`${stats.products.active}/${stats.products.total}`}
            warning={
              stats.products.lowStock > 0
                ? `${stats.products.lowStock} con stock bajo`
                : undefined
            }
            href="/admin/productos"
          />
          <SmallStatCard
            Icon={Sparkles}
            label="Servicios"
            value={`${stats.services.active}/${stats.services.total}`}
            href="/admin/servicios"
          />
          <SmallStatCard
            Icon={GraduationCap}
            label="Clases activas"
            value={`${stats.classes.active}/${stats.classes.total}`}
            href="/admin/clases"
          />
          <SmallStatCard
            Icon={MessageSquare}
            label="Reseñas pendientes"
            value={String(stats.reviews.pending)}
            warning={
              stats.reviews.pending > 0
                ? 'Requieren aprobación'
                : undefined
            }
            href="/admin/reviews"
          />
        </div>
      )}

      {/* Two-column feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Section
          title="Últimos pedidos"
          href="/admin/pedidos"
          loading={ordersQuery.isLoading}
          empty={!ordersQuery.isLoading && orders.length === 0}
          emptyMessage="No hay pedidos recientes."
        >
          <ul className="divide-y" style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}>
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3.5">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/pedidos?id=${order.id}`}
                    className="block hover:text-[oklch(0.668_0.063_64)] transition-colors"
                  >
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {order.orderNumber}
                    </p>
                  </Link>
                  <p className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0 0)' }}>
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}{' '}
                    · {order.items.length} producto{order.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <StatusPill
                    label={ORDER_STATUS_LABELS[order.status] ?? order.status}
                    color={statusColor(order.status)}
                  />
                  <span
                    className="text-sm font-medium tabular-nums"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    {order.total.toFixed(2).replace('.', ',')}€
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Recent bookings */}
        <Section
          title="Próximas reservas"
          href="/admin/reservas"
          loading={bookingsQuery.isLoading}
          empty={!bookingsQuery.isLoading && bookings.length === 0}
          emptyMessage="No hay reservas próximas."
        >
          <ul className="divide-y" style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}>
            {bookings.map((booking) => (
              <li key={booking.id} className="flex items-center justify-between py-3.5">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/reservas?id=${booking.id}`}
                    className="block hover:text-[oklch(0.668_0.063_64)] transition-colors"
                  >
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {booking.service.name}
                    </p>
                  </Link>
                  <p
                    className="flex items-center gap-1.5 text-xs mt-0.5"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    <Clock className="w-3 h-3" />
                    {new Date(booking.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}{' '}
                    · {booking.time}
                  </p>
                </div>
                <StatusPill
                  label={BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                  color={statusColor(booking.status)}
                />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Pending reviews call-out */}
      {pendingReviews.length > 0 && (
        <div
          className="mt-6 p-5 flex items-start gap-4"
          style={{
            background: 'oklch(0.97 0.04 85)',
            border: '1px solid oklch(0.668 0.063 64 / 0.4)',
          }}
        >
          <AlertTriangle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          />
          <div className="flex-1">
            <p
              className="text-sm font-medium"
              style={{ color: 'oklch(0.21 0 0)' }}
            >
              {pendingReviews.length} reseña
              {pendingReviews.length === 1 ? '' : 's'} pendiente
              {pendingReviews.length === 1 ? '' : 's'} de aprobación
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'oklch(0.45 0 0)' }}>
              Modera las reseñas para que aparezcan en la web pública.
            </p>
          </div>
          <Link
            href="/admin/reviews"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wide uppercase transition-colors"
            style={{
              background: 'oklch(0.21 0 0)',
              color: 'oklch(0.979 0.004 90)',
            }}
          >
            Revisar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Newsletter footer note */}
      {stats && (
        <p
          className="flex items-center justify-center gap-1.5 text-xs mt-10"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          <Mail className="w-3 h-3" />
          {stats.newsletter.total} suscripto
          {stats.newsletter.total === 1 ? 'r' : 'res'} a la newsletter
        </p>
      )}
    </div>
  )
}

function statusColor(status: string): string {
  switch (status) {
    case 'PAID':
    case 'CONFIRMED':
    case 'DELIVERED':
    case 'COMPLETED':
      return 'oklch(0.551 0.041 147)'
    case 'PENDING':
    case 'PROCESSING':
    case 'SHIPPED':
      return 'oklch(0.668 0.063 64)'
    case 'CANCELLED':
    case 'REFUNDED':
    case 'NO_SHOW':
      return 'oklch(0.55 0.18 25)'
    default:
      return 'oklch(0.45 0 0)'
  }
}

function KpiCard({
  Icon,
  label,
  value,
  sub,
  href,
  accent,
}: {
  Icon: typeof Package
  label: string
  value: string
  sub?: string
  href?: string
  accent: string
}) {
  const Inner = (
    <div
      className="p-6 h-full transition-colors duration-200 group"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{ background: `${accent} / 0.1`, color: accent }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {href && (
          <ArrowRight
            className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity"
            style={{ color: accent }}
          />
        )}
      </div>
      <p
        className="text-xs tracking-wide uppercase mb-1.5"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
      </p>
      <p
        className="text-3xl mb-1 tabular-nums"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: 'oklch(0.21 0 0)',
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
          {sub}
        </p>
      )}
    </div>
  )
  return href ? <Link href={href}>{Inner}</Link> : Inner
}

function SmallStatCard({
  Icon,
  label,
  value,
  warning,
  href,
}: {
  Icon: typeof Package
  label: string
  value: string
  warning?: string
  href?: string
}) {
  const Inner = (
    <div
      className="p-5 h-full transition-colors hover:border-[oklch(0.668_0.063_64)]"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon
          className="w-4 h-4 flex-shrink-0"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        />
        <p
          className="text-xs tracking-wide uppercase truncate"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          {label}
        </p>
      </div>
      <p
        className="text-xl mb-1 tabular-nums"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: 'oklch(0.21 0 0)',
        }}
      >
        {value}
      </p>
      {warning && (
        <p
          className="flex items-center gap-1 text-[11px]"
          style={{ color: 'oklch(0.55 0.18 25)' }}
        >
          <AlertTriangle className="w-3 h-3" />
          {warning}
        </p>
      )}
    </div>
  )
  return href ? <Link href={href}>{Inner}</Link> : Inner
}

function Section({
  title,
  href,
  loading,
  empty,
  emptyMessage,
  children,
}: {
  title: string
  href: string
  loading: boolean
  empty: boolean
  emptyMessage: string
  children: React.ReactNode
}) {
  return (
    <section
      className="p-6"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <header className="flex items-baseline justify-between mb-4">
        <h2
          className="text-base"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wide transition-colors hover:text-[oklch(0.668_0.063_64)]"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </header>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse"
              style={{ background: 'oklch(0.94 0.005 90)' }}
            />
          ))}
        </div>
      ) : empty ? (
        <div
          className="py-8 text-center text-sm"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          <CheckCircle2
            className="w-6 h-6 mx-auto mb-2 opacity-40"
            aria-hidden
          />
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] tracking-wide uppercase px-2 py-1 whitespace-nowrap"
      style={{
        background: 'oklch(0.96 0.005 90)',
        color,
        border: `1px solid ${color}`,
        borderColor: color,
        opacity: 0.95,
      }}
    >
      {label}
    </span>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-36 animate-pulse"
          style={{ background: 'oklch(0.94 0.005 90)' }}
        />
      ))}
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="p-5 mb-8"
      style={{
        background: 'oklch(0.96 0.05 25)',
        border: '1px solid oklch(0.6 0.18 25 / 0.4)',
        color: 'oklch(0.4 0.18 25)',
      }}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
