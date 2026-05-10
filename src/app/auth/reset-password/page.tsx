'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un carácter especial'),
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmNewPassword'],
  })

type FormValues = z.infer<typeof schema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      setServerError('Enlace de recuperación inválido o expirado')
      return
    }
    setServerError('')
    try {
      await authApi.resetPassword({ token, ...values })
      router.push('/auth/login?reset=1')
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Error al restablecer la contraseña'
      )
    }
  }

  if (!token) {
    return (
      <div>
        <header className="mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 mb-6"
            style={{
              background: 'oklch(0.55 0.18 25 / 0.1)',
              borderRadius: '50%',
            }}
          >
            <AlertTriangle
              className="w-6 h-6"
              style={{ color: 'oklch(0.55 0.18 25)' }}
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="rule-cobre" />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Enlace inválido
            </span>
          </div>
          <h1
            className="text-3xl lg:text-4xl mb-3"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Este enlace
            <em
              className="block italic"
              style={{ color: 'oklch(0.55 0.18 25)' }}
            >
              no es válido.
            </em>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            El enlace de recuperación ha expirado o ya se ha utilizado.
            Solicita uno nuevo para continuar.
          </p>
        </header>

        <Link
          href="/auth/forgot-password"
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          Solicitar nuevo enlace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
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
            Nueva contraseña
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl mb-3"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Elige una contraseña
          <em
            className="block italic"
            style={{ color: 'oklch(0.551 0.041 147)' }}
          >
            que recuerdes.
          </em>
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Define tu nueva contraseña para volver a acceder a tu cuenta.
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
        <Field
          label="Nueva contraseña"
          error={errors.newPassword?.message}
          htmlFor="newPassword"
          hint="Mín. 8 — minúscula, mayúscula, número y símbolo"
        >
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('newPassword')}
              className={`${inputCls} pr-11`}
              style={errors.newPassword ? inputErrorStyle : inputStyle}
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
          error={errors.confirmNewPassword?.message}
          htmlFor="confirmNewPassword"
        >
          <input
            id="confirmNewPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            {...register('confirmNewPassword')}
            className={inputCls}
            style={errors.confirmNewPassword ? inputErrorStyle : inputStyle}
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
            'Guardando...'
          ) : (
            <>
              Guardar nueva contraseña
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
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
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  hint?: string
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
