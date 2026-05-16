'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { servicesApi } from '@/lib/api'
import type { Service } from '@/types'
import { useReveal } from '@/hooks/useReveal'

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className={`reveal reveal-delay-${Math.min(index + 1, 6)} group relative flex flex-col card-lift overflow-hidden`}
      style={{
        background: 'oklch(0.979 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.15)',
      }}
    >
      <div
        className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: 'oklch(0.668 0.063 64)' }}
        aria-hidden
      />

      {/* Background initial */}
      <span
        aria-hidden
        className="absolute bottom-3 right-4 leading-none select-none pointer-events-none italic"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: '7rem',
          color: 'oklch(0.21 0 0 / 0.04)',
        }}
      >
        {service.name.charAt(0)}
      </span>

      <div className="relative p-7 flex flex-col flex-1">
        {service.category && (
          <span
            className="text-xs tracking-[0.15em] uppercase mb-3"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            {service.category.name}
          </span>
        )}
        <h3
          className="text-lg mb-3 leading-snug"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          {service.name}
        </h3>
        <p className="text-sm leading-relaxed text-[oklch(0.45_0_0)] mb-5 flex-1 line-clamp-3">
          {service.shortDescription ?? service.description ?? ''}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-[oklch(0.656_0.016_78/0.12)]">
          <div>
            <span
              className="text-lg"
              style={{ color: 'oklch(0.668 0.063 64)', fontFamily: 'var(--font-playfair), serif' }}
            >
              {service.price.toFixed(0)}€
            </span>
            {service.duration && (
              <span className="text-xs text-[oklch(0.656_0.016_78)] ml-1">
                / {service.duration} min
              </span>
            )}
          </div>
          <span
            className="flex items-center gap-1 text-xs tracking-wide transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: 'oklch(0.21 0 0)' }}
          >
            Reservar <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ServiceCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
    >
      <div className="p-7 space-y-3">
        <div className="h-2.5 w-20 rounded-sm" style={{ background: 'oklch(0.9 0.003 90)' }} />
        <div className="h-5 w-40 rounded-sm" style={{ background: 'oklch(0.9 0.003 90)' }} />
        <div className="h-3 w-full rounded-sm" style={{ background: 'oklch(0.9 0.003 90)' }} />
        <div className="h-3 w-3/4 rounded-sm" style={{ background: 'oklch(0.9 0.003 90)' }} />
      </div>
    </div>
  )
}

const PLACEHOLDER_SERVICES = [
  { name: 'Radiofrecuencia INDIBA', cat: 'Estética avanzada', desc: 'Rejuvenecimiento facial y corporal sin cirugía. Estimula el colágeno y la circulación.', price: 80, duration: 60 },
  { name: 'Hydrafacial', cat: 'Estética avanzada', desc: 'Limpieza facial avanzada que combina exfoliación, extracción y nutrición en una sola sesión.', price: 65, duration: 50 },
  { name: 'Reflexología podal', cat: 'Terapias naturales', desc: 'Libera bloqueos físicos y emocionales. Reduce estrés, favorece el sueño.', price: 55, duration: 60 },
  { name: 'Masaje metamórfico', cat: 'Masajes', desc: 'Técnica sutil sobre pies, manos y cabeza que facilita la liberación emocional profunda.', price: 50, duration: 45 },
  { name: 'Mindfulness individual', cat: 'Terapias naturales', desc: 'Acompañamiento terapéutico desde la atención plena. Gestión del estrés y ansiedad.', price: 60, duration: 60 },
  { name: 'Masaje relajante', cat: 'Masajes', desc: 'Recupera el equilibrio muscular y mental con nuestras técnicas de masaje profesional.', price: 45, duration: 60 },
]

function PlaceholderCard({ service, index }: { service: (typeof PLACEHOLDER_SERVICES)[0]; index: number }) {
  return (
    <Link
      href="/servicios"
      className={`reveal reveal-delay-${Math.min(index + 1, 6)} group relative flex flex-col card-lift overflow-hidden`}
      style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
    >
      <div
        className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: 'oklch(0.668 0.063 64)' }}
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute bottom-3 right-4 leading-none select-none pointer-events-none italic"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: '7rem',
          color: 'oklch(0.21 0 0 / 0.04)',
        }}
      >
        {service.name.charAt(0)}
      </span>
      <div className="relative p-7 flex flex-col flex-1">
        <span
          className="text-xs tracking-[0.15em] uppercase mb-3"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          {service.cat}
        </span>
        <h3
          className="text-lg mb-3 leading-snug"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          {service.name}
        </h3>
        <p className="text-sm leading-relaxed text-[oklch(0.45_0_0)] mb-5 flex-1 line-clamp-3">
          {service.desc}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-[oklch(0.656_0.016_78/0.12)]">
          <div>
            <span
              className="text-lg"
              style={{ color: 'oklch(0.668 0.063 64)', fontFamily: 'var(--font-playfair), serif' }}
            >
              {service.price}€
            </span>
            <span className="text-xs text-[oklch(0.656_0.016_78)] ml-1">/ {service.duration} min</span>
          </div>
          <span
            className="flex items-center gap-1 text-xs tracking-wide transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: 'oklch(0.21 0 0)' }}
          >
            Reservar <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ServicesSection() {
  const sectionRef = useReveal()

  const { data, isLoading } = useQuery({
    queryKey: ['services', 'featured'],
    queryFn: () => servicesApi.getAll({ isFeatured: true, limit: 6 }).then((r) => r.data),
  })

  const services: Service[] = data?.data?.services ?? []

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32"
      style={{ background: 'oklch(0.962 0.005 90)' }}
      aria-labelledby="servicios-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                Nuestras terapias
              </span>
            </div>
            <h2
              className="text-3xl lg:text-4xl"
              id="servicios-heading"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              Terapias naturales que inspiran,
              <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
                tratamientos que transforman.
              </em>
            </h2>
          </div>
          <Link
            href="/servicios"
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm tracking-wide link-underline link-underline-cobre transition-colors duration-200"
            style={{ color: 'oklch(0.21 0 0)' }}
          >
            Ver todos los servicios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : services.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_SERVICES.map((s, i) => (
              <PlaceholderCard key={s.name} service={s} index={i} />
            ))}
          </div>
        )}

        <div className="reveal mt-12 text-center">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium tracking-wide text-[oklch(0.979_0.004_90)] transition-all duration-300"
            style={{ background: 'oklch(0.551 0.041 147)' }}
          >
            Reservar sesión <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
