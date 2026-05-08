'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Calendar,
  Package,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { bookingsApi, ordersApi, classesApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { Booking, ClassEnrollment, Order } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'No asistió',
  REFUNDED: 'Reembolsado',
}

export default function CuentaResumenPage() {
  const { user } = useAuthStore()

  const ordersQuery = useQuery({
    queryKey: ['my-orders', { limit: 3 }],
    queryFn: () => ordersApi.getMyOrders({ limit: 3 }).then((r) => r.data),
  })
  const bookingsQuery = useQuery({
    queryKey: ['my-bookings', { limit: 3 }],
    queryFn: () => bookingsApi.getMyBookings({ limit: 3 }).then((r) => r.data),
  })
  const enrollmentsQuery = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => classesApi.getMyEnrollments().then((r) => r.data),
  })

  const orders: Order[] = ordersQuery.data?.data?.orders ?? []
  const bookings: Booking[] = bookingsQuery.data?.data?.bookings ?? []
  const enrollments: ClassEnrollment[] = enrollmentsQuery.data?.data?.enrollments ?? []

  const totalSpent = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'PENDING'
  ).length

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="rule-cobre" />
        <span
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          Resumen
        </span>
      </div>
      <h1
        className="text-3xl lg:text-4xl mb-3"
        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
      >
        Bienvenida de nuevo,
        <em
          className="block not-italic italic"
          style={{ color: 'oklch(0.551 0.041 147)' }}
        >
          {user?.firstName}.
        </em>
      </h1>
      <p
        className="text-sm leading-relaxed mb-10 max-w-md"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        Aquí puedes consultar tus pedidos, gestionar tus reservas y revisar tus
        datos personales.
      </p>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <StatCard
          Icon={Package}
          label="Pedidos realizados"
          value={String(orders.length)}
          loading={ordersQuery.isLoading}
        />
        <StatCard
          Icon={Calendar}
          label="Reservas próximas"
          value={String(upcomingBookings)}
          loading={bookingsQuery.isLoading}
        />
        <StatCard
          Icon={TrendingUp}
          label="Total invertido"
          value={`${totalSpent.toFixed(2).replace('.', ',')}€`}
          loading={ordersQuery.isLoading}
        />
      </div>

      {/* Recent orders */}
      <Section
        title="Últimos pedidos"
        href="/cuenta/pedidos"
        empty={!ordersQuery.isLoading && orders.length === 0}
        emptyMessage="Aún no has realizado ningún pedido."
        emptyHref="/tienda"
        emptyCta="Ir a la tienda"
        loading={ordersQuery.isLoading}
      >
        <ul className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
          {orders.slice(0, 3).map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between p-5"
              style={{ background: 'oklch(0.962 0.005 90)' }}
            >
              <div>
                <p
                  className="text-sm font-medium mb-0.5"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {order.orderNumber}
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  · {order.items.length}{' '}
                  {order.items.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-medium"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {order.total.toFixed(2).replace('.', ',')}€
                </p>
                <span
                  className="text-[10px] tracking-wide uppercase mt-0.5 inline-block"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Recent bookings */}
      <Section
        title="Próximas reservas"
        href="/cuenta/reservas"
        empty={!bookingsQuery.isLoading && bookings.length === 0}
        emptyMessage="No tienes reservas activas."
        emptyHref="/servicios"
        emptyCta="Reservar servicio"
        loading={bookingsQuery.isLoading}
      >
        <ul className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
          {bookings.slice(0, 3).map((booking) => (
            <li
              key={booking.id}
              className="flex items-center justify-between p-5"
              style={{ background: 'oklch(0.962 0.005 90)' }}
            >
              <div>
                <p
                  className="text-sm font-medium mb-0.5"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {booking.service.name}
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  {new Date(booking.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                  })}{' '}
                  · {booking.time}
                </p>
              </div>
              <span
                className="text-[10px] tracking-wide uppercase px-3 py-1"
                style={{
                  background: 'oklch(0.979 0.004 90)',
                  color: 'oklch(0.45 0 0)',
                }}
              >
                {STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Active enrollments */}
      {enrollments.length > 0 && (
        <Section
          title="Clases activas"
          href="/cuenta/reservas"
          empty={false}
          loading={enrollmentsQuery.isLoading}
        >
          <ul className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
            {enrollments.slice(0, 3).map((enrollment) => (
              <li
                key={enrollment.id}
                className="flex items-center justify-between p-5"
                style={{ background: 'oklch(0.962 0.005 90)' }}
              >
                <div className="flex items-center gap-3">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: 'oklch(0.551 0.041 147)' }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {enrollment.class?.name ?? 'Clase'}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                    >
                      {enrollment.enrollmentType === 'MONTHLY'
                        ? 'Bono mensual'
                        : enrollment.enrollmentType === 'QUARTERLY'
                          ? 'Bono trimestral'
                          : 'Sesión única'}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] tracking-wide uppercase px-3 py-1"
                  style={{
                    background: 'oklch(0.979 0.004 90)',
                    color: 'oklch(0.45 0 0)',
                  }}
                >
                  {STATUS_LABELS[enrollment.status] ?? enrollment.status}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

function StatCard({
  Icon,
  label,
  value,
  loading,
}: {
  Icon: typeof Package
  label: string
  value: string
  loading: boolean
}) {
  return (
    <div
      className="p-5"
      style={{
        background: 'oklch(0.962 0.005 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.15)',
      }}
    >
      <Icon className="w-5 h-5 mb-3" style={{ color: 'oklch(0.668 0.063 64)' }} />
      <p
        className="text-xs tracking-wide uppercase mb-1"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
      </p>
      {loading ? (
        <div
          className="h-7 w-16 rounded animate-pulse"
          style={{ background: 'oklch(0.9 0.003 90)' }}
        />
      ) : (
        <p
          className="text-2xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          {value}
        </p>
      )}
    </div>
  )
}

function Section({
  title,
  href,
  empty,
  emptyMessage,
  emptyHref,
  emptyCta,
  loading,
  children,
}: {
  title: string
  href: string
  empty: boolean
  emptyMessage?: string
  emptyHref?: string
  emptyCta?: string
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2
          className="text-lg"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs tracking-wide uppercase transition-colors hover:text-[oklch(0.668_0.063_64)]"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Ver todo <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse"
              style={{ background: 'oklch(0.962 0.005 90)' }}
            />
          ))}
        </div>
      ) : empty ? (
        <div
          className="p-8 text-center"
          style={{
            background: 'oklch(0.962 0.005 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.15)',
          }}
        >
          <p className="text-sm mb-4" style={{ color: 'oklch(0.45 0 0)' }}>
            {emptyMessage}
          </p>
          {emptyHref && emptyCta && (
            <Link
              href={emptyHref}
              className="inline-flex items-center gap-2 text-xs tracking-wide uppercase transition-colors hover:text-[oklch(0.668_0.063_64)]"
              style={{ color: 'oklch(0.21 0 0)' }}
            >
              {emptyCta} <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
