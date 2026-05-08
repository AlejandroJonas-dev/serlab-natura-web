import Link from 'next/link'
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

export function ContactCta() {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: 'oklch(0.979 0.004 90)' }}
      aria-labelledby="contacto-cta-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text + CTAs */}
          <div>
            <div className="reveal flex items-center gap-3 mb-5">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                Contacto & Reserva
              </span>
            </div>
            <h2
              className="reveal text-3xl lg:text-4xl mb-6"
              id="contacto-cta-heading"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              Tu bienestar
              <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
                empieza aquí.
              </em>
            </h2>
            <p className="reveal text-sm leading-relaxed text-[oklch(0.45_0_0)] mb-8 max-w-md">
              ¿Tienes dudas sobre un tratamiento o quieres reservar una sesión?
              Nuestro equipo te asesorará personalmente.
            </p>

            <div className="reveal flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
                style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
              >
                Reservar consulta <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/34604230456?text=Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Serlab%20Natura."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide border transition-all duration-300 hover:bg-[oklch(0.21_0_0)] hover:text-[oklch(0.979_0.004_90)]"
                style={{ borderColor: 'oklch(0.21 0 0)', color: 'oklch(0.21 0 0)' }}
              >
                WhatsApp directo
              </a>
            </div>

            {/* Contact info */}
            <div className="reveal space-y-4">
              <address className="not-italic space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                  <span className="text-sm text-[oklch(0.45_0_0)]">Córdoba, España</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                  <a href="tel:+34957923347" className="text-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors">
                    957 92 33 47
                  </a>
                  <span className="text-xs text-[oklch(0.656_0.016_78)]">·</span>
                  <a href="tel:+34604230456" className="text-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors">
                    604 23 04 56
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                  <a href="mailto:info@serlabnatura.com" className="text-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.668_0.063_64)] transition-colors">
                    info@serlabnatura.com
                  </a>
                </div>
              </address>
            </div>
          </div>

          {/* Right — decorative map placeholder + schedule */}
          <div className="reveal-left">
            {/* Map placeholder */}
            <div
              className="relative aspect-[4/3] mb-8 flex items-center justify-center"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              }}
            >
              <div className="text-center">
                <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: 'oklch(0.551 0.041 147)' }} />
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Serlab Natura
                </p>
                <p className="text-xs text-[oklch(0.656_0.016_78)] mt-1">Córdoba, España</p>
              </div>
            </div>

            {/* Schedule card */}
            <div
              className="p-6"
              style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
            >
              <h3
                className="text-sm font-medium mb-4 tracking-wide"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
              >
                Horarios de atención
              </h3>
              <div className="space-y-2 text-xs text-[oklch(0.45_0_0)]">
                <div className="flex justify-between">
                  <span>Lunes — Viernes</span>
                  <span className="font-medium">9:00 — 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span className="font-medium">9:00 — 14:00</span>
                </div>
                <div className="flex justify-between text-[oklch(0.656_0.016_78)]">
                  <span>Domingos y festivos</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
