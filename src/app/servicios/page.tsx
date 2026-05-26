'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { servicesApi, serviceCategoriesApi } from '@/lib/api'
import type { Service, ServiceCategory } from '@/types'

function MonogramPlaceholder({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden select-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            oklch(0.21 0 0 / 0.025) 10px,
            oklch(0.21 0 0 / 0.025) 11px
          )`,
        }}
      />
      <span
        className="relative leading-none italic"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: '7rem',
          color: 'oklch(0.21 0 0 / 0.1)',
          letterSpacing: '-0.02em',
        }}
      >
        {name.charAt(0)}
      </span>
      <span
        className="relative mt-4 text-[9px] tracking-[0.4em] uppercase"
        style={{ color: 'oklch(0.668 0.063 64 / 0.6)' }}
      >
        Serlab Natura
      </span>
    </div>
  )
}

function ServiceCard({
  service,
  index,
  featured = false,
}: {
  service: Service
  index: number
  featured?: boolean
}) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className={`reveal reveal-delay-${Math.min((index % 6) + 1, 6)} group relative flex flex-col overflow-hidden${featured ? ' sm:col-span-2' : ''}`}
      style={{
        background: 'oklch(0.979 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.15)',
      }}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden editorial-img${featured ? ' aspect-[16/9]' : ' aspect-[4/3]'}`}
        style={{
          background:
            'linear-gradient(135deg, oklch(0.551 0.041 147 / 0.1) 0%, oklch(0.668 0.063 64 / 0.07) 100%)',
        }}
      >
        {service.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105"
          />
        ) : (
          <MonogramPlaceholder name={service.name} />
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'oklch(0.668 0.063 64 / 0.08)' }}
          aria-hidden
        />
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{ background: 'oklch(0.668 0.063 64)' }}
        aria-hidden
      />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {service.category && (
          <span
            className="text-[10px] tracking-[0.22em] uppercase mb-2"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            {service.category.name}
          </span>
        )}
        <h3
          className={`leading-snug mb-2${featured ? ' text-2xl lg:text-3xl' : ' text-xl'}`}
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          {service.name}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1 mb-5 line-clamp-2"
          style={{ color: 'oklch(0.5 0 0)' }}
        >
          {service.shortDescription ?? service.description ?? ''}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <span
              className="text-2xl leading-none"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
            >
              {service.price.toFixed(0)}€
            </span>
            {service.duration && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: 'oklch(0.656 0.016 78)' }}
              >
                <Clock className="w-3 h-3" />
                {service.duration} min
              </span>
            )}
          </div>
          <span
            className="flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            Reservar
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`animate-pulse${featured ? ' sm:col-span-2' : ''}`}
      style={{ border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
    >
      <div
        className={featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}
        style={{ background: 'oklch(0.92 0.003 90)' }}
      />
      <div className="p-6 space-y-3">
        <div className="h-2.5 w-20 rounded-sm" style={{ background: 'oklch(0.92 0.003 90)' }} />
        <div className="h-5 w-3/4 rounded-sm" style={{ background: 'oklch(0.92 0.003 90)' }} />
        <div className="h-3 w-full rounded-sm" style={{ background: 'oklch(0.92 0.003 90)' }} />
        <div className="h-3 w-2/3 rounded-sm" style={{ background: 'oklch(0.92 0.003 90)' }} />
      </div>
    </div>
  )
}

