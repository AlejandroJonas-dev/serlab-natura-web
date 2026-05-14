'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Phone, X } from 'lucide-react'
import { servicesApi, bookingsApi } from '@/lib/api'
import type { Service } from '@/types'

const DEFAULT_BENEFITS = [
  'Evaluación inicial personalizada',
  'Técnicas profesionales certificadas',
  'Espacio tranquilo y cuidado al detalle',
  'Tratamiento adaptado a tus necesidades',
  'Recomendaciones post-sesión',
  'Seguimiento de tu evolución',
]

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const todayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

// ─── Modal de reserva ─────────────────────────────────────────────────────────
function BookingModal({
  service,
  onClose,
  onSuccess,
}: {
  service: Service
  onClose: () => void
  onSuccess: () => void
}) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        serviceId: service.id,
        date,
        time,
        notes: notes || undefined,
        confirmationEmail: email,
      }),
    onSuccess,
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!date) e.date = 'Selecciona una fecha'
    if (!time) e.time = 'Indica la hora preferida'
    if (!email.trim()) e.email = 'Introduce tu correo electrónico'
    else if (!validateEmail(email)) e.email = 'El correo no tiene un formato válido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) mutate()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'oklch(0.21 0 0 / 0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md relative my-4"
        style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.2)' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-[oklch(0.656_0.016_78/0.12)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                Reservar sesión
              </span>
            </div>
            <button onClick={onClose} className="p-1 transition-opacity hover:opacity-60" aria-label="Cerrar">
              <X className="w-4 h-4" style={{ color: 'oklch(0.45 0 0)' }} />
            </button>
          </div>
          <h2 className="text-xl mt-3" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
            {service.name}
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-lg" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}>
              {service.price.toFixed(0)}€
            </span>
            {service.duration && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                <Clock className="w-3.5 h-3.5" /> {service.duration} min
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">
          {isError && (
            <div
              className="p-3 text-xs"
              style={{ background: 'oklch(0.96 0.05 25)', border: '1px solid oklch(0.6 0.18 25 / 0.3)', color: 'oklch(0.4 0.18 25)' }}
            >
              {(error as Error)?.message ?? 'Error al realizar la reserva. Inténtalo de nuevo.'}
            </div>
          )}

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.21 0 0)' }}>
              Fecha preferida
            </label>
            <input
              type="date"
              value={date}
              min={todayStr()}
              onChange={(e) => { setDate(e.target.value); setErrors(p => ({ ...p, date: '' })) }}
              className="w-full px-4 py-3 text-sm focus:outline-none"
              style={{
                background: 'oklch(0.99 0.004 90)',
                border: `1px solid ${errors.date ? 'oklch(0.55 0.18 25)' : 'oklch(0.656 0.016 78 / 0.3)'}`,
                color: 'oklch(0.21 0 0)',
              }}
            />
            {errors.date && <p className="mt-1 text-xs" style={{ color: 'oklch(0.55 0.18 25)' }}>{errors.date}</p>}
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.21 0 0)' }}>
              Hora preferida
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => { setTime(e.target.value); setErrors(p => ({ ...p, time: '' })) }}
              className="w-full px-4 py-3 text-sm focus:outline-none"
              style={{
                background: 'oklch(0.99 0.004 90)',
                border: `1px solid ${errors.time ? 'oklch(0.55 0.18 25)' : 'oklch(0.656 0.016 78 / 0.3)'}`,
                color: 'oklch(0.21 0 0)',
              }}
            />
            {errors.time && <p className="mt-1 text-xs" style={{ color: 'oklch(0.55 0.18 25)' }}>{errors.time}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.21 0 0)' }}>
              Correo para la confirmación
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 text-sm focus:outline-none"
              style={{
                background: 'oklch(0.99 0.004 90)',
                border: `1px solid ${errors.email ? 'oklch(0.55 0.18 25)' : 'oklch(0.656 0.016 78 / 0.3)'}`,
                color: 'oklch(0.21 0 0)',
              }}
            />
            {errors.email && <p className="mt-1 text-xs" style={{ color: 'oklch(0.55 0.18 25)' }}>{errors.email}</p>}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'oklch(0.21 0 0)' }}>
              Comentarios <span className="font-normal" style={{ color: 'oklch(0.656 0.016 78)' }}>(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Alguna indicación especial, lesión o preferencia?"
              rows={3}
              className="w-full px-4 py-3 text-sm focus:outline-none resize-none"
              style={{
                background: 'oklch(0.99 0.004 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.3)',
                color: 'oklch(0.21 0 0)',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
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
            style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
          >
            {isPending ? 'Enviando…' : 'Confirmar reserva'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [showModal, setShowModal] = useState(false)
  const [bookSuccess, setBookSuccess] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => servicesApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  })

  const service: Service | undefined = data?.data?.service

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16">
            <div className="space-y-6">
              <div className="h-4 w-32 rounded animate-pulse" style={{ background: 'oklch(0.9 0.003 90)' }} />
              <div className="aspect-[16/7] animate-pulse rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
            </div>
            <div className="h-64 animate-pulse rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
          Servicio no encontrado
        </h1>
        <Link href="/servicios" className="text-sm underline" style={{ color: 'oklch(0.668 0.063 64)' }}>
          ← Volver a servicios
        </Link>
      </div>
    )
  }

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {showModal && (
        <BookingModal
          service={service}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); setBookSuccess(true) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]" style={{ background: 'oklch(0.962 0.005 90)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/servicios" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">Servicios</Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{service.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">

          {/* Left: Content */}
          <div>
            <Link href="/servicios" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'oklch(0.656 0.016 78)' }}>
              <ArrowLeft className="w-4 h-4" /> Todos los servicios
            </Link>

            {/* Image */}
            <div
              className="aspect-[16/7] overflow-hidden mb-10 relative"
              style={{ background: 'oklch(0.551 0.041 147 / 0.08)', border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
            >
              {service.images?.[0] ? (
                <Image src={service.images[0]} alt={service.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '8rem', color: 'oklch(0.551 0.041 147 / 0.1)', lineHeight: 1 }}>
                    {service.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {service.category && (
              <div className="flex items-center gap-3 mb-4">
                <span className="rule-cobre" />
                <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                  {service.category.name}
                </span>
              </div>
            )}

            <h1 className="text-3xl lg:text-4xl mb-6" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
              {service.name}
            </h1>

            {service.shortDescription && (
              <p className="text-base lg:text-lg leading-relaxed mb-10" style={{ color: 'oklch(0.45 0 0)' }}>
                {service.shortDescription}
              </p>
            )}

            {service.description && (
              <div className="pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
                <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Sobre este tratamiento
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'oklch(0.45 0 0)' }}>
                  {service.description}
                </p>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
              <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                ¿Qué incluye?
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {DEFAULT_BENEFITS.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.551 0.041 147)' }} />
                    <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="p-8" style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.2)' }}>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}>
                  {service.price.toFixed(0)}€
                </span>
                <span className="text-sm mb-1" style={{ color: 'oklch(0.656 0.016 78)' }}>/ sesión</span>
              </div>

              {service.duration && (
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>{service.duration} minutos de sesión</span>
                </div>
              )}

              <hr className="border-[oklch(0.656_0.016_78/0.15)] mb-6" />

              {bookSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: 'oklch(0.21 0 0)' }}>
                    ¡Reserva solicitada!
                  </p>
                  <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                    Revisa tu correo para la confirmación. Nos pondremos en contacto para confirmar el horario.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide mb-3 transition-all duration-300"
                  style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
                >
                  Reservar sesión <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {!bookSuccess && (
                <a
                  href={`https://wa.me/34604230456?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20sesi%C3%B3n%20de%20${encodeURIComponent(service.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide border transition-colors duration-300 text-[oklch(0.21_0_0)] hover:bg-[oklch(0.21_0_0)] hover:text-[oklch(0.979_0.004_90)]"
                  style={{ borderColor: 'oklch(0.21 0 0)' }}
                >
                  <Phone className="w-4 h-4" /> Consultar por WhatsApp
                </a>
              )}

              <hr className="border-[oklch(0.656_0.016_78/0.15)] my-6" />
              <ul className="space-y-2.5 text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                <li>✓ Atención personalizada garantizada</li>
                <li>✓ Cancelación gratuita 24h antes</li>
                <li>✓ Sesión en instalaciones Serlab Natura</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
