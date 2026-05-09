'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Search,
  User as UserIcon,
  X,
} from 'lucide-react'
import { bookingsApi } from '@/lib/api'
import type { Booking, BookingStatus } from '@/types'

const STATUSES: Array<{ id: BookingStatus | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'Todas' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'CONFIRMED', label: 'Confirmadas' },
  { id: 'COMPLETED', label: 'Completadas' },
  { id: 'CANCELLED', label: 'Canceladas' },
  { id: 'NO_SHOW', label: 'No asistió' },
]

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
  NO_SHOW: 'No asistió',
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'oklch(0.668 0.063 64)',
  CONFIRMED: 'oklch(0.551 0.041 147)',
  CANCELLED: 'oklch(0.55 0.18 25)',
  COMPLETED: 'oklch(0.45 0 0)',
  NO_SHOW: 'oklch(0.45 0 0)',
}

export default function AdminReservasPage() {
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statusNote, setStatusNote] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-bookings', filter],
    queryFn: () =>
      bookingsApi
        .getAll(filter === 'ALL' ? {} : { status: filter })
        .then((r) => r.data),
  })
  const bookings: Booking[] = data?.data?.bookings ?? []
  const filtered = search
    ? bookings.filter((b) =>
        [b.bookingNumber, b.service.name]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(search.toLowerCase()))
      )
    : bookings

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string
      status: BookingStatus
      notes?: string
    }) => bookingsApi.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
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
            Agenda del centro
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Reservas
        </h1>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número o servicio..."
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

      {updateStatus.isError && (
        <div
          className="mb-4 p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(updateStatus.error as Error)?.message ?? 'Error al actualizar la reserva'}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse"
              style={{ background: 'oklch(0.94 0.005 90)' }}
            />
          ))}
        </div>
      ) : isError ? (
        <p
          className="p-5 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          No se pudieron cargar las reservas.
        </p>
      ) : filtered.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          <Calendar
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
          />
          <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
            {search
              ? `Sin resultados para "${search}"`
              : 'No hay reservas en este estado.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((booking) => {
            const isOpen = expanded === booking.id
            const date = new Date(booking.date)
            const canConfirm = booking.status === 'PENDING'
            const canComplete = booking.status === 'CONFIRMED'
            const canMarkNoShow = booking.status === 'CONFIRMED'
            const canCancel =
              booking.status === 'PENDING' || booking.status === 'CONFIRMED'

            return (
              <li
                key={booking.id}
                style={{
                  background: 'oklch(0.99 0.004 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.18)',
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_140px_auto_40px] gap-3 lg:gap-4 px-5 py-4 items-center">
                  <p
                    className="text-sm font-medium tabular-nums"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      color: 'oklch(0.21 0 0)',
                    }}
                  >
                    {booking.bookingNumber}
                  </p>

                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'oklch(0.21 0 0)' }}
                    >
                      {booking.service.name}
                    </p>
                    <p
                      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-0.5"
                      style={{ color: 'oklch(0.45 0 0)' }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.time} · {booking.duration} min
                      </span>
                      {booking.therapist && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {booking.therapist.firstName}{' '}
                          {booking.therapist.lastName}
                        </span>
                      )}
                    </p>
                  </div>

                  <StatusPill
                    label={STATUS_LABELS[booking.status]}
                    color={STATUS_COLORS[booking.status]}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    {canConfirm && (
                      <button
                        onClick={() =>
                          updateStatus.mutate({
                            id: booking.id,
                            status: 'CONFIRMED',
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors disabled:opacity-60"
                        style={{
                          background: 'oklch(0.551 0.041 147)',
                          color: 'oklch(0.979 0.004 90)',
                        }}
                      >
                        <Check className="w-3 h-3" /> Confirmar
                      </button>
                    )}
                    {canComplete && (
                      <button
                        onClick={() =>
                          updateStatus.mutate({
                            id: booking.id,
                            status: 'COMPLETED',
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors disabled:opacity-60"
                        style={{
                          background: 'oklch(0.21 0 0)',
                          color: 'oklch(0.979 0.004 90)',
                        }}
                      >
                        <Check className="w-3 h-3" /> Completar
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => {
                          if (confirm('¿Cancelar esta reserva?')) {
                            updateStatus.mutate({
                              id: booking.id,
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
                    onClick={() => setExpanded(isOpen ? null : booking.id)}
                    className="lg:justify-self-end w-8 h-8 flex items-center justify-center"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Cerrar' : 'Detalle'}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    className="px-5 py-5 border-t grid grid-cols-1 sm:grid-cols-2 gap-6"
                    style={{
                      background: 'oklch(0.97 0.005 90)',
                      borderColor: 'oklch(0.656 0.016 78 / 0.12)',
                    }}
                  >
                    <div className="space-y-3 text-xs">
                      <Field label="Servicio">
                        {booking.service.name}{' '}
                        <span style={{ color: 'oklch(0.656 0.016 78)' }}>
                          · {booking.service.duration} min
                        </span>
                      </Field>
                      <Field label="Precio">
                        <span
                          className="font-medium"
                          style={{ color: 'oklch(0.668 0.063 64)' }}
                        >
                          {booking.price.toFixed(2).replace('.', ',')}€
                        </span>
                      </Field>
                      <Field label="Reservada el">
                        {new Date(booking.createdAt).toLocaleDateString(
                          'es-ES',
                          {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </Field>
                      {booking.notes && (
                        <div>
                          <p
                            className="text-[11px] tracking-wide uppercase mb-1"
                            style={{ color: 'oklch(0.668 0.063 64)' }}
                          >
                            Notas del cliente
                          </p>
                          <p
                            className="italic leading-relaxed"
                            style={{ color: 'oklch(0.45 0 0)' }}
                          >
                            «{booking.notes}»
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Mark no-show + admin note */}
                    <div className="space-y-3">
                      <p
                        className="text-[11px] tracking-wide uppercase"
                        style={{ color: 'oklch(0.668 0.063 64)' }}
                      >
                        Acciones avanzadas
                      </p>
                      <textarea
                        value={statusNote[booking.id] ?? ''}
                        onChange={(e) =>
                          setStatusNote((prev) => ({
                            ...prev,
                            [booking.id]: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Nota interna (opcional, se guarda al cambiar de estado)"
                        className="w-full px-3 py-2 text-xs focus:outline-none resize-none"
                        style={{
                          background: 'oklch(0.99 0.004 90)',
                          border:
                            '1px solid oklch(0.656 0.016 78 / 0.25)',
                          color: 'oklch(0.21 0 0)',
                        }}
                      />
                      {canMarkNoShow && (
                        <button
                          onClick={() =>
                            updateStatus.mutate({
                              id: booking.id,
                              status: 'NO_SHOW',
                              notes: statusNote[booking.id]?.trim() || undefined,
                            })
                          }
                          disabled={updateStatus.isPending}
                          className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-[11px] tracking-wide uppercase transition-colors disabled:opacity-60"
                          style={{
                            color: 'oklch(0.45 0 0)',
                            border: '1px solid oklch(0.656 0.016 78 / 0.4)',
                          }}
                        >
                          Marcar como no asistió
                        </button>
                      )}
                    </div>
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

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p
        className="text-[11px] tracking-wide uppercase mb-0.5"
        style={{ color: 'oklch(0.668 0.063 64)' }}
      >
        {label}
      </p>
      <p style={{ color: 'oklch(0.21 0 0)' }}>{children}</p>
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
