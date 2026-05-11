import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacta con Serlab Natura: Av. Llanos del Pretorio, 1, Local — 14006 Córdoba. Teléfono 957 92 33 47 / 604 23 04 56 (también WhatsApp).',
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: 'Contacto — Serlab Natura',
    description: 'Reserva consulta, escríbenos o pásate por el centro en Córdoba.',
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
