'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, Phone } from 'lucide-react'
import { servicesApi } from '@/lib/api'
import type { Service } from '@/types'

const DEFAULT_BENEFITS = [
  'Evaluación inicial personalizada',
  'Técnicas profesionales certificadas',
  'Espacio tranquilo y cuidado al detalle',
  'Tratamiento adaptado a tus necesidades',
  'Recomendaciones post-sesión',
  'Seguimiento de tu evolución',
]

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params.slug as string

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
              <div className="h-8 w-2/3 animate-pulse rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
            </div>
            <div className="h-64 animate-pulse rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !service) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'oklch(0.979 0.004 90)' }}
      >
        <h1
          className="text-2xl"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          Servicio no encontrado
        </h1>
        <Link
          href="/servicios"
          className="text-sm underline"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          ← Volver a servicios
        </Link>
      </div>
    )
  }

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Breadcrumb */}
      <div
        className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/servicios" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Servicios
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{service.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">

          {/* Left: Content */}
          <div>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-150"
              style={{ color: 'oklch(0.656 0.016 78)' }}
            >
              <ArrowLeft className="w-4 h-4" /> Todos los servicios
            </Link>

            {/* Image */}
            <div
              className="aspect-[16/7] overflow-hidden mb-10 relative"
              style={{
                background: 'oklch(0.551 0.041 147 / 0.08)',
                border: '1px solid oklch(0.656 0.016 78 / 0.1)',
              }}
            >
              {service.images?.[0] ? (
                <img
                  src={service.images[0]}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: '8rem',
                      color: 'oklch(0.551 0.041 147 / 0.1)',
                      lineHeight: 1,
                    }}
                  >
                    {service.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Eyebrow */}
            {service.category && (
              <div className="flex items-center gap-3 mb-4">
                <span className="rule-cobre" />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {service.category.name}
                </span>
              </div>
            )}

            <h1
              className="text-3xl lg:text-4xl mb-6"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              {service.name}
            </h1>

            {service.shortDescription && (
              <p
                className="text-base lg:text-lg leading-relaxed mb-10"
                style={{ color: 'oklch(0.45 0 0)' }}
              >
                {service.shortDescription}
              </p>
            )}

            {service.description && (
              <div className="pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
                <h2
                  className="text-xl mb-5"
                  style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                >
                  Sobre este tratamiento
                </h2>
                <p
                  className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  {service.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            <div className="mt-12 pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
              <h2
                className="text-xl mb-6"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
              >
                ¿Qué incluye?
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {DEFAULT_BENEFITS.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: 'oklch(0.551 0.041 147)' }}
                    />
                    <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="lg:sticky lg:top-28 self-start">
            <div
              className="p-8"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              }}
            >
              <div className="flex items-end gap-2 mb-2">
                <span
                  className="text-4xl"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.668 0.063 64)',
                  }}
                >
                  {service.price.toFixed(0)}€
                </span>
                <span className="text-sm mb-1" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  / sesión
                </span>
              </div>

              {service.duration && (
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                    {service.duration} minutos de sesión
                  </span>
                </div>
              )}

              <hr className="border-[oklch(0.656_0.016_78/0.15)] mb-6" />

              <Link
                href={`/contacto?servicio=${encodeURIComponent(service.name)}`}
                className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide mb-3 transition-all duration-300"
                style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
              >
                Reservar sesión <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/34604230456?text=Hola%2C%20me%20gustar%C3%ADa%20reservar%20una%20sesi%C3%B3n%20de%20Serlab%20Natura."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide border transition-colors duration-300 hover:bg-[oklch(0.21_0_0)] hover:text-[oklch(0.979_0.004_90)]"
                style={{ borderColor: 'oklch(0.21 0 0)', color: 'oklch(0.21 0 0)' }}
              >
                <Phone className="w-4 h-4" /> Consultar por WhatsApp
              </a>

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
