'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CLASSES = [
  {
    name: 'Pilates',
    desc: 'Fortalece la musculatura profunda, mejora la postura y equilibrio. Grupos reducidos, todos los niveles.',
    schedule: 'Lun · Mié · Vie',
    level: 'Todos los niveles',
    href: '/clases/pilates',
  },
  {
    name: 'Tai-Chí',
    desc: 'Práctica milenaria para mejorar equilibrio, coordinación y energía vital. Movimiento consciente y fluido.',
    schedule: 'Mar · Jue',
    level: 'Todos los niveles',
    href: '/clases/tai-chi',
  },
  {
    name: 'Mindfulness',
    desc: 'Sesiones semanales para entrenar la atención y la gestión emocional. Herramientas para el día a día.',
    schedule: 'Lun · Mié',
    level: 'Sin experiencia previa',
    href: '/clases/mindfulness',
  },
]

export function ClassesTeaser() {
  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: 'oklch(0.551 0.041 147)' }}
      aria-labelledby="clases-heading"
    >
      {/* Decorative large type */}
      <div
        aria-hidden
        className="absolute right-0 bottom-0 text-[18rem] leading-none font-serif pointer-events-none select-none"
        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.979 0.004 90 / 0.05)', lineHeight: 0.9 }}
      >
        C
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-12 h-px" style={{ background: 'oklch(0.668 0.063 64)' }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: 'oklch(0.668 0.063 64)' }}
              >
                Clases grupales
              </span>
            </div>
            <h2
              id="clases-heading"
              className="text-3xl lg:text-4xl"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.979 0.004 90)',
              }}
            >
              Clases de cuerpo-mente
              <em
                className="block not-italic"
                style={{ color: 'oklch(0.668 0.063 64)' }}
              >
                para activar tu energía.
              </em>
            </h2>
          </div>
          <Link
            href="/clases"
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm tracking-wide transition-colors duration-200"
            style={{ color: 'oklch(0.979 0.004 90 / 0.8)' }}
          >
            Ver todos los horarios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Classes grid */}
        <div className="grid sm:grid-cols-3 gap-px" style={{ background: 'oklch(0.979 0.004 90 / 0.15)' }}>
          {CLASSES.map((cls, i) => (
            <Link
              key={cls.name}
              href={cls.href}
              className="group relative p-8 lg:p-10 flex flex-col gap-5 transition-colors duration-300"
              style={{ background: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'oklch(0.979 0.004 90 / 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Number */}
              <span
                className="text-4xl font-thin"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.979 0.004 90 / 0.2)',
                }}
              >
                0{i + 1}
              </span>

              {/* Name */}
              <h3
                className="text-2xl"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.979 0.004 90)',
                }}
              >
                {cls.name}
              </h3>

              {/* Desc */}
              <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.979 0.004 90 / 0.7)' }}>
                {cls.desc}
              </p>

              {/* Meta */}
              <div className="flex flex-col gap-1 mt-auto pt-5 border-t border-[oklch(0.979_0.004_90/0.15)]">
                <span className="text-xs tracking-wide" style={{ color: 'oklch(0.668 0.063 64)' }}>
                  {cls.schedule}
                </span>
                <span className="text-xs" style={{ color: 'oklch(0.979 0.004 90 / 0.6)' }}>
                  {cls.level}
                </span>
              </div>

              {/* Arrow */}
              <span
                className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                style={{ color: 'oklch(0.668 0.063 64)' }}
              >
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
