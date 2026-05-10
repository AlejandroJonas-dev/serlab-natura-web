'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResponse } from '@/types'

const schema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z
      .string()
      .min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    email: z.string().email('Introduce un email válido'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un carácter especial'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
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
      const { data } = await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      })
      const { user, token } = (data as AuthResponse).data
      setAuth(user, token)
      router.push(redirectTo || '/')
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al crear la cuenta'
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
            Crear cuenta
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl mb-3"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Únete a Serlab,
          <em
            className="block italic"
            style={{ color: 'oklch(0.551 0.041 147)' }}
          >
            cuídate como te mereces.
          </em>
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Reservas, pedidos y puntos de fidelidad gestionados desde un solo
          sitio.
        </p>
      </header>

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
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Nombre"
            error={errors.firstName?.message}
            htmlFor="firstName"
          >
            <input
              id="firstName"
              placeholder="Ana"
              {...register('firstName')}
              className={inputCls}
              style={errors.firstName ? inputErrorStyle : inputStyle}
            />
          </Field>
          <Field
            label="Apellidos"
            error={errors.lastName?.message}
            htmlFor="lastName"
          >
            <input
              id="lastName"
              placeholder="García"
              {...register('lastName')}
              className={inputCls}
              style={errors.lastName ? inputErrorStyle : inputStyle}
            />
          </Field>
        </div>

        <Field label="Email" error={errors.email?.message} htmlFor="email">
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
          label="Teléfono"
          error={errors.phone?.message}
          htmlFor="phone"
          optional
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="600 000 000"
            {...register('phone')}
            className={inputCls}
            style={inputStyle}
          />
        </Field>

        <Field
          label="Contraseña"
          error={errors.password?.message}
          htmlFor="password"
          hint="Mín. 8 — minúscula, mayúscula, número y símbolo"
        >
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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

        <Field
          label="Confirmar contraseña"
          error={errors.confirmPassword?.message}
          htmlFor="confirmPassword"
        >
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            {...register('confirmPassword')}
            className={inputCls}
            style={errors.confirmPassword ? inputErrorStyle : inputStyle}
          />
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
            'Creando cuenta...'
          ) : (
            <>
              Crear cuenta
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p
          className="text-[11px] leading-relaxed text-center"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          Al crear una cuenta aceptas nuestros{' '}
          <Link
            href="/terminos"
            className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
          >
            términos
          </Link>{' '}
          y la{' '}
          <Link
            href="/privacidad"
            className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
          >
            política de privacidad
          </Link>
          .
        </p>
      </form>

      <p
        className="text-sm text-center mt-8"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        ¿Ya tienes cuenta?{' '}
        <Link
          href={
            redirectTo
              ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
              : '/auth/login'
          }
          className="transition-colors hover:text-[oklch(0.668_0.063_64)] underline-offset-4 hover:underline"
          style={{ color: 'oklch(0.21 0 0)' }}
        >
          Inicia sesión
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
  hint,
  optional,
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  hint?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs tracking-wide uppercase mb-2"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
        {optional && (
          <span
            className="ml-2 text-[10px] tracking-wider normal-case"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            (opcional)
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p
          className="text-[11px] mt-1.5"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          {hint}
        </p>
      )}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}
