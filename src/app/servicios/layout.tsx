import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios y terapias en Córdoba',
  description:
    'Reflexología, iridología, kinesiología, osteopatía, quiromasaje, mindfulness y estética avanzada con INDIBA y Hydrafacial en Córdoba.',
  alternates: { canonical: '/servicios' },
  openGraph: {
    title: 'Servicios y terapias — Serlab Natura',
    description:
      'Terapias naturales y estética avanzada en Córdoba, por un equipo con formación clínica.',
  },
}

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
