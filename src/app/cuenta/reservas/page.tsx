'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react'
import { bookingsApi, classesApi } from '@/lib/api'
import type { Booking, BookingStatus, ClassEnrollment } from '@/types'

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

const ENROLLMENT_TYPE_LABEL: Record<string, string> = {
  SINGLE_CLASS: 'Sesión única',
  MONTHLY: 'Bono mensual',
  QUARTERLY: 'Bono trimestral',
}

type Tab = 'sesiones' | 'clases'

export default function MisReservasPage() {
  const [tab, setTab] = useState<Tab>('sesiones')
  const queryClient = useQueryClient()

  const bookingsQuery = useQuery({
    queryKey: ['my-bookings', 'all'],
    queryFn: () => bookingsApi.getMyBookings().then((r) => r.data),
  })
  const enrollmentsQuery = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => classesApi.getMyEnrollments().then((r) => r.data),
  })

  const cancelBooking = useMutation({
    mutationFn: (id: string) => bookingsApi.cancelMyBooking(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-bookings'] }),
  })

  const cancelEnrollment = useMutation({
    mutationFn: (classId: string) => classesApi.cancelEnrollment(classId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-enrollments'] }),
  })

  const bookings: Booking[] = bookingsQuery.data?.data?.bookings ?? []
  const enrollments: ClassEnrollment[] = enrollmentsQuery.data?.data?.enrollments ?? []

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="rule-cobre" />
        <span
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          Tus citas y clases
        </span>
      </div>
      <h1
        className="text-3xl lg:text-4xl mb-8"
        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
      >
        Mis reservas
      </h1>

      {/* Tabs */}
      <div
        className="flex gap-px mb-8 inline-flex"
        style={{ background: 'oklch(0.656 0.016 78 / 0.15)' }}
      >
        {(
          [
            { id: 'sesiones', label: 'Sesiones individuales' },
            { id: 'clases', label: 'Clases grupales' },
          ] as Array<{ id: Tab; label: string }>
        ).map(({ id, label }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="px-6 py-3 text-xs tracking-wide transition-colors"
              style={{
                background: active ? 'oklch(0.21 0 0)' : 'oklch(0.962 0.005 90)',
                color: active ? 'oklch(0.979 0.004 90)' : 'oklch(0.45 0 0)',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'sesiones' ? (
        <BookingsList
          bookings={bookings}
          loading={bookingsQuery.isLoading}
          error={bookingsQuery.isError}
          onCancel={(id) => {
            if (confirm('¿Seguro que quieres cancelar esta reserva?')) {
              cancelBooking.mutate(id)
            }
          }}
          cancelPending={cancelBooking.isPending}
        />
      ) : (
        <EnrollmentsList
          enrollments={enrollments}
          loading={enrollmentsQuery.isLoading}
          error={enrollmentsQuery.isError}
          onCancel={(classId) => {
            if (confirm('¿Seguro que quieres cancelar tu inscripción?')) {
              cancelEnrollment.mutate(classId)
            }
          }}
          cancelPending={cancelEnrollment.isPending}
        />
      )}
    </div>
  )
}

function BookingsList({
  bookings,
  loading,
  error,
  onCancel,
  cancelPending,
}: {
  bookings: Booking[]
  loading: boolean
  error: boolean
  onCancel: (id: string) => void
  cancelPending: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse"
            style={{ background: 'oklch(0.962 0.005 90)' }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm" style={{ color: 'oklch(0.55 0.18 25)' }}>
        No se pudieron cargar las reservas.
      </p>
    )
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        Icon={Calendar}
        title="No tienes reservas"
        message="Reserva una sesión con uno de nuestros terapeutas."
        href="/servicios"
        cta="Explorar servicios"
      />
    )
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => {
        const canCancel =
          booking.status === 'PENDING' || booking.status === 'CONFIRMED'
        const date = new Date(booking.date)
        const isHistoric =
          booking.status === 'COMPLETED' ||
          booking.status === 'CANCELLED' ||
          booking.status === 'NO_SHOW'

        return (
          <li
            key={booking.id}
            className="p-5"
            style={{
              background: 'oklch(0.962 0.005 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.15)',
              opacity: isHistoric ? 0.7 : 1,
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs tracking-wide uppercase mb-1.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  {booking.bookingNumber}
                </p>
                <h3
                  className="text-lg mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {booking.service.name}
                </h3>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {date.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.time} · {booking.duration} min
                  </span>
                  {booking.therapist && (
                    <span className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5" />
                      {booking.therapist.firstName} {booking.therapist.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className="text-[10px] tracking-wide uppercase px-2 py-1"
                  style={{
                    background: 'oklch(0.979 0.004 90)',
                    color: STATUS_COLORS[booking.status],
                    border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                  }}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
                <p
                  className="text-base font-medium"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {booking.price.toFixed(2).replace('.', ',')}€
                </p>
              </div>
            </div>

            {booking.notes && (
              <p
                className="text-xs italic mb-4 pb-4 border-b leading-relaxed"
                style={{
                  color: 'oklch(0.45 0 0)',
                  borderColor: 'oklch(0.656 0.016 78 / 0.15)',
                }}
              >
                «{booking.notes}»
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {booking.service.slug && (
                <Link
                  href={`/servicios/${booking.service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[oklch(0.668_0.063_64)]"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  Ver servicio <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {canCancel && !isHistoric && (
                <button
                  onClick={() => onCancel(booking.id)}
                  disabled={cancelPending}
                  className="inline-flex items-center gap-1.5 text-xs transition-colors disabled:opacity-60"
                  style={{ color: 'oklch(0.55 0.18 25)' }}
                >
                  <X className="w-3 h-3" />
                  {cancelPending ? 'Cancelando...' : 'Cancelar reserva'}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function EnrollmentsList({
  enrollments,
  loading,
  error,
  onCancel,
  cancelPending,
}: {
  enrollments: ClassEnrollment[]
  loading: boolean
  error: boolean
  onCancel: (classId: string) => void
  cancelPending: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse"
            style={{ background: 'oklch(0.962 0.005 90)' }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm" style={{ color: 'oklch(0.55 0.18 25)' }}>
        No se pudieron cargar tus inscripciones.
      </p>
    )
  }

  if (enrollments.length === 0) {
    return (
      <EmptyState
        Icon={Sparkles}
        title="No tienes clases activas"
        message="Inscríbete en pilates, mindfulness o tai-chí."
        href="/clases"
        cta="Ver clases"
      />
    )
  }

  return (
    <ul className="space-y-3">
      {enrollments.map((enrollment) => {
        const canCancel = enrollment.status === 'ACTIVE'
        return (
          <li
            key={enrollment.id}
            className="p-5"
            style={{
              background: 'oklch(0.962 0.005 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.15)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: 'oklch(0.551 0.041 147)' }}
                  />
                  <p
                    className="text-xs tracking-wide uppercase"
                    style={{ color: 'oklch(0.668 0.063 64)' }}
                  >
                    {ENROLLMENT_TYPE_LABEL[enrollment.enrollmentType] ?? enrollment.enrollmentType}
                  </p>
                </div>
                <h3
                  className="text-lg mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {enrollment.class?.name ?? 'Clase'}
                </h3>
                <div
                  className="flex flex-wrap gap-x-5 gap-y-2 text-xs"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Inicio:{' '}
                    {new Date(enrollment.startDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  {enrollment.endDate && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Hasta:{' '}
                      {new Date(enrollment.endDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {enrollment.class?.schedules?.[0]?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {enrollment.class.schedules[0].location}
                    </span>
                  )}
                </div>
              </div>

              <span
                className="text-[10px] tracking-wide uppercase px-2 py-1 flex-shrink-0"
                style={{
                  background: 'oklch(0.979 0.004 90)',
                  color:
                    enrollment.status === 'ACTIVE'
                      ? 'oklch(0.551 0.041 147)'
                      : enrollment.status === 'EXPIRED'
                        ? 'oklch(0.45 0 0)'
                        : 'oklch(0.55 0.18 25)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                }}
              >
                {enrollment.status === 'ACTIVE'
                  ? 'Activa'
                  : enrollment.status === 'EXPIRED'
                    ? 'Expirada'
                    : 'Cancelada'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {enrollment.class?.slug && (
                <Link
                  href={`/clases/${enrollment.class.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[oklch(0.668_0.063_64)]"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  Ver clase <ArrowRight className="w-3 h-3" />
                </Link>
              )}
              {canCancel && (
                <button
                  onClick={() => onCancel(enrollment.classId)}
                  disabled={cancelPending}
                  className="inline-flex items-center gap-1.5 text-xs transition-colors disabled:opacity-60"
                  style={{ color: 'oklch(0.55 0.18 25)' }}
                >
                  <X className="w-3 h-3" />
                  {cancelPending ? 'Cancelando...' : 'Cancelar inscripción'}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function EmptyState({
  Icon,
  title,
  message,
  href,
  cta,
}: {
  Icon: typeof Calendar
  title: string
  message: string
  href: string
  cta: string
}) {
  return (
    <div
      className="p-12 text-center"
      style={{
        background: 'oklch(0.962 0.005 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.15)',
      }}
    >
      <Icon
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
        {title}
      </h2>
      <p
        className="text-sm mb-6 max-w-sm mx-auto"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {message}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-wide uppercase transition-colors"
        style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
      >
        {cta} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
