'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, Lock, Save, UserCog } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import type { User } from '@/types'

interface ProfileForm {
  firstName: string
  lastName: string
  phone: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export default function MiPerfilPage() {
  const { user, updateUser } = useAuthStore()

  const [profile, setProfile] = useState<ProfileForm>(() => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
  }))
  const [password, setPassword] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const profileMutation = useMutation({
    mutationFn: () => authApi.updateProfile(profile),
    onSuccess: (res) => {
      const updated = res.data?.data?.user as User | undefined
      if (updated) updateUser(updated)
      setProfileError(null)
    },
    onError: (err: Error) => setProfileError(err.message),
  })

  const passwordMutation = useMutation({
    mutationFn: () => authApi.changePassword(password),
    onSuccess: () => {
      setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      setPasswordError(null)
    },
    onError: (err: Error) => setPasswordError(err.message),
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setProfileError('Nombre y apellidos son obligatorios')
      return
    }
    profileMutation.mutate()
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password.newPassword !== password.confirmNewPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    passwordMutation.mutate()
  }

  const inputBase =
    'w-full px-4 py-3 text-sm focus:outline-none transition-colors disabled:opacity-60'
  const inputStyle = {
    background: 'oklch(0.962 0.005 90)',
    border: '1px solid oklch(0.656 0.016 78 / 0.25)',
    color: 'oklch(0.21 0 0)',
  } as const

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="rule-cobre" />
        <span
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          Datos personales
        </span>
      </div>
      <h1
        className="text-3xl lg:text-4xl mb-10"
        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
      >
        Mi perfil
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Profile form */}
        <section
          className="p-7"
          style={{
            background: 'oklch(0.979 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.15)',
          }}
        >
          <header className="flex items-center gap-3 mb-6">
            <UserCog className="w-5 h-5" style={{ color: 'oklch(0.668 0.063 64)' }} />
            <h2
              className="text-lg"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              Información personal
            </h2>
          </header>

          <form onSubmit={handleProfileSubmit} noValidate className="space-y-5">
            <Field label="Email">
              <input
                type="email"
                value={user?.email ?? ''}
                disabled
                className={inputBase}
                style={inputStyle}
              />
              <p className="text-xs mt-1.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                Para cambiar tu email, contacta con soporte.
              </p>
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nombre *">
                <input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className={inputBase}
                  style={inputStyle}
                />
              </Field>
              <Field label="Apellidos *">
                <input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className={inputBase}
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Teléfono">
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={inputBase}
                style={inputStyle}
                placeholder="600 000 000"
              />
            </Field>

            {profileError && (
              <p className="text-xs" style={{ color: 'oklch(0.55 0.18 25)' }}>
                {profileError}
              </p>
            )}
            {profileMutation.isSuccess && (
              <p
                className="flex items-center gap-1.5 text-xs"
                style={{ color: 'oklch(0.551 0.041 147)' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Datos actualizados correctamente
              </p>
            )}

            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium tracking-wide uppercase transition-all duration-300 disabled:opacity-60"
              style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
            >
              <Save className="w-4 h-4" />
              {profileMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </section>

        {/* Password form */}
        <section
          className="p-7"
          style={{
            background: 'oklch(0.979 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.15)',
          }}
        >
          <header className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5" style={{ color: 'oklch(0.668 0.063 64)' }} />
            <h2
              className="text-lg"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              Cambiar contraseña
            </h2>
          </header>

          <form onSubmit={handlePasswordSubmit} noValidate className="space-y-5">
            <Field label="Contraseña actual *">
              <input
                type="password"
                autoComplete="current-password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                className={inputBase}
                style={inputStyle}
              />
            </Field>
            <Field label="Nueva contraseña *">
              <input
                type="password"
                autoComplete="new-password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className={inputBase}
                style={inputStyle}
                minLength={8}
              />
              <p className="text-xs mt-1.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
                Mínimo 8 caracteres.
              </p>
            </Field>
            <Field label="Confirmar nueva contraseña *">
              <input
                type="password"
                autoComplete="new-password"
                value={password.confirmNewPassword}
                onChange={(e) =>
                  setPassword((prev) => ({
                    ...prev,
                    confirmNewPassword: e.target.value,
                  }))
                }
                className={inputBase}
                style={inputStyle}
              />
            </Field>

            {passwordError && (
              <p className="text-xs" style={{ color: 'oklch(0.55 0.18 25)' }}>
                {passwordError}
              </p>
            )}
            {passwordMutation.isSuccess && (
              <p
                className="flex items-center gap-1.5 text-xs"
                style={{ color: 'oklch(0.551 0.041 147)' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Contraseña actualizada
              </p>
            )}

            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium tracking-wide uppercase transition-all duration-300 disabled:opacity-60"
              style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
            >
              <Lock className="w-4 h-4" />
              {passwordMutation.isPending ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </section>
      </div>

      {/* Member since */}
      {user && (
        <p
          className="text-xs mt-10 text-center"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          Miembro desde el{' '}
          {new Date(user.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-xs tracking-wide uppercase mb-2"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
