import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceso',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 text-2xl font-bold tracking-tight text-foreground">
        Serlab <span className="text-primary">Natura</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
