'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import { classesApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { GroupClass, EnrollmentType } from '@/types'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const ENROLLMENT_OPTIONS: { type: EnrollmentType; label: string; description: string }[] = [
  { type: 'SINGLE_CLASS', label: 'Clase suelta', description: 'Asiste una vez, sin compromiso' },
  { type: 'MONTHLY', label: 'Bono mensual', description: 'Todas las clases del mes' },
  { type: 'QUARTERLY', label: 'Bono trimestral', description: 'Mayor ahorro, 3 meses' },
]

export default function ClaseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedType, setSelectedType] = useState<EnrollmentType>('SINGLE_CLASS')
  const [enrollSuccess, setEnrollSuccess] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['class', slug],
    queryFn: () => classesApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  })

  const cls: GroupClass | undefined = data?.data?.class

  const { mutate: enroll, isPending } = useMutation({
    mutationFn: () =>
      classesApi.enroll(cls!.id, { enrollmentType: selectedType }),
    onSuccess: () => {
      setEnrollSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="h-64 animate-pulse mb-10" style={{ background: 'oklch(0.9 0.003 90)' }} />
          <div className="grid lg:grid-cols-[1fr_360px] gap-16">
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded animate-pulse" style={{ background: 'oklch(0.9 0.003 90)' }} />
              <div className="h-4 w-full rounded animate-pulse" style={{ background: 'oklch(0.9 0.003 90)' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !cls) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
          Clase no encontrada
        </h1>
        <Link href="/clases" className="text-sm underline" style={{ color: 'oklch(0.668 0.063 64)' }}>
          ← Volver a clases
        </Link>
      </div>
    )
  }

  const priceForType = selectedType === 'MONTHLY' && cls.priceMonthly
    ? cls.priceMonthly
    : selectedType === 'QUARTERLY' && cls.priceMonthly
      ? cls.priceMonthly * 2.5
      : cls.pricePerSession

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Breadcrumb */}
      <div className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]" style={{ background: 'oklch(0.962 0.005 90)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/clases" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">Clases</Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{cls.name}</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-64 lg:h-96 overflow-hidden" style={{ background: 'oklch(0.551 0.041 147 / 0.1)' }}>
        {cls.images?.[0] ? (
          <Image src={cls.images[0]} alt={cls.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '10rem', color: 'oklch(0.551 0.041 147 / 0.1)', lineHeight: 1 }}>
              {cls.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, oklch(0.21 0 0 / 0.5) 0%, transparent 60%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">

          {/* Content */}
          <div>
            <Link href="/clases" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'oklch(0.656 0.016 78)' }}>
              <ArrowLeft className="w-4 h-4" /> Todas las clases
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                Clase grupal
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl mb-6" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
              {cls.name}
            </h1>

            {cls.shortDescription && (
              <p className="text-base lg:text-lg leading-relaxed mb-10" style={{ color: 'oklch(0.45 0 0)' }}>
                {cls.shortDescription}
              </p>
            )}

            {/* Schedules */}
            {cls.schedules.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Horarios
                </h2>
                <div className="space-y-2">
                  {cls.schedules.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 px-5 py-4"
                      style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.12)' }}
                    >
                      <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.668 0.063 64)' }} />
                      <div className="flex-1">
                        <span className="text-sm font-medium" style={{ color: 'oklch(0.21 0 0)' }}>
                          {DAYS[s.dayOfWeek]}
                        </span>
                        {s.location && (
                          <span className="text-xs ml-3" style={{ color: 'oklch(0.656 0.016 78)' }}>
                            {s.location}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                        <Clock className="w-3.5 h-3.5" />
                        {s.startTime} – {s.endTime}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                        <Users className="w-3.5 h-3.5" />
                        Máx. {s.maxStudents}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {cls.description && (
              <div className="pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
                <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Sobre esta clase
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'oklch(0.45 0 0)' }}>
                  {cls.description}
                </p>
              </div>
            )}

            {/* Benefits */}
            {cls.benefits && cls.benefits.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[oklch(0.656_0.016_78/0.12)]">
                <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>
                  Beneficios
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cls.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.551 0.041 147)' }} />
                      <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28 self-start space-y-4">
            <div className="p-8" style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.2)' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="rule-cobre" />
                <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                  Inscripción
                </span>
              </div>

              {/* Enrollment type selector */}
              <div className="space-y-2 mb-6">
                {ENROLLMENT_OPTIONS.filter(opt =>
                  opt.type === 'SINGLE_CLASS' ||
                  (opt.type === 'MONTHLY' && cls.priceMonthly) ||
                  (opt.type === 'QUARTERLY' && cls.priceMonthly)
                ).map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedType(opt.type)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 ${
                      selectedType === opt.type
                        ? 'ring-1 ring-[oklch(0.668_0.063_64)]'
                        : ''
                    }`}
                    style={{
                      background: selectedType === opt.type ? 'oklch(0.979 0.004 90)' : 'transparent',
                      border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                    }}
                  >
                    <p className="text-sm font-medium mb-0.5" style={{ color: 'oklch(0.21 0 0)' }}>
                      {opt.label}
                    </p>
                    <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}>
                  {priceForType.toFixed(0)}€
                </span>
                <span className="text-sm mb-1" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  {selectedType === 'SINGLE_CLASS' ? '/ sesión' : selectedType === 'MONTHLY' ? '/ mes' : '/ trimestre'}
                </span>
              </div>

              {enrollSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: 'oklch(0.21 0 0)' }}>
                    ¡Inscripción realizada!
                  </p>
                  <Link href="/cuenta/reservas" className="text-xs underline" style={{ color: 'oklch(0.668 0.063 64)' }}>
                    Ver mis inscripciones
                  </Link>
                </div>
              ) : isAuthenticated ? (
                <button
                  onClick={() => enroll()}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60"
                  style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
                >
                  {isPending ? 'Procesando...' : 'Inscribirse ahora'}
                  {!isPending && <ArrowRight className="w-4 h-4" />}
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={`/auth/login?redirect=/clases/${slug}`}
                    className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide transition-all duration-300"
                    style={{ background: 'oklch(0.551 0.041 147)', color: 'oklch(0.979 0.004 90)' }}
                  >
                    Acceder para inscribirse <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-xs text-center" style={{ color: 'oklch(0.656 0.016 78)' }}>
                    ¿Sin cuenta?{' '}
                    <Link href="/auth/register" className="underline" style={{ color: 'oklch(0.668 0.063 64)' }}>
                      Regístrate gratis
                    </Link>
                  </p>
                </div>
              )}

              <hr className="border-[oklch(0.656_0.016_78/0.15)] my-5" />
              <ul className="space-y-2 text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                <li>✓ Grupos reducidos (máx. 12 personas)</li>
                <li>✓ Instructores certificados</li>
                <li>✓ Cancelación 24h antes</li>
              </ul>
            </div>

            <Link
              href="/contacto"
              className="flex items-center justify-between w-full p-5 group transition-colors duration-200"
              style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
            >
              <p className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                ¿Tienes dudas sobre esta clase?
              </p>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'oklch(0.668 0.063 64)' }} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
