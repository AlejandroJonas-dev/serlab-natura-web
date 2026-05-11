import Link from 'next/link'

/**
 * Plantilla editorial compartida por las 4 páginas legales
 * (aviso legal, privacidad, cookies, términos).
 *
 * Mantiene la misma estética que el resto de la web: marfil de
 * fondo, breadcrumb, rule-cobre, Playfair en titulares y cuerpo
 * de lectura largo con line-height generoso.
 */
export interface LegalSection {
  heading: string
  body: React.ReactNode
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  lastUpdate,
}: {
  eyebrow: string
  title: string
  intro: React.ReactNode
  sections: LegalSection[]
  lastUpdate: string
}) {
  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Hero */}
      <section
        className="py-16 lg:py-24"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8">
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span style={{ color: 'oklch(0.21 0 0)' }}>{eyebrow}</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              {eyebrow}
            </span>
          </div>

          <h1
            className="text-3xl lg:text-5xl leading-[1.1] mb-6"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            {title}
          </h1>

          <p
            className="text-base lg:text-lg leading-relaxed max-w-2xl"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            {intro}
          </p>

          <p
            className="text-[11px] tracking-[0.2em] uppercase mt-8"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            Última actualización · {lastUpdate}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-14">
            {sections.map((section, idx) => (
              <article key={section.heading}>
                <header className="flex items-baseline gap-4 mb-5">
                  <span
                    className="text-xl tabular-nums leading-none flex-shrink-0"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      color: 'oklch(0.668 0.063 64)',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2
                    className="text-xl lg:text-2xl leading-tight"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      color: 'oklch(0.21 0 0)',
                    }}
                  >
                    {section.heading}
                  </h2>
                </header>
                <div
                  className="text-base leading-[1.85] space-y-4 pl-10"
                  style={{ color: 'oklch(0.21 0 0)' }}
                >
                  {section.body}
                </div>
              </article>
            ))}
          </div>

          <hr
            className="mt-16 mb-8"
            style={{ borderColor: 'oklch(0.656 0.016 78 / 0.18)' }}
          />
          <p
            className="text-xs text-center"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            Si tienes dudas sobre este texto, escríbenos a{' '}
            <a
              href="mailto:info@serlabnatura.com"
              className="transition-colors hover:text-[oklch(0.668_0.063_64)]"
              style={{ color: 'oklch(0.21 0 0)' }}
            >
              info@serlabnatura.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
