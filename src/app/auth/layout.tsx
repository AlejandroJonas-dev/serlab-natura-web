import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Leaf } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Acceso',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen grid lg:grid-cols-[minmax(0,_5fr)_minmax(0,_7fr)]"
      style={{ background: 'oklch(0.979 0.004 90)' }}
    >
      {/* ─── LEFT — brand panel ──────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex relative flex-col justify-between p-12 xl:p-16"
        style={{
          background: 'oklch(0.551 0.041 147)',
          color: 'oklch(0.979 0.004 90)',
        }}
      >
        {/* Decorative diagonal gradient */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(160deg, transparent 0%, oklch(0.21 0 0 / 0.18) 100%)',
          }}
        />
        {/* Decorative botanical glow */}
        <div
          aria-hidden
          className="absolute -bottom-20 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, oklch(0.668 0.063 64 / 0.18) 0%, transparent 70%)',
          }}
        />

        {/* Logo + back link */}
        <div className="relative flex items-center justify-between gap-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group"
            aria-label="Serlab Natura — inicio"
          >
            <div
              className="w-11 h-11 flex items-center justify-center transition-colors duration-300 group-hover:bg-[oklch(0.979_0.004_90)]"
              style={{ background: 'oklch(0.979 0.004 90 / 0.94)' }}
            >
              <Image
                src="/logo-serlab-natura.webp"
                alt="Serlab Natura"
                width={1674}
                height={515}
                className="w-8 h-auto"
              />
            </div>
            <div className="leading-tight">
              <p
                className="text-base"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                Serlab Natura
              </p>
              <p
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ color: 'oklch(0.979 0.004 90 / 0.7)' }}
              >
                Bienestar natural
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase transition-colors hover:text-white"
            style={{ color: 'oklch(0.979 0.004 90 / 0.75)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver
          </Link>
        </div>

        {/* Editorial copy */}
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="block w-12 h-px"
              style={{ background: 'oklch(0.668 0.063 64)' }}
            />
            <span
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Tu espacio
            </span>
          </div>
          <h2
            className="text-3xl xl:text-4xl leading-[1.15] mb-6"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            El bienestar empieza
            <em className="block italic" style={{ color: 'oklch(0.85 0.05 80)' }}>
              cuando te eliges a ti.
            </em>
          </h2>
          <p
            className="text-sm leading-relaxed mb-10 max-w-sm"
            style={{ color: 'oklch(0.979 0.004 90 / 0.78)' }}
          >
            Accede a tu cuenta para gestionar tus reservas de terapias, llevar
            seguimiento de tus pedidos y guardar tus productos favoritos.
          </p>

          {/* Mini list of benefits */}
          <ul className="space-y-3.5">
            {[
              'Gestiona reservas e inscripciones a clases',
              'Historial completo de pedidos y envíos',
              'Acumula puntos de fidelidad en cada compra',
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-sm"
                style={{ color: 'oklch(0.979 0.004 90 / 0.88)' }}
              >
                <Leaf
                  className="w-3.5 h-3.5 mt-1 flex-shrink-0"
                  style={{ color: 'oklch(0.85 0.05 80)' }}
                />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 flex items-center justify-between text-[11px]"
          style={{ color: 'oklch(0.979 0.004 90 / 0.55)' }}
        >
          <span>© {new Date().getFullYear()} Serlab Natura</span>
          <div className="flex items-center gap-4">
            <Link
              href="/privacidad"
              className="transition-colors hover:text-white"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="transition-colors hover:text-white"
            >
              Términos
            </Link>
          </div>
        </div>
      </aside>

      {/* ─── RIGHT — form panel ──────────────────────────────────────────── */}
      <section className="relative flex flex-col">
        {/* Mobile-only header (shown on small screens since left panel is hidden) */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-[oklch(0.656_0.016_78/0.15)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2"
            aria-label="Serlab Natura — inicio"
          >
            <Image
              src="/logo-serlab-natura.webp"
              alt="Serlab Natura"
              width={1674}
              height={515}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase transition-colors hover:text-[oklch(0.668_0.063_64)]"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:py-16 lg:py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </section>
    </div>
  )
}
