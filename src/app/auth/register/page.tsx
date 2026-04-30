'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { AuthResponse } from '@/types'

const schema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    email: z.string().email('Introduce un email válido'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
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
      router.push('/')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al crear la cuenta')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Únete a Serlab Natura y disfruta de todos los beneficios</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="flex flex-col gap-4">
          {serverError && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                placeholder="Ana"
                aria-invalid={!!errors.firstName}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
                placeholder="García"
                aria-invalid={!!errors.lastName}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">
              Teléfono <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="600 000 000"
              {...register('phone')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Crear cuenta
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
