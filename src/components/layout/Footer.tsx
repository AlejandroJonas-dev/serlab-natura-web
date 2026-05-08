'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { newsletterApi } from '@/lib/api'

const FOOTER_LINKS = {
  servicios: [
    { label: 'INDIBA', href: '/servicios/indiba' },
    { label: 'Hydrafacial', href: '/servicios/hydrafacial' },
    { label: 'Reflexología podal', href: '/servicios/reflexologia-podal' },
    { label: 'Masaje metamórfico', href: '/servicios/masaje-metamorfico' },
    { label: 'Mindfulness', href: '/servicios/mindfulness' },
  ],
  clases: [
    { label: 'Pilates', href: '/clases/pilates' },
    { label: 'Tai-Chí', href: '/clases/tai-chi' },
    { label: 'Mindfulness grupal', href: '/clases/mindfulness' },
    { label: 'Horarios', href: '/clases' },
  ],
  empresa: [
    { label: 'Quiénes somos', href: '/quienes-somos' },
    { label: 'Tienda', href: '/tienda' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Aviso legal', href: '/aviso-legal' },
    { label: 'Política de privacidad', href: '/privacidad' },
    { label: 'Política de cookies', href: '/cookies' },
    { label: 'Términos y condiciones', href: '/terminos' },
  ],
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      await newsletterApi.subscribe(email)
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('err')
    }
  }

  return (
    <footer
      className="border-t border-[oklch(0.656_0.016_78/0.15)]"
      style={{ background: 'oklch(0.962 0.005 90)' }}
    >
      {/* Newsletter strip */}
      <div
        className="py-12 px-6 lg:px-8"
        style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p
              className="text-xl italic mb-1"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.979 0.004 90)' }}
            >
              Bienestar en tu bandeja
            </p>
            <p className="text-sm opacity-80" style={{ color: 'oklch(0.979 0.004 90)' }}>
              Consejos de salud natural, novedades y ofertas exclusivas. Sin spam.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex gap-2 w-full max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.es"
              disabled={status === 'sending' || status === 'ok'}
              className="flex-1 px-4 py-3 text-sm bg-white/10 border border-white/30 placeholder-white/50 text-white focus:outline-none focus:border-white transition-colors"
              style={{ color: 'white' }}
            />
            <button
              type="submit"
              disabled={status === 'sending' || status === 'ok'}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium bg-[oklch(0.668_0.063_64)] text-white hover:bg-[oklch(0.62_0.063_64)] transition-colors duration-200 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {status === 'ok' ? '¡Gracias!' : status === 'err' ? 'Reintentar' : 'Suscribirme'}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-serlab-natura.webp"
                alt="Serlab Natura"
                width={1674}
                height={515}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-[oklch(0.45_0_0)] mb-6 max-w-xs">
              Centro de bienestar natural en Córdoba. Terapias, estética avanzada, clases y herbolario online.
            </p>
            <address className="not-italic text-xs text-[oklch(0.656_0.016_78)] leading-relaxed mb-6">
              Córdoba, España<br />
              <a href="tel:+34957923347" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">957 92 33 47</a> · <a href="tel:+34604230456" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">604 23 04 56</a><br />
              <a href="mailto:info@serlabnatura.com" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">info@serlabnatura.com</a>
            </address>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/serlabnatura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9 border border-[oklch(0.656_0.016_78/0.3)] text-[oklch(0.656_0.016_78)] hover:border-[oklch(0.668_0.063_64)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://facebook.com/serlabnatura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-9 h-9 border border-[oklch(0.656_0.016_78/0.3)] text-[oklch(0.656_0.016_78)] hover:border-[oklch(0.668_0.063_64)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-[oklch(0.668_0.063_64)] mb-5">Servicios</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.servicios.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150 link-underline link-underline-cobre">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-[oklch(0.668_0.063_64)] mb-5">Clases</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.clases.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150 link-underline link-underline-cobre">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-[oklch(0.668_0.063_64)] mb-5">Empresa</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.empresa.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150 link-underline link-underline-cobre">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-[oklch(0.656_0.016_78/0.12)] py-5 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[oklch(0.656_0.016_78)]">
            © {new Date().getFullYear()} Serlab Natura. Todos los derechos reservados.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Legal">
            {FOOTER_LINKS.legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-[oklch(0.656_0.016_78)] hover:text-[oklch(0.668_0.063_64)] transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
