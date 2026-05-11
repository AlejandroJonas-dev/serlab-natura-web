import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tienda — Herboristería online',
  description:
    'Herbolario online con fitoterapia, suplementos, cosmética natural, alimentación ecológica y suplementación deportiva. Envíos a toda España.',
  alternates: { canonical: '/tienda' },
  openGraph: {
    title: 'Tienda — Herboristería online de Serlab Natura',
    description:
      'Productos seleccionados con criterio profesional. Envíos a toda España.',
  },
}

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
