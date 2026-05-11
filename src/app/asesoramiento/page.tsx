import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Asesoramiento natural',
  description:
    'Asesoramiento gratuito en herboristería, suplementación y bienestar: pasa por nuestro centro en Córdoba o consúltanos online sin compromiso.',
}

const STEPS = [
  {
    num: '01',
    title: 'Cuéntanos lo que necesitas',
    body: 'Por WhatsApp, llamada o presencialmente: nos explicas qué te preocupa o qué buscas. Si es algo concreto, mucho mejor.',
  },
  {
    num: '02',
    title: 'Te orientamos sin compromiso',
    body: 'Nuestro equipo te recomienda un plan: producto, terapia, hábito o derivación a profesional sanitario si lo creemos oportuno.',
  },
  {
    num: '03',
    title: 'Te acompañamos en el proceso',
    body: 'No nos quedamos en la venta. Hacemos seguimiento para ajustar, resolver dudas y celebrar resultados contigo.',
  },
]

const TOPICS = [
  'Digestiones pesadas, hinchazón, tránsito intestinal',
  'Defensas bajas, cansancio crónico o convalecencia',
  'Sueño difícil, ansiedad o estrés mantenido',
  'Cuidado de la piel: acné, sequedad, manchas, antiedad',
  'Dolores articulares, recuperación deportiva',
  'Salud hormonal femenina en cualquier etapa',
  'Suplementación para deporte y rendimiento',
  'Alimentación consciente, sin gluten, ecológica',
]

export default function AsesoramientoPage() {
  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ background: 'oklch(0.962 0.005 90)' }}
        aria-labelledby="ase-h1"
      >
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8">
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span style={{ color: 'oklch(0.21 0 0)' }}>Asesoramiento</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              Servicio gratuito
            </span>
          </div>

          <h1
            id="ase-h1"
            className="text-4xl lg:text-6xl mb-6 max-w-3xl leading-[1.1]"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            ¿Necesitas un consejo
            <em
              className="block not-italic italic"
              style={{ color: 'oklch(0.551 0.041 147)' }}
            >
              de verdad?
            </em>
          </h1>

          <p
            className="text-base lg:text-lg max-w-2xl leading-relaxed"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            Nuestro equipo te asesora sin coste para que entiendas qué tomar,
            cómo combinarlo y cuándo. Sin productos genéricos, sin compromiso
            de compra y con la transparencia de quien lleva años en consulta.
          </p>
        </div>
      </section>

      {/* ─── Proceso 3 pasos ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                Cómo funciona
              </span>
            </div>
            <h2
              className="text-3xl lg:text-4xl leading-tight"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              Tres pasos
              <em
                className="block italic"
                style={{ color: 'oklch(0.551 0.041 147)' }}
              >
                y sin papeleo.
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-14 relative">
            {/* Línea decorativa que une los pasos en desktop */}
            <div
              aria-hidden
              className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px"
              style={{ background: 'oklch(0.668 0.063 64 / 0.2)' }}
            />
            {STEPS.map(({ num, title, body }) => (
              <article key={num} className="relative">
                <span
                  className="inline-flex items-center justify-center w-14 h-14 mb-6 text-xl tabular-nums"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    background: 'oklch(0.979 0.004 90)',
                    border: '1px solid oklch(0.668 0.063 64 / 0.4)',
                    color: 'oklch(0.668 0.063 64)',
                    borderRadius: '50%',
                  }}
                >
                  {num}
                </span>
                <h3
                  className="text-xl mb-3 leading-snug"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Temas que abordamos ──────────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                <span className="rule-cobre" />
                <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                  Especialidades
                </span>
              </div>
              <h2
                className="text-3xl lg:text-4xl mb-6 leading-tight"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                Algunas consultas
                <em
                  className="block italic"
                  style={{ color: 'oklch(0.551 0.041 147)' }}
                >
                  habituales.
                </em>
              </h2>
              <p
                className="text-sm leading-relaxed max-w-md"
                style={{ color: 'oklch(0.45 0 0)' }}
              >
                Si tu caso es otro, nos lo cuentas. Si no es nuestro campo,
                te lo decimos claro y te orientamos a quien sí pueda ayudarte.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul
                className="divide-y"
                style={{ borderColor: 'oklch(0.656 0.016 78 / 0.18)' }}
              >
                {TOPICS.map((topic, idx) => (
                  <li
                    key={topic}
                    className="flex items-baseline gap-5 py-5"
                  >
                    <span
                      className="text-xs tabular-nums flex-shrink-0 w-8"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.668 0.063 64)',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-base leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {topic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA final ────────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{ background: 'oklch(0.551 0.041 147)' }}
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl mb-6 leading-tight"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.979 0.004 90)',
            }}
          >
            ¿Hablamos
            <em
              className="block italic"
              style={{ color: 'oklch(0.85 0.05 80)' }}
            >
              hoy mismo?
            </em>
          </h2>
          <p
            className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: 'oklch(0.979 0.004 90 / 0.85)' }}
          >
            Pásate por el centro, llámanos o escríbenos por WhatsApp.
            Respondemos en horario comercial y la primera orientación es
            siempre gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-wide transition-all duration-300"
              style={{
                background: 'oklch(0.979 0.004 90)',
                color: 'oklch(0.21 0 0)',
              }}
            >
              Contactar <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/34604230456?text=Hola%2C%20me%20gustar%C3%ADa%20un%20asesoramiento%20sin%20compromiso."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-wide border transition-all duration-300 hover:bg-[oklch(0.979_0.004_90)] hover:text-[oklch(0.21_0_0)]"
              style={{
                borderColor: 'oklch(0.979 0.004 90)',
                color: 'oklch(0.979 0.004 90)',
              }}
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
