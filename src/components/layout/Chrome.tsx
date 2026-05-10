'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

/**
 * Decide si una página recibe el chrome público (Header, Footer, WhatsApp)
 * o se renderiza minimalista (auth + admin tienen layouts dedicados que
 * gestionan su propio cromado).
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMinimal =
    pathname.startsWith('/auth') || pathname.startsWith('/admin')

  if (isMinimal) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
