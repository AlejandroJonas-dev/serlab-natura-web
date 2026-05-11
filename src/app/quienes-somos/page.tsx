import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description:
    'Centro de bienestar natural en Córdoba: terapias, herboristería y clases impartidas por un equipo con formación clínica y enfoque humano.',
}

const PILLARS = [
  {
    num: '01',
    title: 'Criterio profesional',
    body: 'Cada terapia, producto y clase está validada por nuestro equipo. No comercializamos lo que no usaríamos en consulta. Es la única manera de mantener la confianza que llevamos años construyendo.',
  },
  {
    num: '02',
    title: 'Atención personalizada',
    body: 'Antes de recomendar nada, escuchamos. Cada sesión se adapta a tu historia, tu cuerpo y tus objetivos concretos — no hay protocolos genéricos detrás de la puerta.',
  },
  {
    num: '03',
    title: 'Bienestar integrativo',
    body: 'Combinamos lo mejor de la fitoterapia, la estética avanzada, el trabajo corporal y el acompañamiento emocional. Un mismo equipo te acompaña en el camino completo.',
  },
]

export default function QuienesSomosPage() {
  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ background: 'oklch(0.962 0.005 90)' }}
        aria-labelledby="qs-h1"
      >
        {/* Letra decorativa grande de fondo */}
        <div
          aria-hidden
          className="absolute -left-8 -top-8 text-[18rem] leading-none select-none pointer-events-none hidden lg:block"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.551 0.041 147 / 0.06)',
          }}
        >
          S
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8">
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span style={{ color: 'oklch(0.21 0 0)' }}>Quiénes somos</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              Sobre Serlab Natura
            </span>
          </div>

          <h1
            id="qs-h1"
            className="text-4xl lg:text-6xl mb-6 max-w-3xl leading-[1.1]"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Un centro pensado para
            <em
              className="block not-italic italic"
              style={{ color: 'oklch(0.551 0.041 147)' }}
            >
              acompañarte de verdad.
            </em>
          </h1>

          <p
            className="text-base lg:text-lg max-w-2xl leading-relaxed"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            En Serlab Natura llevamos años trabajando con un mismo objetivo:
            ofrecer en Córdoba un espacio donde la salud natural se entienda
            como un proceso completo —cuerpo, mente y entorno— y donde cada
            persona reciba un trato a la altura.
          </p>
        </div>
      </section>

      {/* ─── Historia ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-5">
                <span className="rule-cobre" />
                <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                  Origen
                </span>
              </div>
              <h2
                className="text-3xl lg:text-4xl leading-tight"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                Nacimos del
                <em
                  className="block italic"
                  style={{ color: 'oklch(0.551 0.041 147)' }}
                >
                  oficio.
                </em>
              </h2>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p
                className="first-letter:text-7xl first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:mt-1 text-base leading-[1.85] mb-6"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.668 0.063 64)',
                  }}
                >
                  E
                </span>
                mpezamos como un pequeño herbolario en Córdoba con una idea
                muy clara: cada producto y cada terapia tenía que pasar primero
                por nuestras manos antes de pasar por las de quien viene a
                consultarnos. Esa es la razón por la que hoy somos un equipo
                pluridisciplinar bajo el mismo techo.
              </p>

              <p
                className="text-base leading-[1.85]"
                style={{ color: 'oklch(0.45 0 0)' }}
              >
                Lo que arrancó como herboristería de barrio se ha ido
                ampliando con consulta de reflexología, iridología,
                kinesiología, osteopatía, quiromasaje, asesoramiento
                nutricional, estética avanzada con INDIBA y Hydrafacial, y
                clases semanales de pilates, tai-chí, bowspring y mindfulness.
                Todo coordinado, todo desde un mismo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Filosofía / 3 pilares ───────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                Nuestra forma de trabajar
              </span>
            </div>
            <h2
              className="text-3xl lg:text-4xl leading-tight"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              Tres principios
              <em
                className="block italic"
                style={{ color: 'oklch(0.551 0.041 147)' }}
              >
                que no negociamos.
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {PILLARS.map(({ num, title, body }) => (
              <article key={num}>
                <span
                  className="block text-5xl mb-4 tabular-nums leading-none"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.668 0.063 64)',
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

      {/* ─── Manifiesto / cita ───────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-2xl lg:text-3xl leading-[1.4]"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            <em
              className="block italic mb-4"
              style={{ color: 'oklch(0.551 0.041 147)' }}
            >
              «No vendemos productos.
            </em>
            Acompañamos procesos, formamos a quien quiere entender lo que
            toma y enseñamos a moverse mejor. Lo demás viene solo.»
          </p>
          <p
            className="text-xs tracking-[0.3em] uppercase mt-8"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            — Equipo Serlab Natura
          </p>
        </div>
      </section>

      {/* ─── Espacio + CTA ───────────────────────────────────────── */}
      <section
        className="py-20 lg:py-28"
        style={{ background: 'oklch(0.551 0.041 147)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="block w-12 h-px"
                  style={{ background: 'oklch(0.85 0.05 80)' }}
                />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'oklch(0.85 0.05 80)' }}
                >
                  Visítanos
                </span>
              </div>
              <h2
                className="text-3xl lg:text-4xl mb-6 leading-tight"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.979 0.004 90)',
                }}
              >
                Estamos en el
                <em
                  className="block italic"
                  style={{ color: 'oklch(0.85 0.05 80)' }}
                >
                  centro de Córdoba.
                </em>
              </h2>
              <p
                className="text-base leading-relaxed max-w-md mb-8"
                style={{ color: 'oklch(0.979 0.004 90 / 0.85)' }}
              >
                Pásate sin cita previa para conocer el espacio, hablar con el
                equipo o consultarnos algo concreto. Si prefieres, te
                organizamos una primera consulta sin compromiso.
              </p>

              <address
                className="not-italic flex items-start gap-3 text-sm mb-10"
                style={{ color: 'oklch(0.979 0.004 90)' }}
              >
                <MapPin
                  className="w-4 h-4 mt-1 flex-shrink-0"
                  style={{ color: 'oklch(0.85 0.05 80)' }}
                />
                <span className="leading-relaxed">
                  Av. Llanos del Pretorio, 1, Local
                  <br />
                  14006 Córdoba
                </span>
              </address>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-wide transition-all duration-300"
                  style={{
                    background: 'oklch(0.979 0.004 90)',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  Reservar consulta <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm tracking-wide border transition-all duration-300 hover:bg-[oklch(0.979_0.004_90)] hover:text-[oklch(0.21_0_0)]"
                  style={{
                    borderColor: 'oklch(0.979 0.004 90)',
                    color: 'oklch(0.979 0.004 90)',
                  }}
                >
                  Ver servicios
                </Link>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/place/Av.+Llanos+del+Pretorio,+1,+14006+C%C3%B3rdoba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver Serlab Natura en Google Maps"
              className="block relative aspect-[4/3] overflow-hidden group"
              style={{
                background: 'oklch(0.979 0.004 90 / 0.08)',
                border: '1px solid oklch(0.979 0.004 90 / 0.2)',
              }}
            >
              <iframe
                title="Mapa de Serlab Natura"
                src="https://www.google.com/maps?q=Av.+Llanos+del+Pretorio,+1,+14006+C%C3%B3rdoba&output=embed"
                className="absolute inset-0 w-full h-full pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-hidden
              />
              <span
                className="absolute bottom-3 right-3 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm transition-colors duration-200"
                style={{
                  background: 'oklch(0.979 0.004 90 / 0.92)',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                Cómo llegar →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
