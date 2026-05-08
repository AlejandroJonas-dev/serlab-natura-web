'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  Package,
  ChevronDown,
  ChevronUp,
  X,
  Truck,
} from 'lucide-react'
import { ordersApi } from '@/lib/api'
import type { Order, OrderStatus } from '@/types'

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

const FILTERS: Array<{ id: OrderStatus | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'PROCESSING', label: 'En preparación' },
  { id: 'SHIPPED', label: 'Enviados' },
  { id: 'DELIVERED', label: 'Entregados' },
  { id: 'CANCELLED', label: 'Cancelados' },
]

export default function MisPedidosPage() {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-orders', filter],
    queryFn: () =>
      ordersApi
        .getMyOrders(filter === 'ALL' ? {} : { status: filter })
        .then((r) => r.data),
  })
  const orders: Order[] = data?.data?.orders ?? []

  const cancelOrder = useMutation({
    mutationFn: (id: string) => ordersApi.cancelMyOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-orders'] }),
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="rule-cobre" />
        <span
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          Historial de compras
        </span>
      </div>
      <h1
        className="text-3xl lg:text-4xl mb-8"
        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
      >
        Mis pedidos
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(({ id, label }) => {
          const active = filter === id
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className="px-4 py-2 text-xs tracking-wide transition-all duration-200"
              style={{
                background: active ? 'oklch(0.21 0 0)' : 'oklch(0.962 0.005 90)',
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

      {isLoading ? (
        <div className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse"
              style={{ background: 'oklch(0.962 0.005 90)' }}
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm" style={{ color: 'oklch(0.55 0.18 25)' }}>
          No se pudieron cargar los pedidos. Inténtalo de nuevo.
        </p>
      ) : orders.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: 'oklch(0.962 0.005 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.15)',
          }}
        >
          <Package
            className="w-12 h-12 mx-auto mb-5"
            style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
          />
          <h2
            className="text-lg mb-2"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            {filter === 'ALL' ? 'Sin pedidos por ahora' : 'No hay pedidos en este estado'}
          </h2>
          <p
            className="text-sm mb-6 max-w-sm mx-auto"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            {filter === 'ALL'
              ? 'Aún no has realizado ningún pedido. Explora nuestra tienda.'
              : 'Cambia de filtro para ver pedidos en otros estados.'}
          </p>
          {filter === 'ALL' && (
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-wide uppercase transition-colors"
              style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
            >
              Ir a la tienda <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const isOpen = expanded === order.id
            const canCancel = order.status === 'PENDING' || order.status === 'PAID'

            return (
              <li
                key={order.id}
                style={{
                  background: 'oklch(0.962 0.005 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                }}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[oklch(0.95_0.005_90)]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <Package
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: 'oklch(0.668 0.063 64)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium mb-0.5"
                        style={{
                          fontFamily: 'var(--font-playfair), serif',
                          color: 'oklch(0.21 0 0)',
                        }}
                      >
                        {order.orderNumber}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'oklch(0.656 0.016 78)' }}
                      >
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        · {order.items.length}{' '}
                        {order.items.length === 1 ? 'producto' : 'productos'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 ml-4">
                    <span
                      className="text-[10px] tracking-wide uppercase px-2 py-1 hidden sm:inline-block"
                      style={{
                        background: 'oklch(0.979 0.004 90)',
                        color: STATUS_COLORS[order.status],
                        border: `1px solid ${STATUS_COLORS[order.status]} / 0.3`,
                      }}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                    <p
                      className="text-base font-medium"
                      style={{ color: 'oklch(0.668 0.063 64)' }}
                    >
                      {order.total.toFixed(2).replace('.', ',')}€
                    </p>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" style={{ color: 'oklch(0.656 0.016 78)' }} />
                    ) : (
                      <ChevronDown
                        className="w-4 h-4"
                        style={{ color: 'oklch(0.656 0.016 78)' }}
                      />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    className="border-t px-5 py-6"
                    style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
                  >
                    <span
                      className="text-[10px] tracking-wide uppercase px-2 py-1 sm:hidden inline-block mb-4"
                      style={{
                        background: 'oklch(0.979 0.004 90)',
                        color: STATUS_COLORS[order.status],
                        border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                      }}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>

                    {/* Items */}
                    <ul className="space-y-3 mb-6">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4">
                          <div
                            className="relative w-12 h-12 flex-shrink-0 overflow-hidden"
                            style={{
                              background: 'oklch(0.979 0.004 90)',
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
                                  style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
                                />
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/tienda/${item.product.slug}`}
                            className="flex-1 min-w-0 hover:text-[oklch(0.668_0.063_64)] transition-colors"
                          >
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: 'oklch(0.21 0 0)' }}
                            >
                              {item.product.name}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: 'oklch(0.656 0.016 78)' }}
                            >
                              {item.unitPrice.toFixed(2).replace('.', ',')}€ × {item.quantity}
                            </p>
                          </Link>
                          <span
                            className="text-sm font-medium"
                            style={{ color: 'oklch(0.21 0 0)' }}
                          >
                            {item.totalPrice.toFixed(2).replace('.', ',')}€
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Totals */}
                    <div
                      className="flex flex-col gap-1.5 pt-4 mb-5 border-t"
                      style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
                    >
                      <div className="flex justify-between text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                        <span>Subtotal</span>
                        <span>{order.subtotal.toFixed(2).replace('.', ',')}€</span>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                        <span>Envío</span>
                        <span>
                          {order.shippingCost === 0
                            ? 'Gratis'
                            : `${order.shippingCost.toFixed(2).replace('.', ',')}€`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-1.5">
                        <span style={{ color: 'oklch(0.21 0 0)' }}>Total</span>
                        <span style={{ color: 'oklch(0.668 0.063 64)' }}>
                          {order.total.toFixed(2).replace('.', ',')}€
                        </span>
                      </div>
                    </div>

                    {/* Tracking */}
                    {order.trackingNumber && (
                      <div
                        className="flex items-center gap-3 p-4 mb-5"
                        style={{
                          background: 'oklch(0.551 0.041 147 / 0.05)',
                          border: '1px solid oklch(0.551 0.041 147 / 0.2)',
                        }}
                      >
                        <Truck
                          className="w-4 h-4"
                          style={{ color: 'oklch(0.551 0.041 147)' }}
                        />
                        <div className="flex-1 text-xs">
                          <p
                            className="font-medium mb-0.5"
                            style={{ color: 'oklch(0.21 0 0)' }}
                          >
                            Número de seguimiento
                          </p>
                          <p style={{ color: 'oklch(0.45 0 0)' }}>
                            {order.trackingNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {canCancel && (
                      <button
                        onClick={() => {
                          if (confirm('¿Seguro que quieres cancelar este pedido?')) {
                            cancelOrder.mutate(order.id)
                          }
                        }}
                        disabled={cancelOrder.isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs transition-colors disabled:opacity-60"
                        style={{
                          color: 'oklch(0.55 0.18 25)',
                          border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                        {cancelOrder.isPending ? 'Cancelando...' : 'Cancelar pedido'}
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
