'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2, Mail, Package, ShoppingBag } from 'lucide-react'

function ExitoContent() {
  const params = useSearchParams()
  const orderNumber = params.get('numero') ?? ''

  return (
    <main
      className="min-h-[80vh] flex items-center justify-center px-6 py-20"
      style={{ background: 'oklch(0.979 0.004 90)' }}
    >
      <div className="max-w-xl w-full text-center">
        <div className="flex justify-center mb-8">
          <div
            className="relative w-20 h-20 flex items-center justify-center"
            style={{
              background: 'oklch(0.551 0.041 147 / 0.1)',
              borderRadius: '50%',
            }}
          >
            <CheckCircle2
              className="w-10 h-10"
              style={{ color: 'oklch(0.551 0.041 147)' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Pedido confirmado
          </span>
          <span className="rule-cobre" />
        </div>

        <h1
          className="text-3xl lg:text-4xl mb-5"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          Gracias por tu
          <em
            className="block not-italic italic"
            style={{ color: 'oklch(0.551 0.041 147)' }}
          >
            confianza.
          </em>
        </h1>

        <p
          className="text-sm leading-relaxed mb-3 max-w-md mx-auto"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Tu pedido ha sido recibido y está siendo procesado por nuestro equipo. En
          breve recibirás un correo con todos los detalles.
        </p>

        {orderNumber && (
          <div
            className="inline-block px-5 py-3 my-6"
            style={{
              background: 'oklch(0.962 0.005 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.2)',
            }}
          >
            <span
              className="text-xs tracking-wide uppercase"
              style={{ color: 'oklch(0.656 0.016 78)' }}
            >
              Nº de pedido
            </span>
            <span
              className="block text-base mt-1 font-medium"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              {orderNumber}
            </span>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mt-10 mb-10 text-left">
          {[
            {
              Icon: Mail,
              title: 'Confirmación por email',
              text: 'Recibirás un correo con el resumen.',
            },
            {
              Icon: Package,
              title: 'Preparación',
              text: 'Empaquetamos tu pedido en 24h.',
            },
            {
              Icon: ShoppingBag,
              title: 'Entrega',
              text: 'Llegará en 2-5 días laborables.',
            },
          ].map(({ Icon, title, text }) => (
            <div
              key={title}
              className="p-5"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.15)',
              }}
            >
              <Icon
                className="w-5 h-5 mb-3"
                style={{ color: 'oklch(0.668 0.063 64)' }}
              />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: 'oklch(0.21 0 0)' }}
              >
                {title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.45 0 0)' }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cuenta/pedidos"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
            style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
          >
            Ver mis pedidos <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide border transition-all duration-300"
            style={{
              borderColor: 'oklch(0.21 0 0)',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutExitoPage() {
  return (
    <Suspense fallback={null}>
      <ExitoContent />
    </Suspense>
  )
}
