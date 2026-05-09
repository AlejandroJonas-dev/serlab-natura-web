'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Package,
  Phone,
  Search,
  Truck,
  X,
} from 'lucide-react'
import { ordersApi } from '@/lib/api'
import type { Order, OrderStatus } from '@/types'

const STATUSES: Array<{ id: OrderStatus | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'PAID', label: 'Pagados' },
  { id: 'PROCESSING', label: 'En preparación' },
  { id: 'SHIPPED', label: 'Enviados' },
  { id: 'DELIVERED', label: 'Entregados' },
  { id: 'CANCELLED', label: 'Cancelados' },
]

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PAID',
  PAID: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
}

const NEXT_STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING: 'Marcar pagado',
  PAID: 'Pasar a preparación',
  PROCESSING: 'Marcar enviado',
  SHIPPED: 'Marcar entregado',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'oklch(0.668 0.063 64)',
  PAID: 'oklch(0.551 0.041 147)',
  PROCESSING: 'oklch(0.668 0.063 64)',
  SHIPPED: 'oklch(0.551 0.041 147)',
  DELIVERED: 'oklch(0.551 0.041 147)',
  CANCELLED: 'oklch(0.55 0.18 25)',
  REFUNDED: 'oklch(0.45 0 0)',
}

export default function AdminPedidosPage() {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [trackingDraft, setTrackingDraft] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-orders', filter],
    queryFn: () =>
      ordersApi
        .getAll(filter === 'ALL' ? {} : { status: filter })
        .then((r) => r.data),
  })
  const orders: Order[] = data?.data?.orders ?? []
  const filteredOrders = search
    ? orders.filter((o) =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase())
      )
    : orders

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const addTracking = useMutation({
    mutationFn: ({ id, tracking }: { id: string; tracking: string }) =>
      ordersApi.addTracking(id, tracking),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Gestión de pedidos
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Pedidos
        </h1>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div
          className="relative flex-1 max-w-sm"
          style={{ background: 'oklch(0.99 0.004 90)' }}
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número..."
            className="w-full pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              background: 'oklch(0.99 0.004 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              color: 'oklch(0.21 0 0)',
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map(({ id, label }) => {
            const active = filter === id
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className="px-3 py-2 text-xs tracking-wide transition-all duration-200"
                style={{
                  background: active ? 'oklch(0.21 0 0)' : 'oklch(0.99 0.004 90)',
                  color: active ? 'oklch(0.979 0.004 90)' : 'oklch(0.45 0 0)',
                  border: active
                    ? '1px solid oklch(0.21 0 0)'
                    : '1px solid oklch(0.656 0.016 78 / 0.2)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mutation feedback */}
      {(updateStatus.isError || addTracking.isError) && (
        <div
          className="mb-4 p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(updateStatus.error || addTracking.error) instanceof Error
            ? (updateStatus.error as Error)?.message ??
              (addTracking.error as Error)?.message
            : 'Error al actualizar el pedido'}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <SkeletonTable />
      ) : isError ? (
        <ErrorBox message="No se pudieron cargar los pedidos." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          message={
            search
              ? `Sin resultados para "${search}"`
              : 'No hay pedidos en este estado.'
          }
        />
      ) : (
        <div
          className="overflow-hidden"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          {/* Desktop header */}
          <div
            className="hidden lg:grid grid-cols-[180px_1fr_140px_120px_140px_40px] gap-4 px-5 py-3 text-[11px] tracking-wide uppercase border-b"
            style={{
              background: 'oklch(0.96 0.005 90)',
              color: 'oklch(0.45 0 0)',
              borderColor: 'oklch(0.656 0.016 78 / 0.18)',
            }}
          >
            <span>Número</span>
            <span>Fecha · productos</span>
            <span>Estado</span>
            <span className="text-right">Total</span>
            <span>Acciones</span>
            <span></span>
          </div>

          <ul>
            {filteredOrders.map((order) => {
              const isOpen = expanded === order.id
              const next = NEXT_STATUS[order.status]
              const canCancel =
                order.status !== 'CANCELLED' &&
                order.status !== 'DELIVERED' &&
                order.status !== 'REFUNDED'
              return (
                <li
                  key={order.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: 'oklch(0.656 0.016 78 / 0.12)' }}
                >
                  {/* Row */}
                  <div
                    className="grid grid-cols-1 lg:grid-cols-[180px_1fr_140px_120px_140px_40px] gap-3 lg:gap-4 px-5 py-4 items-center hover:bg-[oklch(0.97_0.005_90)] transition-colors"
                  >
                    <p
                      className="text-sm font-medium tabular-nums"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {order.orderNumber}
                    </p>

                    <div className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        ·{' '}
                        {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="mt-0.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                        {order.items.length} producto
                        {order.items.length === 1 ? '' : 's'}
                      </p>
                    </div>

                    <StatusPill
                      label={STATUS_LABELS[order.status]}
                      color={STATUS_COLORS[order.status]}
                    />

                    <span
                      className="text-sm font-medium tabular-nums lg:text-right"
                      style={{ color: 'oklch(0.668 0.063 64)' }}
                    >
                      {order.total.toFixed(2).replace('.', ',')}€
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {next && (
                        <button
                          onClick={() =>
                            updateStatus.mutate({ id: order.id, status: next })
                          }
                          disabled={updateStatus.isPending}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors disabled:opacity-60"
                          style={{
                            background: 'oklch(0.21 0 0)',
                            color: 'oklch(0.979 0.004 90)',
                          }}
                        >
                          <Check className="w-3 h-3" /> {NEXT_STATUS_LABEL[order.status]}
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => {
                            if (confirm('¿Cancelar este pedido?')) {
                              updateStatus.mutate({
                                id: order.id,
                                status: 'CANCELLED',
                              })
                            }
                          }}
                          disabled={updateStatus.isPending}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] tracking-wide uppercase transition-colors disabled:opacity-60"
                          style={{
                            color: 'oklch(0.55 0.18 25)',
                            border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      className="lg:justify-self-end w-8 h-8 flex items-center justify-center"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? 'Cerrar detalle' : 'Ver detalle'}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div
                      className="px-5 py-6 border-t grid grid-cols-1 lg:grid-cols-2 gap-8"
                      style={{
                        background: 'oklch(0.97 0.005 90)',
                        borderColor: 'oklch(0.656 0.016 78 / 0.12)',
                      }}
                    >
                      {/* Items */}
                      <div>
                        <h3
                          className="text-xs tracking-[0.2em] uppercase mb-4"
                          style={{ color: 'oklch(0.668 0.063 64)' }}
                        >
                          Productos
                        </h3>
                        <ul className="space-y-3 mb-5">
                          {order.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              <div
                                className="relative w-12 h-12 flex-shrink-0 overflow-hidden"
                                style={{
                                  background: 'oklch(0.99 0.004 90)',
                                  border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                                }}
                              >
                                {item.product.images?.[0] ? (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    fill
                                    className="object-contain p-1"
                                    sizes="48px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package
                                      className="w-4 h-4"
                                      style={{
                                        color: 'oklch(0.656 0.016 78 / 0.4)',
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-medium truncate"
                                  style={{ color: 'oklch(0.21 0 0)' }}
                                >
                                  {item.product.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: 'oklch(0.656 0.016 78)' }}
                                >
                                  {item.unitPrice.toFixed(2).replace('.', ',')}€ ×{' '}
                                  {item.quantity}
                                </p>
                              </div>
                              <span
                                className="text-sm font-medium tabular-nums"
                                style={{ color: 'oklch(0.21 0 0)' }}
                              >
                                {item.totalPrice.toFixed(2).replace('.', ',')}€
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div
                          className="space-y-1.5 pt-4 border-t"
                          style={{ borderColor: 'oklch(0.656 0.016 78 / 0.18)' }}
                        >
                          <Row
                            label="Subtotal"
                            value={`${order.subtotal.toFixed(2).replace('.', ',')}€`}
                          />
                          <Row
                            label="Envío"
                            value={
                              order.shippingCost === 0
                                ? 'Gratis'
                                : `${order.shippingCost.toFixed(2).replace('.', ',')}€`
                            }
                          />
                          <Row
                            label="Método de pago"
                            value={paymentLabel(order.paymentMethod)}
                          />
                          <div className="flex justify-between text-sm font-medium pt-2 mt-1">
                            <span style={{ color: 'oklch(0.21 0 0)' }}>
                              Total
                            </span>
                            <span
                              className="tabular-nums"
                              style={{ color: 'oklch(0.668 0.063 64)' }}
                            >
                              {order.total.toFixed(2).replace('.', ',')}€
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping + tracking + notes */}
                      <div className="space-y-6">
                        <ShippingCard address={order.shippingAddress} />

                        <div>
                          <h3
                            className="text-xs tracking-[0.2em] uppercase mb-3"
                            style={{ color: 'oklch(0.668 0.063 64)' }}
                          >
                            Envío
                          </h3>
                          {order.trackingNumber ? (
                            <div
                              className="flex items-center gap-3 p-3"
                              style={{
                                background: 'oklch(0.551 0.041 147 / 0.06)',
                                border:
                                  '1px solid oklch(0.551 0.041 147 / 0.25)',
                              }}
                            >
                              <Truck
                                className="w-4 h-4"
                                style={{ color: 'oklch(0.551 0.041 147)' }}
                              />
                              <span
                                className="text-xs flex-1"
                                style={{ color: 'oklch(0.21 0 0)' }}
                              >
                                {order.trackingNumber}
                              </span>
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                const tracking = trackingDraft[order.id]?.trim()
                                if (!tracking) return
                                addTracking.mutate({ id: order.id, tracking })
                              }}
                              className="flex gap-2"
                            >
                              <input
                                value={trackingDraft[order.id] ?? ''}
                                onChange={(e) =>
                                  setTrackingDraft((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                placeholder="Nº de seguimiento"
                                className="flex-1 px-3 py-2 text-xs focus:outline-none"
                                style={{
                                  background: 'oklch(0.99 0.004 90)',
                                  border:
                                    '1px solid oklch(0.656 0.016 78 / 0.25)',
                                  color: 'oklch(0.21 0 0)',
                                }}
                              />
                              <button
                                type="submit"
                                disabled={addTracking.isPending}
                                className="px-4 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                                style={{
                                  background: 'oklch(0.21 0 0)',
                                  color: 'oklch(0.979 0.004 90)',
                                }}
                              >
                                Añadir
                              </button>
                            </form>
                          )}
                        </div>

                        {order.notes && (
                          <div>
                            <h3
                              className="text-xs tracking-[0.2em] uppercase mb-2"
                              style={{ color: 'oklch(0.668 0.063 64)' }}
                            >
                              Notas
                            </h3>
                            <p
                              className="text-xs italic leading-relaxed"
                              style={{ color: 'oklch(0.45 0 0)' }}
                            >
                              «{order.notes}»
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function paymentLabel(method: string): string {
  const map: Record<string, string> = {
    CARD: 'Tarjeta',
    APPLE_PAY: 'Apple Pay',
    GOOGLE_PAY: 'Google Pay',
    BIZUM: 'Bizum',
    BANK_TRANSFER: 'Transferencia',
  }
  return map[method] ?? method
}

function ShippingCard({
  address,
}: {
  address: Record<string, unknown>
}) {
  const a = address as Record<string, string>
  return (
    <div>
      <h3
        className="text-xs tracking-[0.2em] uppercase mb-3"
        style={{ color: 'oklch(0.668 0.063 64)' }}
      >
        Dirección de envío
      </h3>
      <div
        className="p-4 text-xs leading-relaxed space-y-1"
        style={{
          background: 'oklch(0.99 0.004 90)',
          border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          color: 'oklch(0.21 0 0)',
        }}
      >
        <p className="font-medium">
          {a.firstName} {a.lastName}
        </p>
        <p style={{ color: 'oklch(0.45 0 0)' }}>{a.street}</p>
        <p style={{ color: 'oklch(0.45 0 0)' }}>
          {a.postalCode} {a.city} ({a.state})
        </p>
        <p style={{ color: 'oklch(0.45 0 0)' }}>{a.country}</p>
        {a.email && (
          <Link
            href={`mailto:${a.email}`}
            className="flex items-center gap-1.5 text-[11px] mt-2 transition-colors hover:text-[oklch(0.668_0.063_64)]"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            <Mail className="w-3 h-3" /> {a.email}
          </Link>
        )}
        {a.phone && (
          <Link
            href={`tel:${a.phone}`}
            className="flex items-center gap-1.5 text-[11px] transition-colors hover:text-[oklch(0.668_0.063_64)]"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            <Phone className="w-3 h-3" /> {a.phone}
          </Link>
        )}
      </div>
    </div>
  )
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] tracking-wide uppercase px-2 py-1 inline-block whitespace-nowrap w-fit"
      style={{
        background: 'oklch(0.96 0.005 90)',
        color,
        border: `1px solid ${color}`,
      }}
    >
      {label}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span style={{ color: 'oklch(0.45 0 0)' }}>{label}</span>
      <span style={{ color: 'oklch(0.21 0 0)' }}>{value}</span>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse border-b last:border-b-0"
          style={{
            background: 'oklch(0.99 0.004 90)',
            borderColor: 'oklch(0.656 0.016 78 / 0.12)',
          }}
        />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="p-12 text-center"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <Package
        className="w-10 h-10 mx-auto mb-4"
        style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
      />
      <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
        {message}
      </p>
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="p-5"
      style={{
        background: 'oklch(0.96 0.05 25)',
        border: '1px solid oklch(0.6 0.18 25 / 0.4)',
        color: 'oklch(0.4 0.18 25)',
      }}
    >
      <p className="text-sm">{message}</p>
    </div>
  )
}
