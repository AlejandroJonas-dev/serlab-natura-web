import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Chrome } from '@/components/layout/Chrome'
import { RevealObserver } from '@/components/layout/RevealObserver'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  SITE_URL,
  organizationJsonLd,
  localBusinessJsonLd,
} from '@/lib/seo'

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
  metadataBase: new URL(SITE_URL),
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
  authors: [{ name: 'Serlab Natura' }],
  creator: 'Serlab Natura',
  publisher: 'Serlab Natura',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Serlab Natura',
    url: SITE_URL,
    title: 'Serlab Natura — Centro de Bienestar Natural en Córdoba',
    description:
      'Herboristería, terapias y clases en Córdoba. Atención profesional y productos seleccionados con criterio.',
    images: [
      {
        url: '/logo-serlab-natura.webp',
        width: 1674,
        height: 515,
        alt: 'Serlab Natura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serlab Natura — Centro de Bienestar Natural en Córdoba',
    description:
      'Herboristería, terapias y clases en Córdoba. Atención profesional y productos seleccionados con criterio.',
    images: ['/logo-serlab-natura.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo-serlab-natura.webp',
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
        {/* JSON-LD global: identidad de la organización + negocio local
            con horario y geo, para que Google entienda quién somos y
            podamos aparecer en el "local pack" de Córdoba. */}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
        <Providers>
          <Chrome>{children}</Chrome>
          <RevealObserver />
        </Providers>
      </body>
    </html>
  )
}
