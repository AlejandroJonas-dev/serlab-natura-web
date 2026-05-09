'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, MessageSquare, Star, X } from 'lucide-react'
import { reviewsApi } from '@/lib/api'
import type { Review } from '@/types'

type Tab = 'pending' | 'approved'

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<Tab>('pending')
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const pendingQuery = useQuery({
    queryKey: ['admin-reviews-pending'],
    queryFn: () => reviewsApi.getPending().then((r) => r.data),
  })

  const approve = useMutation({
    mutationFn: (id: string) => reviewsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      reviewsApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const reviews: Review[] = pendingQuery.data?.data?.reviews ?? []

  return (
    <div className="max-w-[1100px] mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Moderación de reseñas
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Reseñas
        </h1>
      </header>

      {/* Tabs */}
      <div
        className="inline-flex mb-6"
        style={{ background: 'oklch(0.656 0.016 78 / 0.15)', gap: '1px' }}
      >
        {(
          [
            { id: 'pending', label: 'Pendientes', count: reviews.length },
            { id: 'approved', label: 'Aprobadas' },
          ] as Array<{ id: Tab; label: string; count?: number }>
        ).map(({ id, label, count }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="px-5 py-2.5 text-xs tracking-wide transition-colors flex items-center gap-2"
              style={{
                background: active ? 'oklch(0.21 0 0)' : 'oklch(0.99 0.004 90)',
                color: active ? 'oklch(0.979 0.004 90)' : 'oklch(0.45 0 0)',
              }}
            >
              {label}
              {typeof count === 'number' && count > 0 && (
                <span
                  className="text-[10px] tabular-nums px-1.5 py-0.5"
                  style={{
                    background: active
                      ? 'oklch(0.668 0.063 64)'
                      : 'oklch(0.668 0.063 64 / 0.15)',
                    color: active ? 'oklch(0.979 0.004 90)' : 'oklch(0.668 0.063 64)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {(approve.isError || reject.isError) && (
        <div
          className="mb-4 p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(approve.error || reject.error) instanceof Error
            ? (approve.error as Error)?.message ??
              (reject.error as Error)?.message
            : 'Error al moderar la reseña'}
        </div>
      )}

      {tab === 'pending' ? (
        pendingQuery.isLoading ? (
          <Skeleton />
        ) : pendingQuery.isError ? (
          <ErrorBox message="No se pudieron cargar las reseñas pendientes." />
        ) : reviews.length === 0 ? (
          <EmptyState
            title="Todo al día"
            message="No hay reseñas pendientes de moderación."
          />
        ) : (
          <ul className="space-y-3">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="p-5"
                style={{
                  background: 'oklch(0.99 0.004 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.18)',
                }}
              >
                <header className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                    >
                      {new Date(review.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      ·{' '}
                      {review.productId
                        ? 'Producto'
                        : review.serviceId
                          ? 'Servicio'
                          : 'Reseña'}
                    </p>
                  </div>
                  <Stars rating={review.rating} />
                </header>

                {review.comment && (
                  <blockquote
                    className="text-sm italic leading-relaxed pl-4 border-l-2 mb-5"
                    style={{
                      color: 'oklch(0.21 0 0)',
                      borderColor: 'oklch(0.668 0.063 64 / 0.4)',
                    }}
                  >
                    «{review.comment}»
                  </blockquote>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={rejectReason[review.id] ?? ''}
                    onChange={(e) =>
                      setRejectReason((prev) => ({
                        ...prev,
                        [review.id]: e.target.value,
                      }))
                    }
                    placeholder="Motivo de rechazo (opcional)"
                    className="flex-1 px-3 py-2 text-xs focus:outline-none"
                    style={{
                      background: 'oklch(0.96 0.005 90)',
                      border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                      color: 'oklch(0.21 0 0)',
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        reject.mutate({
                          id: review.id,
                          reason: rejectReason[review.id]?.trim() || undefined,
                        })
                      }
                      disabled={reject.isPending}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                      style={{
                        color: 'oklch(0.55 0.18 25)',
                        border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                      }}
                    >
                      <X className="w-3.5 h-3.5" /> Rechazar
                    </button>
                    <button
                      onClick={() => approve.mutate(review.id)}
                      disabled={approve.isPending}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                      style={{
                        background: 'oklch(0.551 0.041 147)',
                        color: 'oklch(0.979 0.004 90)',
                      }}
                    >
                      <Check className="w-3.5 h-3.5" /> Aprobar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <EmptyState
          title="Reseñas aprobadas"
          message="Esta vista mostrará el histórico de reseñas aprobadas — el endpoint estará disponible pronto."
        />
      )}
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className="w-4 h-4"
          fill={n <= rating ? 'oklch(0.668 0.063 64)' : 'transparent'}
          style={{
            color:
              n <= rating
                ? 'oklch(0.668 0.063 64)'
                : 'oklch(0.656 0.016 78 / 0.4)',
          }}
        />
      ))}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse"
          style={{ background: 'oklch(0.94 0.005 90)' }}
        />
      ))}
    </div>
  )
}

function EmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div
      className="p-12 text-center"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <MessageSquare
        className="w-10 h-10 mx-auto mb-4"
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
        className="text-sm max-w-sm mx-auto"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
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
