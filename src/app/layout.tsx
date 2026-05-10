import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Chrome } from '@/components/layout/Chrome'
import { RevealObserver } from '@/components/layout/RevealObserver'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Serlab Natura — Centro de Bienestar Natural en Córdoba',
    template: '%s | Serlab Natura',
  },
  description:
    'Centro de bienestar natural en Córdoba, con terapias, estética con INDIBA, reflexología, clases de Tai-Chí, pilates y mindfulness y nuestra tienda online de productos naturales y herbolario. Atención personalizada y resultados reales.',
  keywords: [
    'herboristería Córdoba',
    'terapias naturales Córdoba',
    'INDIBA Córdoba',
    'bienestar natural',
    'pilates Córdoba',
    'mindfulness Córdoba',
    'reflexología Córdoba',
    'herbolario online',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Serlab Natura',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Chrome>{children}</Chrome>
          <RevealObserver />
        </Providers>
      </body>
    </html>
  )
}
