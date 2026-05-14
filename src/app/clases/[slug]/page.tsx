'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock, Users, X } from 'lucide-react'
import { classesApi } from '@/lib/api'
import type { GroupClass, EnrollmentType } from '@/types'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const ENROLLMENT_OPTIONS: { type: EnrollmentType; label: string; description: string }[] = [
  { type: 'SINGLE_CLASS', label: 'Clase suelta', description: 'Asiste una vez, sin compromiso' },
  { type: 'MONTHLY', label: 'Bono mensual', description: 'Todas las clases del mes' },
  { type: 'QUARTERLY', label: 'Bono trimestral', description: 'Mayor ahorro, 3 meses' },
]

const TYPE_LABELS: Record<string, string> = {
  SINGLE_CLASS: 'Clase suelta',
  MONTHLY: 'Bono mensual',
  QUARTERLY: 'Bono trimestral',
}

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// ─── Modal de confirmación ────────────────────────────────────────────────────
function ConfirmModal({
  cls,
  selectedScheduleId,
  selectedType,
  priceLabel,
  onClose,
  onConfirm,
  isPending,
  errorMessage,
}: {
  cls: GroupClass
  selectedScheduleId: string
  selectedType: EnrollmentType
  priceLabel: string
  onClose: () => void
  onConfirm: (email: string) => void
  isPending: boolean
  errorMessage?: string
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const schedule = cls.schedules.find((s) => s.id === selectedScheduleId)

  const handleSubmit = () => {
    if (!email.trim()) { setError('Introduce tu correo electrónico'); return }
    if (!validateEmail(email)) { setError('El correo no tiene un formato válido'); return }
    setError('')
    onConfirm(email)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0.21 0 0 / 0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md relative"
        style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.2)' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-[oklch(0.656_0.016_78/0.12)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                Confirmar inscripción
              </span>
            </div>
            <button onClick={onClose} className="p-1 transition-opacity hover:opacity-60" aria-label="Cerrar">
              <X className="w-4 h-4" style={{ color: 'oklch(0.45 0 0)' }} />
            </button>
          </div>
          <h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
            {cls.name}
          </h2>
        </div>

        {/* Summary */}
        <div className="px-8 py-5">
          <div
            className="p-4 mb-6 space-y-2 text-sm"
            style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.12)' }}
          >
            {schedule && (
              <div className="flex justify-between">
                <span style={{ color: 'oklch(0.656 0.016 78)' }}>Día y hora</span>
                <span className="font-medium" style={{ color: 'oklch(0.21 0 0)' }}>
                  {DAYS[schedule.dayOfWeek]} · {schedule.startTime}–{schedule.endTime}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: 'oklch(0.656 0.016 78)' }}>Modalidad</span>
              <span className="font-medium" style={{ color: 'oklch(0.21 0 0)' }}>{TYPE_LABELS[selectedType]}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[oklch(0.656_0.016_78/0.1)]">
              <span style={{ color: 'oklch(0.656 0.016 78)' }}>Precio</span>
              <span className="font-medium" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}>
                {priceLabel}
              </span>
            </div>
          </div>

          {/* Email input */}
          <label className="block mb-1.5 text-sm font-medium" style={{ color: 'oklch(0.21 0 0)' }}>
            Correo para la confirmación
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            placeholder="tu@correo.com"
            autoFocus
            className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
            style={{
              background: 'oklch(0.99 0.004 90)',
              border: `1px solid ${error ? 'oklch(0.55 0.18 25)' : 'oklch(0.656 0.016 78 / 0.3)'}`,
              color: 'oklch(0.21 0 0)',
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          />
          {error && (
            <p className="mt-1.5 text-xs" style={{ color: 'oklch(0.55 0.18 25)' }}>{error}</p>
          )}
          <p className="mt-2 text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
            Te enviaremos la confirmación a esta dirección.
          </p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8">
          {errorMessage && (
            <div
              className="p-3 mb-4 text-xs"
              style={{
                background: 'oklch(0.96 0.05 25)',
                border: '1px solid oklch(0.6 0.18 25 / 0.3)',
                color: 'oklch(0.4 0.18 25)',
              }}
            >
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-3 text-sm border transition-colors disabled:opacity-50"
            style={{ borderColor: 'oklch(0.656 0.016 78 / 0.3)', color: 'oklch(0.45 0 0)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 text-sm font-medium tracking-wide transition-all disabled:opacity-60"
            style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
          >
            {isPending ? 'Procesando…' : 'Confirmar inscripción'}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ClaseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedType, setSelectedType] = useState<EnrollmentType>('SINGLE_CLASS')
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [enrollSuccess, setEnrollSuccess] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['class', slug],
    queryFn: () => classesApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  })

  const cls: GroupClass | undefined = data?.data?.class

  // Auto-seleccionar el primer horario disponible
  useEffect(() => {
    if (cls?.schedules?.length && !selectedScheduleId) {
      const first = cls.schedules.find(
        (s) => (cls.activeEnrollments ?? 0) < s.maxStudents
      ) ?? cls.schedules[0]
      setSelectedScheduleId(first.id)
    }
  }, [cls, selectedScheduleId])

  const {
    mutate: enroll,
    isPending,
    isError: isEnrollError,
    error: enrollError,
    reset: resetEnroll,
  } = useMutation({
    mutationFn: (confirmationEmail: string) =>
      classesApi.enroll(cls!.id, {
        enrollmentType: selectedType,
        scheduleId: selectedScheduleId || undefined,
        confirmationEmail,
      }),
    onSuccess: () => {
      setEnrollSuccess(true)
      setShowModal(false)
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['class', slug] })
    },
  })

  const closeModal = () => {
    setShowModal(false)
    resetEnroll()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="h-64 animate-pulse mb-10" style={{ background: 'oklch(0.9 0.003 90)' }} />
        </div>
      </div>
    )
  }

  if (isError || !cls) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
          Clase no encontrada
        </h1>
        <Link href="/clases" className="text-sm underline" style={{ color: 'oklch(0.668 0.063 64)' }}>
          ← Volver a clases
        </Link>
      </div>
    )
  }

  const priceForType =
    selectedType === 'MONTHLY' && cls.priceMonthly ? cls.priceMonthly
    : selectedType === 'QUARTERLY' && cls.priceMonthly ? cls.priceMonthly * 2.5
    : cls.pricePerSession

  const priceLabel =
    selectedType === 'SINGLE_CLASS' ? `${cls.pricePerSession.toFixed(0)}€ / sesión`
    : selectedType === 'MONTHLY' && cls.priceMonthly ? `${cls.priceMonthly.toFixed(0)}€ / mes`
    : `${(cls.priceMonthly! * 2.5).toFixed(0)}€ / trimestre`

  const totalActive = cls.activeEnrollments ?? 0

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Modal */}
      {showModal && (
        <ConfirmModal
          cls={cls}
          selectedScheduleId={selectedScheduleId}
          selectedType={selectedType}
          priceLabel={priceLabel}
          onClose={closeModal}
          onConfirm={(email) => enroll(email)}
          isPending={isPending}
          errorMessage={isEnrollError ? (enrollError as Error)?.message : undefined}
        />
      )}

      {/* Breadcrumb */}
      <div className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]" style={{ background: 'oklch(0.962 0.005 90)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/clases" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">Clases</Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{cls.name}</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-64 lg:h-96 overflow-hidden" style={{ background: 'oklch(0.551 0.041 147 / 0.1)' }}>
        {cls.images?.[0] ? (
          <Image src={cls.images[0]} alt={cls.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '10rem', color: 'oklch(0.551 0.041 147 / 0.1)', lineHeight: 1 }}>
              {cls.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, oklch(0.21 0 0 / 0.5) 0%, transparent 60%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">

          {/* Content */}
          <div>
            <Link href="/clases" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'oklch(0.656 0.016 78)' }}>
              <ArrowLeft className="w-4 h-4" /> Todas las clases
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>Clase grupal</span>
            </div>
            <h1 className="text-3xl lg:text-4xl mb-6" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
              {cls.name}
            </h1>

            {cls.shortDescription && (
              <p className="text-base lg:text-lg leading-relaxed mb-10" style={{ color: 'oklch(0.45 0 0)' }}>
                {cls.shortDescription}
              </p>
            )}

            {/* Schedules — seleccionables */}
            {cls.schedules.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Horarios
                </h2>
                <p className="text-xs mb-5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  Selecciona el día al que quieres asistir.
                </p>
                <div className="space-y-2">
                  {cls.schedules.map((s) => {
                    const isFull = totalActive >= s.maxStudents
                    const isSelected = s.id === selectedScheduleId
                    return (
                      <button
                        key={s.id}
                        disabled={isFull}
                        onClick={() => !isFull && setSelectedScheduleId(s.id)}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-150 disabled:cursor-not-allowed"
                        style={{
                          background: isSelected ? 'oklch(0.551 0.041 147 / 0.06)' : 'oklch(0.962 0.005 90)',
                          border: `1px solid ${isSelected ? 'oklch(0.551 0.041 147 / 0.4)' : 'oklch(0.656 0.016 78 / 0.12)'}`,
                          opacity: isFull ? 0.55 : 1,
                        }}
                      >
                        {/* Selector circle */}
                        <span
                          className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: isSelected ? 'oklch(0.551 0.041 147)' : 'oklch(0.656 0.016 78 / 0.4)',
                          }}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.551 0.041 147)' }} />
                          )}
                        </span>

                        <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: isFull ? 'oklch(0.656 0.016 78 / 0.5)' : 'oklch(0.668 0.063 64)' }} />

                        <div className="flex-1">
                          <span className="text-sm font-medium" style={{ color: 'oklch(0.21 0 0)' }}>
                            {DAYS[s.dayOfWeek]}
                          </span>
                          {s.location && (
                            <span className="text-xs ml-3" style={{ color: 'oklch(0.656 0.016 78)' }}>
                              {s.location}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                          <Clock className="w-3.5 h-3.5" />
                          {s.startTime} – {s.endTime}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs ml-2" style={{ color: isFull ? 'oklch(0.55 0.18 25)' : 'oklch(0.656 0.016 78)' }}>
                          <Users className="w-3.5 h-3.5" />
                          {isFull
                            ? <span className="font-medium" style={{ color: 'oklch(0.55 0.18 25)' }}>Completo</span>
                            : <span>{totalActive}/{s.maxStudents}</span>
                          }
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {cls.description && (
              <div className="pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
                <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Sobre esta clase
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'oklch(0.45 0 0)' }}>
                  {cls.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            {cls.benefits && cls.benefits.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
                <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Beneficios
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cls.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.551 0.041 147)' }} />
                      <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28 self-start space-y-4">
            <div className="p-8" style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.2)' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="rule-cobre" />
                <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                  Inscripción
                </span>
              </div>

              {/* Enrollment type */}
              <div className="space-y-2 mb-6">
                {ENROLLMENT_OPTIONS.filter(opt =>
                  opt.type === 'SINGLE_CLASS' ||
                  (opt.type === 'MONTHLY' && cls.priceMonthly) ||
                  (opt.type === 'QUARTERLY' && cls.priceMonthly)
                ).map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className="w-full text-left px-4 py-3 transition-all duration-200"
                    style={{
                      background: selectedType === opt.type ? 'oklch(0.979 0.004 90)' : 'transparent',
                      border: `1px solid ${selectedType === opt.type ? 'oklch(0.668 0.063 64)' : 'oklch(0.656 0.016 78 / 0.2)'}`,
                    }}
                  >
                    <p className="text-sm font-medium mb-0.5" style={{ color: 'oklch(0.21 0 0)' }}>{opt.label}</p>
                    <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>{opt.description}</p>
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}>
                  {priceForType.toFixed(0)}€
                </span>
                <span className="text-sm mb-1" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  {selectedType === 'SINGLE_CLASS' ? '/ sesión' : selectedType === 'MONTHLY' ? '/ mes' : '/ trimestre'}
                </span>
              </div>

              {/* CTA */}
              {enrollSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: 'oklch(0.21 0 0)' }}>
                    ¡Inscripción realizada!
                  </p>
                  <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                    Revisa tu correo para la confirmación.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    resetEnroll()
                    setShowModal(true)
                  }}
                  disabled={!selectedScheduleId || cls.schedules.every(s => (totalActive) >= s.maxStudents)}
                  className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
                >
                  Inscribirse ahora <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <hr className="border-[oklch(0.656_0.016_78/0.15)] my-5" />
              <ul className="space-y-2 text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                <li>✓ Grupos reducidos (máx. {cls.schedules[0]?.maxStudents ?? 12} personas)</li>
                <li>✓ Instructores certificados</li>
                <li>✓ Cancelación 24h antes</li>
              </ul>
            </div>

            <Link
              href="/contacto"
              className="flex items-center justify-between w-full p-5 group transition-colors duration-200"
              style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
            >
              <p className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>¿Tienes dudas sobre esta clase?</p>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'oklch(0.668 0.063 64)' }} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
