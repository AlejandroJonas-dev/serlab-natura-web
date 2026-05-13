'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowRight, Clock, Leaf } from 'lucide-react'
import { servicesApi, serviceCategoriesApi } from '@/lib/api'
import type { Service, ServiceCategory } from '@/types'

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className={`reveal reveal-delay-${Math.min((index % 6) + 1, 6)} group relative flex flex-col`}
      style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
    >
      <div
        className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: 'oklch(0.668 0.063 64)' }}
        aria-hidden
      />
      <div
        className="aspect-[4/3] overflow-hidden relative"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.551 0.041 147 / 0.18) 0%, oklch(0.668 0.063 64 / 0.12) 100%)',
        }}
      >
        {service.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // Placeholder editorial: monograma con la inicial sobre un
          // gradiente verde→cobre. Sustituye el icono genérico, mantiene
          // el card legible cuando la empresa aún no ha subido la foto.
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="block w-12 h-px mb-5"
              style={{ background: 'oklch(0.668 0.063 64 / 0.7)' }}
            />
            <span
              className="leading-none italic"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '6rem',
                color: 'oklch(0.21 0 0 / 0.45)',
              }}
            >
              {service.name.charAt(0)}
            </span>
            <span
              className="mt-5 text-[10px] tracking-[0.35em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Serlab Natura
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        {service.category && (
          <span
            className="text-xs tracking-[0.15em] uppercase mb-2"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            {service.category.name}
          </span>
        )}
        <h3
          className="text-xl mb-3 leading-snug"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          {service.name}
        </h3>
        <p className="text-sm leading-relaxed flex-1 mb-4 line-clamp-3" style={{ color: 'oklch(0.45 0 0)' }}>
          {service.shortDescription ?? service.description ?? ''}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-[oklch(0.656_0.016_78/0.12)]">
          <div className="flex items-center gap-3">
            <span
              className="text-xl"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
            >
              {service.price.toFixed(0)}€
            </span>
            {service.duration && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                <Clock className="w-3 h-3" /> {service.duration} min
              </span>
            )}
          </div>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: 'oklch(0.21 0 0)' }}
          />
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{ border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
    >
      <div className="aspect-[4/3]" style={{ background: 'oklch(0.9 0.003 90)' }} />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
        <div className="h-5 w-3/4 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
        <div className="h-3 w-full rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
        <div className="h-3 w-2/3 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
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
    [allServices, activeCategory]
  )

  return (
    <main>
      {/* Page hero */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: 'oklch(0.962 0.005 90)' }}
        aria-labelledby="servicios-h1"
      >
        <div
          aria-hidden
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, oklch(0.551 0.041 147 / 0.05) 100%)',
            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8"
          >
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span>Servicios</span>
          </nav>
          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              Centro Serlab Natura
            </span>
          </div>
          <h1
            id="servicios-h1"
            className="text-4xl lg:text-5xl mb-6 max-w-2xl"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            Terapias y servicios
            <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
              para tu bienestar integral.
            </em>
          </h1>
          <p
            className="text-base lg:text-lg max-w-xl leading-relaxed"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            Cada tratamiento es personalizado, pensado para acompañarte en tu proceso de
            recuperación, bienestar y reconexión contigo mismo.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 lg:py-24" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-10 border-b border-[oklch(0.656_0.016_78/0.12)]">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-5 py-2 text-sm tracking-wide transition-all duration-200 ${
                  activeCategory === null
                    ? 'bg-[oklch(0.21_0_0)] text-[oklch(0.979_0.004_90)]'
                    : 'border border-[oklch(0.656_0.016_78/0.3)] text-[oklch(0.45_0_0)] hover:border-[oklch(0.21_0_0)] hover:text-[oklch(0.21_0_0)]'
                }`}
              >
                Todos los servicios
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 text-sm tracking-wide transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-[oklch(0.21_0_0)] text-[oklch(0.979_0.004_90)]'
                      : 'border border-[oklch(0.656_0.016_78/0.3)] text-[oklch(0.45_0_0)] hover:border-[oklch(0.21_0_0)] hover:text-[oklch(0.21_0_0)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Leaf
                className="w-10 h-10 mx-auto mb-4"
                style={{ color: 'oklch(0.551 0.041 147 / 0.4)' }}
              />
              <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                No hay servicios disponibles en esta categoría.
              </p>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-sm mt-3 underline"
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
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.979 0.004 90)' }}
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
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
            style={{ background: 'oklch(0.979 0.004 90)', color: 'oklch(0.21 0 0)' }}
          >
            Consulta gratuita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
