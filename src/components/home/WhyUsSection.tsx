'use client'

import { Award, Heart, Eye, Leaf, Star } from 'lucide-react'

const REASONS = [
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Excelencia profesional',
    desc: 'Equipo con formación continua y titulación específica en cada disciplina.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Atención personalizada',
    desc: 'Cada sesión se adapta a ti, a tu historia y a tus objetivos concretos.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Resultados visibles',
    desc: 'Protocolos contrastados con tecnología INDIBA y técnicas terapéuticas reales.',
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'Espacio diseñado para el bienestar',
    desc: 'Un entorno cuidado al detalle que favorece la calma y la reconexión.',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Productos de criterio profesional',
    desc: 'Cada producto de nuestra tienda es seleccionado con rigor por nuestro equipo.',
  },
]

export function WhyUsSection() {
  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: 'oklch(0.979 0.004 90)' }}
      aria-labelledby="why-us-heading"
    >
      {/* Large decorative letter */}
      <div
        aria-hidden
        className="absolute -right-4 top-1/2 -translate-y-1/2 text-[20rem] leading-none font-serif select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: 'oklch(0.551 0.041 147 / 0.04)',
          lineHeight: 1,
        }}
      >
        N
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="reveal max-w-xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              Por qué elegirnos
            </span>
          </div>
          <h2
            id="why-us-heading"
            className="text-3xl lg:text-4xl"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            Un centro donde la naturaleza
            <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
              es la protagonista.
            </em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px" style={{ background: 'oklch(0.656 0.016 78 / 0.12)' }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className={`reveal reveal-delay-${i + 1} group p-8 flex flex-col gap-4 transition-colors duration-300`}
              style={{ background: 'oklch(0.979 0.004 90)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'oklch(0.962 0.005 90)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'oklch(0.979 0.004 90)'
              }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center transition-colors duration-300"
                style={{ background: 'oklch(0.551 0.041 147 / 0.08)', color: 'oklch(0.551 0.041 147)' }}
              >
                {r.icon}
              </div>
              <div>
                <h3
                  className="text-base font-medium mb-2"
                  style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                >
                  {r.title}
                </h3>
                <p className="text-sm leading-relaxed text-[oklch(0.45_0_0)]">
                  {r.desc}
                </p>
              </div>
              {/* Copper accent line */}
              <div
                className="mt-auto h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'oklch(0.668 0.063 64)' }}
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="reveal mt-20 max-w-2xl mx-auto text-center">
          <blockquote
            className="text-xl lg:text-2xl italic leading-relaxed"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.45 0 0)' }}
          >
            &ldquo;En cada sesión, en cada clase, en cada recomendación, trabajamos desde la escucha activa,
            el rigor profesional y una visión integrativa del cuidado personal.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="h-px w-8" style={{ background: 'oklch(0.668 0.063 64)' }} />
            <span className="text-xs tracking-[0.2em] uppercase text-[oklch(0.656_0.016_78)]">
              Equipo Serlab Natura
            </span>
            <span className="h-px w-8" style={{ background: 'oklch(0.668 0.063 64)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
