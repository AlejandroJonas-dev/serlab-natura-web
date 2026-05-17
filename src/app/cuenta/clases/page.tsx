'use client'

import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Calendar, Clock, MapPin, Sparkles, X } from 'lucide-react'
import { classesApi } from '@/lib/api'
import type { ClassEnrollment } from '@/types'

const ENROLLMENT_TYPE_LABEL: Record<string, string> = {
  SINGLE_CLASS: 'Sesión única',
  MONTHLY: 'Bono mensual',
  QUARTERLY: 'Bono trimestral',
}

export default function MisClasesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => classesApi.getMyEnrollments().then((r) => r.data),
  })

  const cancelEnrollment = useMutation({
    mutationFn: (classId: string) => classesApi.cancelEnrollment(classId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-enrollments'] }),
  })

  const enrollments: ClassEnrollment[] = data?.data?.enrollments ?? []

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="rule-cobre" />
        <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
          Tus inscripciones
        </span>
      </div>
      <h1
        className="text-3xl lg:text-4xl mb-8"
        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
      >
        Mis clases
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 animate-pulse" style={{ background: 'oklch(0.962 0.005 90)' }} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm" style={{ color: 'oklch(0.55 0.18 25)' }}>
          No se pudieron cargar tus inscripciones.
        </p>
      ) : enrollments.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
        >
          <Sparkles className="w-12 h-12 mx-auto mb-5" style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }} />
          <h2
            className="text-lg mb-2"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            No tienes clases activas
          </h2>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'oklch(0.45 0 0)' }}>
            Inscríbete en pilates, mindfulness o tai-chí.
          </p>
          <Link
            href="/clases"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-wide uppercase transition-colors"
            style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
          >
            Ver clases <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {enrollments.map((enrollment) => {
            const canCancel = enrollment.status === 'ACTIVE'
            return (
              <li
                key={enrollment.id}
                className="p-5"
                style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" style={{ color: 'oklch(0.551 0.041 147)' }} />
                      <p className="text-xs tracking-wide uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                        {ENROLLMENT_TYPE_LABEL[enrollment.enrollmentType] ?? enrollment.enrollmentType}
                      </p>
                    </div>
                    <h3
                      className="text-lg mb-2"
                      style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                    >
                      {enrollment.class?.name ?? 'Clase'}
                    </h3>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Inicio:{' '}
                        {new Date(enrollment.startDate).toLocaleDateString('es-ES', {
                          day: '2-digit', month: 'long', year: 'numeric',
                        })}
                      </span>
                      {enrollment.endDate && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Hasta:{' '}
                          {new Date(enrollment.endDate).toLocaleDateString('es-ES', {
                            day: '2-digit', month: 'long', year: 'numeric',
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
                    {enrollment.status === 'ACTIVE' ? 'Activa' : enrollment.status === 'EXPIRED' ? 'Expirada' : 'Cancelada'}
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
                      onClick={() => {
                        if (confirm('¿Seguro que quieres cancelar tu inscripción?')) {
                          cancelEnrollment.mutate(enrollment.classId)
                        }
                      }}
                      disabled={cancelEnrollment.isPending}
                      className="inline-flex items-center gap-1.5 text-xs transition-colors disabled:opacity-60"
                      style={{ color: 'oklch(0.55 0.18 25)' }}
                    >
                      <X className="w-3 h-3" />
                      {cancelEnrollment.isPending ? 'Cancelando...' : 'Cancelar inscripción'}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
