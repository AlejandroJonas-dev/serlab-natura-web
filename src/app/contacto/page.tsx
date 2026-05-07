'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, ArrowRight, Send, CheckCircle2 } from 'lucide-react'

const SERVICES_OPTIONS = [
  'INDIBA — Radiofrecuencia',
  'Hydrafacial',
  'Reflexología podal',
  'Masaje metamórfico',
  'Mindfulness individual',
  'Pilates',
  'Tai-Chí',
  'Mindfulness grupal',
  'Consulta general',
  'Otro',
]

export default function ContactoPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1000))
    setStatus('sent')
  }

  return (
    <main>
      {/* Hero */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: 'oklch(0.962 0.005 90)' }}
        aria-labelledby="contacto-h1"
      >
        <div
          aria-hidden
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, oklch(0.551 0.041 147 / 0.05) 100%)',
            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8">
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span>Contacto</span>
          </nav>
          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              Estamos aquí para ti
            </span>
          </div>
          <h1
            id="contacto-h1"
            className="text-4xl lg:text-5xl mb-6 max-w-xl"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            Cuéntanos en qué
            <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
              podemos ayudarte.
            </em>
          </h1>
          <p className="text-base lg:text-lg max-w-lg leading-relaxed" style={{ color: 'oklch(0.45 0 0)' }}>
            Consulta sin compromiso sobre terapias, clases o cualquier duda. Te respondemos
            en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 lg:py-24" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-20">

            {/* Form */}
            <div>
              {status === 'sent' ? (
                <div
                  className="flex flex-col items-center justify-center text-center py-20"
                  style={{ border: '1px solid oklch(0.551 0.041 147 / 0.2)' }}
                >
                  <CheckCircle2 className="w-12 h-12 mb-5" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <h2
                    className="text-2xl mb-3"
                    style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                  >
                    Mensaje enviado
                  </h2>
                  <p className="text-sm max-w-sm leading-relaxed mb-6" style={{ color: 'oklch(0.45 0 0)' }}>
                    Gracias, {form.name.split(' ')[0]}. Nuestro equipo te responderá en menos de 24
                    horas en el email {form.email}.
                  </p>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }}
                    className="text-sm underline"
                    style={{ color: 'oklch(0.668 0.063 64)' }}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs tracking-wide uppercase mb-2"
                        style={{ color: 'oklch(0.45 0 0)' }}
                      >
                        Nombre completo *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{
                          background: 'oklch(0.962 0.005 90)',
                          border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                          color: 'oklch(0.21 0 0)',
                        }}
                        placeholder="Ana García"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs tracking-wide uppercase mb-2"
                        style={{ color: 'oklch(0.45 0 0)' }}
                      >
                        Correo electrónico *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{
                          background: 'oklch(0.962 0.005 90)',
                          border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                          color: 'oklch(0.21 0 0)',
                        }}
                        placeholder="ana@email.es"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs tracking-wide uppercase mb-2"
                        style={{ color: 'oklch(0.45 0 0)' }}
                      >
                        Teléfono
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{
                          background: 'oklch(0.962 0.005 90)',
                          border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                          color: 'oklch(0.21 0 0)',
                        }}
                        placeholder="600 00 00 00"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-xs tracking-wide uppercase mb-2"
                        style={{ color: 'oklch(0.45 0 0)' }}
                      >
                        Servicio de interés
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm focus:outline-none transition-colors appearance-none"
                        style={{
                          background: 'oklch(0.962 0.005 90)',
                          border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                          color: form.service ? 'oklch(0.21 0 0)' : 'oklch(0.656 0.016 78)',
                        }}
                      >
                        <option value="">Selecciona un servicio...</option>
                        {SERVICES_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-xs tracking-wide uppercase mb-2"
                      style={{ color: 'oklch(0.45 0 0)' }}
                    >
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                      style={{
                        background: 'oklch(0.962 0.005 90)',
                        border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                        color: 'oklch(0.21 0 0)',
                      }}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex items-center gap-2 px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60"
                    style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
                  >
                    <Send className="w-4 h-4" />
                    {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                  </button>

                  <p className="text-xs mt-4" style={{ color: 'oklch(0.656 0.016 78)' }}>
                    * Campos obligatorios. Tus datos se tratan conforme a nuestra{' '}
                    <Link href="/privacidad" className="underline hover:text-[oklch(0.668_0.063_64)]">
                      política de privacidad
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-8">
              {/* Info card */}
              <div
                className="p-8"
                style={{
                  background: 'oklch(0.962 0.005 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="rule-cobre" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                    Datos de contacto
                  </span>
                </div>

                <address className="not-italic space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'oklch(0.21 0 0)' }}>
                        Dirección
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.45 0 0)' }}>
                        Córdoba, España
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'oklch(0.21 0 0)' }}>
                        Teléfono
                      </p>
                      <a
                        href="tel:+34957000000"
                        className="text-xs hover:text-[oklch(0.668_0.063_64)] transition-colors"
                        style={{ color: 'oklch(0.45 0 0)' }}
                      >
                        957 00 00 00
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: 'oklch(0.21 0 0)' }}>
                        Email
                      </p>
                      <a
                        href="mailto:info@serlabnatura.com"
                        className="text-xs hover:text-[oklch(0.668_0.063_64)] transition-colors"
                        style={{ color: 'oklch(0.45 0 0)' }}
                      >
                        info@serlabnatura.com
                      </a>
                    </div>
                  </div>
                </address>
              </div>

              {/* Hours card */}
              <div
                className="p-8"
                style={{
                  background: 'oklch(0.962 0.005 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-4 h-4" style={{ color: 'oklch(0.668 0.063 64)' }} />
                  <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                    Horarios
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { days: 'Lunes — Viernes', hours: '9:00 — 20:00' },
                    { days: 'Sábados', hours: '9:00 — 14:00' },
                    { days: 'Domingos y festivos', hours: 'Cerrado' },
                  ].map(({ days, hours }) => (
                    <div key={days} className="flex justify-between items-center">
                      <span style={{ color: 'oklch(0.45 0 0)' }}>{days}</span>
                      <span
                        className="font-medium"
                        style={{ color: hours === 'Cerrado' ? 'oklch(0.656 0.016 78)' : 'oklch(0.21 0 0)' }}
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-5 transition-colors duration-200 group"
                style={{
                  background: 'oklch(0.551 0.041 147)',
                  color: 'oklch(0.979 0.004 90)',
                }}
              >
                <div>
                  <p className="text-sm font-medium mb-0.5">Respuesta inmediata</p>
                  <p className="text-xs opacity-80">Contacta por WhatsApp</p>
                </div>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
