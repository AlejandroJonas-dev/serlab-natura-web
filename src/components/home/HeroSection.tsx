import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: 'oklch(0.979 0.004 90)' }}
      aria-label="Portada principal"
    >
      {/* Background decorative shapes */}
      <div
        aria-hidden
        className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.962 0.005 90) 0%, oklch(0.551 0.041 147 / 0.06) 100%)',
          clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute right-[8%] top-[15%] w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.668 0.063 64)' }}
      />
      <div
        aria-hidden
        className="absolute right-[20%] bottom-[20%] w-40 h-40 rounded-full opacity-8 blur-2xl pointer-events-none"
        style={{ background: 'oklch(0.551 0.041 147)' }}
      />

      {/* Thin vertical copper line — editorial detail */}
      <div
        aria-hidden
        className="hidden lg:block absolute left-[42%] top-24 bottom-24 w-px opacity-20"
        style={{ background: 'oklch(0.668 0.063 64)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]">

          {/* Left — text content */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="animate-hero-1 flex items-center gap-3 mb-8">
              <span className="rule-cobre" />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: 'oklch(0.668 0.063 64)', fontFamily: 'var(--font-lato), sans-serif' }}
              >
                Centro de bienestar · Córdoba
              </span>
            </div>

            {/* H1 */}
            <h1
              className="animate-hero-2 text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.1] mb-8"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              Bienestar
              <em className="block not-italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
                con propósito,
              </em>
              <span>cuidado con alma.</span>
            </h1>

            {/* Separator */}
            <div className="animate-hero-2 flex items-center gap-4 mb-8">
              <span className="h-px flex-1 max-w-12" style={{ background: 'oklch(0.668 0.063 64)' }} />
            </div>

            {/* Subtext */}
            <p
              className="animate-hero-3 text-base lg:text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              Un espacio exclusivo donde cuerpo, mente y naturaleza se alinean.
              Terapias, estética avanzada, clases de bienestar y herbolario online.
            </p>

            {/* CTAs */}
            <div className="animate-hero-3 flex flex-col sm:flex-row gap-4">
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide text-[oklch(0.979_0.004_90)] transition-all duration-300 group"
                style={{ background: 'oklch(0.21 0 0)' }}
              >
                Nuestros servicios
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tienda"
                className="sn-btn-outline inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide"
              >
                Entrar en la tienda
              </Link>
            </div>

            {/* Social proof */}
            <div className="animate-hero-4 flex items-center gap-6 mt-12 pt-8 border-t border-[oklch(0.656_0.016_78/0.2)]">
              <div className="text-center">
                <p className="stat-number text-2xl">+800</p>
                <p className="text-xs text-[oklch(0.656_0.016_78)] mt-1 tracking-wide">Clientes</p>
              </div>
              <div className="w-px h-8" style={{ background: 'oklch(0.656 0.016 78 / 0.3)' }} />
              <div className="text-center">
                <p className="stat-number text-2xl">10+</p>
                <p className="text-xs text-[oklch(0.656_0.016_78)] mt-1 tracking-wide">Años</p>
              </div>
              <div className="w-px h-8" style={{ background: 'oklch(0.656 0.016 78 / 0.3)' }} />
              <div className="text-center">
                <p className="stat-number text-2xl">4.9★</p>
                <p className="text-xs text-[oklch(0.656_0.016_78)] mt-1 tracking-wide">Google</p>
              </div>
            </div>
          </div>

          {/* Right — visual */}
          <div className="hidden lg:flex items-center justify-center relative animate-hero-4">
            {/* Main image area: foto real del mostrador del centro */}
            <div
              className="relative w-full max-w-md aspect-[4/5] overflow-hidden"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              }}
            >
              <Image
                src="/images/serlab/mostrador.webp"
                alt="Mostrador de Serlab Natura en Córdoba"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0px, 480px"
                priority
              />

              {/* Floating card — service highlight */}
              <div
                className="absolute -left-12 bottom-16 w-44 p-4 shadow-xl"
                style={{
                  background: 'oklch(0.979 0.004 90)',
                  border: '1px solid oklch(0.668 0.063 64 / 0.3)',
                }}
              >
                <span
                  className="block text-xs tracking-[0.15em] uppercase mb-1"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  Tecnología
                </span>
                <span
                  className="block text-sm font-medium"
                  style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                >
                  INDIBA®
                </span>
                <span className="block text-xs text-[oklch(0.656_0.016_78)] mt-1">
                  Radiofrecuencia avanzada
                </span>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -right-8 top-16 w-28 h-28 rounded-full flex flex-col items-center justify-center text-center shadow-lg"
                style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
              >
                <span className="text-xs tracking-wider uppercase opacity-80">Desde</span>
                <span
                  className="text-2xl font-medium"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  40€
                </span>
                <span className="text-[10px] tracking-wider uppercase opacity-80">/ sesión</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-hero-4">
        <span className="text-xs tracking-[0.2em] uppercase text-[oklch(0.656_0.016_78)]">Descubrir</span>
        <div
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, oklch(0.668 0.063 64), transparent)' }}
        />
      </div>
    </section>
  )
}
