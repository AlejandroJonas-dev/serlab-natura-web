'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Introduce un email válido'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
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
      setSubmitted(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al enviar el correo')
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="size-6 text-primary" />
          </div>
          <CardTitle>Revisa tu correo</CardTitle>
          <CardDescription>
            Si existe una cuenta con ese email, recibirás un enlace para restablecer tu
            contraseña en los próximos minutos.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-4">
          {serverError && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Enviar enlace de recuperación
          </Button>
          <Link href="/auth/login" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
