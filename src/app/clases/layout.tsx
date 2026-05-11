import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clases semanales: pilates, tai-chí, bowspring y mindfulness',
  description:
    'Clases grupales en Córdoba: pilates, tai-chí, bowspring y mindfulness. Sesión suelta o bonos mensuales y trimestrales.',
  alternates: { canonical: '/clases' },
  openGraph: {
    title: 'Clases semanales — Serlab Natura',
    description:
      'Pilates, tai-chí, bowspring y mindfulness en grupos reducidos.',
  },
}

export default function ClasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
