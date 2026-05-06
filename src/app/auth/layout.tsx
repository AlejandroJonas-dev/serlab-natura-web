import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceso',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'oklch(0.962 0.005 90)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10 group" aria-label="Serlab Natura — inicio">
        <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
          <path d="M18 2 L30 10 L30 26 L18 34 L6 26 L6 10 Z" stroke="oklch(0.551 0.041 147)" strokeWidth="1.5" fill="none" />
          <path d="M18 8 C18 8 22 12 22 18 C22 24 18 28 18 28 C18 28 14 24 14 18 C14 12 18 8 18 8Z" fill="oklch(0.551 0.041 147)" opacity="0.8" />
          <path d="M12 16 C12 16 16 14 18 18 C20 22 16 26 16 26" stroke="oklch(0.668 0.063 64)" strokeWidth="1" fill="none" strokeLinecap="round" />
        </svg>
        <div className="leading-none">
          <span
            className="block text-base font-semibold tracking-[0.15em] uppercase"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            Serlab
          </span>
          <span
            className="block text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)', letterSpacing: '0.35em' }}
          >
            Natura
          </span>
        </div>
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-md shadow-sm"
        style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
      >
        {children}
      </div>
    </div>
  )
}