export default function ServiciosPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const { data: catData } = useQuery({
    queryKey: ['service-categories'],
    queryFn: () => serviceCategoriesApi.getAll().then((r) => r.data),
  })

  const { data: svcData, isLoading } = useQuery({
    queryKey: ['services', 'all'],
    queryFn: () => servicesApi.getAll({ limit: 100 }).then((r) => r.data),
  })

  const categories: ServiceCategory[] = catData?.data?.categories ?? []
  const allServices = useMemo<Service[]>(
    () => svcData?.data?.services ?? [],
    [svcData],
  )

  const services = useMemo(
    () =>
      activeCategory
        ? allServices.filter((s) => (s.categoryId ?? s.category?.id) === activeCategory)
        : allServices,
    [allServices, activeCategory],
  )

  return (
    <main>
      {/* Hero con imagen de fondo */}
      <section
        className="relative py-24 lg:py-36 overflow-hidden"
        aria-labelledby="servicios-h1"
      >
        <Image
          src="/images/serviciosyclases/masaje-craneosacral.jpeg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center 30%' }}
          sizes="100vw"
          quality={90}
        />
        {/* Overlay oscuro para garantizar la legibilidad del texto */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.21 0 0 / 0.62) 0%, oklch(0.21 0 0 / 0.55) 60%, oklch(0.21 0 0 / 0.7) 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs mb-8"
            style={{ color: 'oklch(0.979 0.004 90 / 0.65)' }}
          >
            <Link
              href="/"
              className="transition-colors hover:text-[oklch(0.979_0.004_90)]"
            >
              Inicio
            </Link>
            <span>/</span>
            <span style={{ color: 'oklch(0.979 0.004 90)' }}>Servicios</span>
          </nav>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="block w-12 h-px"
              style={{ background: 'oklch(0.85 0.05 80)' }}
            />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.85 0.05 80)' }}
            >
              Centro Serlab Natura
            </span>
          </div>
          <h1
            id="servicios-h1"
            className="text-4xl lg:text-6xl mb-6 max-w-2xl leading-[1.1]"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.979 0.004 90)',
            }}
          >
            Terapias y servicios
            <em
              className="block not-italic italic"
              style={{ color: 'oklch(0.85 0.05 80)' }}
            >
              para tu bienestar integral.
            </em>
          </h1>
          <p
            className="text-base lg:text-lg max-w-xl leading-relaxed"
            style={{ color: 'oklch(0.979 0.004 90 / 0.85)' }}
          >
            Cada tratamiento es personalizado, pensado para acompañarte en tu proceso de
            recuperación, bienestar y reconexión contigo mismo.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 lg:py-24" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Category tabs — underline style */}
          {categories.length > 0 && (
            <div className="flex flex-wrap mb-12 pb-10 border-b border-[oklch(0.656_0.016_78/0.12)]">
              <button
                onClick={() => setActiveCategory(null)}
                className="relative px-4 py-3 text-sm tracking-wide transition-colors duration-200 mr-1"
                style={{ color: activeCategory === null ? 'oklch(0.21 0 0)' : 'oklch(0.55 0 0)' }}
              >
                Todos
                {activeCategory === null && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: 'oklch(0.668 0.063 64)' }}
                  />
                )}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="relative px-4 py-3 text-sm tracking-wide transition-colors duration-200 mr-1"
                  style={{ color: activeCategory === cat.id ? 'oklch(0.21 0 0)' : 'oklch(0.55 0 0)' }}
                >
                  {cat.name}
                  {activeCategory === cat.id && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: 'oklch(0.668 0.063 64)' }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard featured />
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  index={i}
                  featured={i === 0 && services.length > 1}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm mb-3" style={{ color: 'oklch(0.45 0 0)' }}>
                No hay servicios disponibles en esta categoría.
              </p>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-sm underline underline-offset-4"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  Ver todos los servicios
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-20" style={{ background: 'oklch(0.551 0.041 147)' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl mb-4"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.979 0.004 90)',
            }}
          >
            ¿No sabes qué terapia necesitas?
          </h2>
          <p
            className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
            style={{ color: 'oklch(0.979 0.004 90 / 0.8)' }}
          >
            Contacta con nosotros y te orientamos sin compromiso sobre el tratamiento más
            adecuado para ti.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 hover:gap-3"
            style={{ background: 'oklch(0.979 0.004 90)', color: 'oklch(0.21 0 0)' }}
          >
            Consulta gratuita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
