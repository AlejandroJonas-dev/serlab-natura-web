'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResponse } from '@/types'

const schema = z.object({
  email: z.string().email('Introduce un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

type FormValues = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const justReset = searchParams.get('reset') === '1'
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    try {
      const { data } = await authApi.login(values)
      const { user, token } = (data as AuthResponse).data
      setAuth(user, token)
      const fallback = user.role === 'ADMIN' ? '/admin' : '/'
      router.push(redirectTo || fallback)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al iniciar sesión'
      )
    }
  }

  return (
    <div>
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Iniciar sesión
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl mb-3"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Bienvenida de nuevo,
          <em
            className="block italic"
            style={{ color: 'oklch(0.551 0.041 147)' }}
          >
            te esperábamos.
          </em>
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Introduce tus datos para acceder a tu cuenta de Serlab Natura.
        </p>
      </header>

      {justReset && (
        <div
          className="flex items-start gap-3 p-3.5 mb-6 text-sm"
          style={{
            background: 'oklch(0.551 0.041 147 / 0.08)',
            border: '1px solid oklch(0.551 0.041 147 / 0.3)',
            color: 'oklch(0.4 0.041 147)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            Contraseña actualizada correctamente. Ya puedes iniciar sesión.
          </span>
        </div>
      )}

      {serverError && (
        <div
          className="p-3.5 mb-6 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field
          label="Email"
          error={errors.email?.message}
          htmlFor="email"
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            {...register('email')}
            className={inputCls}
            style={errors.email ? inputErrorStyle : inputStyle}
          />
        </Field>

        <Field
          label="Contraseña"
          error={errors.password?.message}
          htmlFor="password"
          extra={
            <Link
              href="/auth/forgot-password"
              className="text-[11px] tracking-wide transition-colors hover:text-[oklch(0.668_0.063_64)]"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          }
        >
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={`${inputCls} pr-11`}
              style={errors.password ? inputErrorStyle : inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-[oklch(0.21_0_0)]"
              style={{ color: 'oklch(0.656 0.016 78)' }}
              aria-label={
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 mt-2 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          {isSubmitting ? (
            'Entrando...'
          ) : (
            <>
              Acceder
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p
        className="text-sm text-center mt-8"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        ¿No tienes cuenta?{' '}
        <Link
          href={
            redirectTo
              ? `/auth/register?redirect=${encodeURIComponent(redirectTo)}`
              : '/auth/register'
          }
          className="transition-colors hover:text-[oklch(0.668_0.063_64)] underline-offset-4 hover:underline"
          style={{ color: 'oklch(0.21 0 0)' }}
        >
          Regístrate
        </Link>
      </p>
    </div>
  )
}

const inputCls =
  'w-full px-4 py-3 text-sm focus:outline-none transition-colors'

const inputStyle = {
  background: 'oklch(0.962 0.005 90)',
  border: '1px solid oklch(0.656 0.016 78 / 0.25)',
  color: 'oklch(0.21 0 0)',
} as const

const inputErrorStyle = {
  background: 'oklch(0.962 0.005 90)',
  border: '1px solid oklch(0.6 0.18 25 / 0.6)',
  color: 'oklch(0.21 0 0)',
} as const

function Field({
  label,
  error,
  htmlFor,
  extra,
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  extra?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={htmlFor}
          className="block text-xs tracking-wide uppercase"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          {label}
        </label>
        {extra}
      </div>
      {children}
      {error && (
        <p
          className="text-xs mt-1.5"
          style={{ color: 'oklch(0.55 0.18 25)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
