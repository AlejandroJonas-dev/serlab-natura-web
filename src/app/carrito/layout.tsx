import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tu carrito',
  description: 'Productos seleccionados antes de finalizar tu compra.',
  robots: { index: false, follow: false },
}

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
