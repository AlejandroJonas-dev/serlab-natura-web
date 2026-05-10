'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, MailCheck } from 'lucide-react'
import { authApi } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Introduce un email válido'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    try {
      await authApi.forgotPassword(values.email)
      setSubmittedEmail(values.email)
      setSubmitted(true)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al enviar el correo'
      )
    }
  }

  if (submitted) {
    return (
      <div>
        <header className="mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 mb-6"
            style={{
              background: 'oklch(0.551 0.041 147 / 0.1)',
              borderRadius: '50%',
            }}
          >
            <MailCheck
              className="w-6 h-6"
              style={{ color: 'oklch(0.551 0.041 147)' }}
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="rule-cobre" />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Revisa tu correo
            </span>
          </div>
          <h1
            className="text-3xl lg:text-4xl mb-3"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Enlace
            <em
              className="block italic"
              style={{ color: 'oklch(0.551 0.041 147)' }}
            >
              en camino.
            </em>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            Si existe una cuenta vinculada a{' '}
            <span
              className="font-medium"
              style={{ color: 'oklch(0.21 0 0)' }}
            >
              {submittedEmail}
            </span>
            , recibirás un enlace para restablecer tu contraseña en los
            próximos minutos. Revisa también la carpeta de spam.
          </p>
        </header>

        <Link
          href="/auth/login"
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
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
            Recuperar contraseña
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl mb-3"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          ¿Has olvidado
          <em
            className="block italic"
            style={{ color: 'oklch(0.551 0.041 147)' }}
          >
            tu contraseña?
          </em>
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          Introduce tu email y te enviaremos un enlace para restablecerla.
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
        <div>
          <label
            htmlFor="email"
            className="block text-xs tracking-wide uppercase mb-2"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            {...register('email')}
            className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
            style={
              errors.email
                ? {
                    background: 'oklch(0.962 0.005 90)',
                    border: '1px solid oklch(0.6 0.18 25 / 0.6)',
                    color: 'oklch(0.21 0 0)',
                  }
                : {
                    background: 'oklch(0.962 0.005 90)',
                    border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                    color: 'oklch(0.21 0 0)',
                  }
            }
          />
          {errors.email && (
            <p
              className="text-xs mt-1.5"
              style={{ color: 'oklch(0.55 0.18 25)' }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

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
            'Enviando...'
          ) : (
            <>
              Enviar enlace
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase mt-8 transition-colors hover:text-[oklch(0.668_0.063_64)]"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver al inicio de sesión
      </Link>
    </div>
  )
}
