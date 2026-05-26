'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { classesApi } from '@/lib/api'
import type { GroupClass } from '@/types'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function ClassCard({ cls, index }: { cls: GroupClass; index: number }) {
  return (
    <Link
      href={`/clases/${cls.slug}`}
      className={`reveal reveal-delay-${Math.min((index % 3) + 1, 3)} group relative flex flex-col card-lift`}
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

      <div
        className="aspect-video relative overflow-hidden img-zoom editorial-img"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.551 0.041 147 / 0.18) 0%, oklch(0.668 0.063 64 / 0.12) 100%)',
        }}
      >
        {cls.images?.[0] ? (
          <Image
            src={cls.images[0]}
            alt={cls.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          // Placeholder editorial: monograma con la inicial sobre el
          // gradiente verde→cobre. Igual que en /servicios para mantener
          // consistencia en el catálogo.
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="block w-12 h-px mb-4"
              style={{ background: 'oklch(0.668 0.063 64 / 0.7)' }}
            />
            <span
              className="leading-none italic"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: '5rem',
                color: 'oklch(0.21 0 0 / 0.45)',
              }}
            >
              {cls.name.charAt(0)}
            </span>
            <span
              className="mt-4 text-[10px] tracking-[0.35em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Clase Serlab
            </span>
          </div>
        )}
      </div>

      <div className="p-7 flex flex-col flex-1">
        <h3
          className="text-xl mb-3"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          {cls.name}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1 mb-6 line-clamp-3"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          {cls.shortDescription ?? cls.description ?? ''}
        </p>

        {cls.schedules.length > 0 && (
          <div className="mb-5 space-y-1.5">
            {cls.schedules.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                <span className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                  {DAYS[s.dayOfWeek]} · {s.startTime} – {s.endTime}
                  {s.location ? ` · ${s.location}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between pt-4 border-t border-[oklch(0.656_0.016_78/0.12)]">
          <div>
            <span
              className="text-xl"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
            >
              {cls.pricePerSession.toFixed(0)}€
            </span>
            <span className="text-xs ml-1" style={{ color: 'oklch(0.656 0.016 78)' }}>
              / sesión
            </span>
            {cls.priceMonthly && (
              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.551 0.041 147)' }}>
                {cls.priceMonthly.toFixed(0)}€ / mes
              </p>
            )}
          </div>
          <ArrowRight
            className="w-4 h-4 mb-1 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: 'oklch(0.21 0 0)' }}
          />
        </div>
      </div>
    </Link>
  )
}

export default function ClasesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['classes', 'all'],
    queryFn: () => classesApi.getAll({ limit: 50 }).then((r) => r.data),
  })

  const classes: GroupClass[] = data?.data?.classes ?? []

  return (
    <main>
      {/* Hero con imagen de fondo */}
      <section
        className="relative py-24 lg:py-36 overflow-hidden"
        aria-labelledby="clases-h1"
      >
        <Image
          src="/images/serviciosyclases/tai-chi.jpeg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center 35%' }}
          sizes="100vw"
          quality={90}
        />
        {/* Overlay con tinte verde de marca para mantener identidad */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.32 0.04 147 / 0.78) 0%, oklch(0.32 0.04 147 / 0.65) 60%, oklch(0.21 0.02 147 / 0.78) 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs mb-8"
            style={{ color: 'oklch(0.979 0.004 90 / 0.65)' }}
          >
            <Link href="/" className="hover:text-[oklch(0.979_0.004_90)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span style={{ color: 'oklch(0.979 0.004 90)' }}>Clases</span>
          </nav>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-12 h-px" style={{ background: 'oklch(0.85 0.05 80)' }} />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.85 0.05 80)' }}
            >
              Clases grupales
            </span>
          </div>
          <h1
            id="clases-h1"
            className="text-4xl lg:text-6xl mb-6 max-w-2xl leading-[1.1]"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.979 0.004 90)' }}
          >
            Tai-Chi, Pilates
            <em className="block not-italic italic" style={{ color: 'oklch(0.85 0.05 80)' }}>
              y Mindfulness.
            </em>
          </h1>
          <p
            className="text-base lg:text-lg max-w-xl leading-relaxed"
            style={{ color: 'oklch(0.979 0.004 90 / 0.85)' }}
          >
            Clases semanales en grupos reducidos para moverse mejor, calmar la mente
            y reconectar con el cuerpo. Instructores certificados y espacio propio en el centro.
          </p>
        </div>
      </section>

      {/* Classes grid */}
      <section className="py-16 lg:py-24" style={{ background: 'oklch(0.962 0.005 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{ border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
                >
                  <div className="aspect-video" style={{ background: 'oklch(0.9 0.003 90)' }} />
                  <div className="p-7 space-y-3">
                    <div className="h-5 w-40 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                    <div className="h-3 w-full rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                    <div className="h-3 w-3/4 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : classes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((c, i) => (
                <ClassCard key={c.id} cls={c} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                No hay clases disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing options */}
      <section className="py-20 lg:py-24" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="rule-cobre" />
                <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                  Modalidades
                </span>
              </div>
              <h2
                className="text-3xl mb-8"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
              >
                Clases adaptadas a tu ritmo
              </h2>
              <div className="space-y-3">
                {[
                  { type: 'Clase suelta', price: 'Desde 15€', desc: 'Prueba sin compromiso' },
                  { type: 'Bono mensual', price: 'Desde 50€ / mes', desc: 'El mejor precio para los constantes' },
                  { type: 'Bono trimestral', price: 'Desde 130€ / trim.', desc: 'Máximo ahorro, máximo compromiso' },
                ].map((opt) => (
                  <div
                    key={opt.type}
                    className="flex items-center gap-4 p-5"
                    style={{
                      background: 'oklch(0.962 0.005 90)',
                      border: '1px solid oklch(0.656 0.016 78 / 0.12)',
                    }}
                  >
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium mb-0.5"
                        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                      >
                        {opt.type}
                      </p>
                      <p className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                        {opt.desc}
                      </p>
                    </div>
                    <span
                      className="text-sm flex-shrink-0"
                      style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
                    >
                      {opt.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <blockquote
                className="text-lg italic leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.45 0 0)' }}
              >
                &ldquo;Nuestras clases no son solo ejercicio físico. Son un momento para respirar, para
                soltar, para conectar con uno mismo.&rdquo;
              </blockquote>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
                style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
              >
                Consultar horarios <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
