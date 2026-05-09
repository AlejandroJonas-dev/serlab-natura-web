'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Award,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Search,
  Shield,
  Sparkles,
  User as UserIcon,
  UserX,
} from 'lucide-react'
import { adminApi } from '@/lib/api'
import type { User, UserRole } from '@/types'

const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: 'Cliente',
  THERAPIST: 'Terapeuta',
  ADMIN: 'Administrador',
}

const ROLES: Array<{ id: UserRole | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'Todos' },
  { id: 'CUSTOMER', label: 'Clientes' },
  { id: 'THERAPIST', label: 'Terapeutas' },
  { id: 'ADMIN', label: 'Administradores' },
]

export default function AdminUsuariosPage() {
  const [filter, setFilter] = useState<UserRole | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [points, setPoints] = useState<Record<string, { value: string; description: string }>>({})
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', filter],
    queryFn: () =>
      adminApi
        .getUsers(filter === 'ALL' ? {} : { role: filter })
        .then((r) => r.data),
  })

  const users: User[] = data?.data?.users ?? []
  const filtered = search
    ? users.filter((u) =>
        [u.firstName, u.lastName, u.email]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(search.toLowerCase()))
      )
    : users

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateUserStatus(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const awardPoints = useMutation({
    mutationFn: ({
      id,
      points,
      description,
    }: {
      id: string
      points: number
      description: string
    }) => adminApi.awardLoyaltyPoints(id, points, description),
    onSuccess: (_, vars) => {
      setPoints((prev) => ({
        ...prev,
        [vars.id]: { value: '', description: '' },
      }))
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Gestión de usuarios
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Usuarios
        </h1>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              background: 'oklch(0.99 0.004 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              color: 'oklch(0.21 0 0)',
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {ROLES.map(({ id, label }) => {
            const active = filter === id
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className="px-3 py-2 text-xs tracking-wide transition-all duration-200"
                style={{
                  background: active ? 'oklch(0.21 0 0)' : 'oklch(0.99 0.004 90)',
                  color: active ? 'oklch(0.979 0.004 90)' : 'oklch(0.45 0 0)',
                  border: active
                    ? '1px solid oklch(0.21 0 0)'
                    : '1px solid oklch(0.656 0.016 78 / 0.2)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {(updateRole.isError || updateStatus.isError || awardPoints.isError) && (
        <div
          className="mb-4 p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(updateRole.error || updateStatus.error || awardPoints.error) instanceof Error
            ? (updateRole.error as Error)?.message ??
              (updateStatus.error as Error)?.message ??
              (awardPoints.error as Error)?.message
            : 'Error al actualizar el usuario'}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse"
              style={{ background: 'oklch(0.94 0.005 90)' }}
            />
          ))}
        </div>
      ) : isError ? (
        <p
          className="p-5 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          No se pudieron cargar los usuarios.
        </p>
      ) : filtered.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          <UserIcon
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
          />
          <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
            {search ? `Sin resultados para "${search}"` : 'No hay usuarios.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((user) => {
            const isOpen = expanded === user.id
            const draft = points[user.id] ?? { value: '', description: '' }
            return (
              <li
                key={user.id}
                style={{
                  background: 'oklch(0.99 0.004 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.18)',
                  opacity: user.isActive ? 1 : 0.65,
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_140px_120px_40px] gap-3 lg:gap-4 px-5 py-4 items-center">
                  <div
                    className="hidden lg:flex w-10 h-10 items-center justify-center"
                    style={{
                      background: 'oklch(0.668 0.063 64 / 0.1)',
                      color: 'oklch(0.668 0.063 64)',
                    }}
                  >
                    {user.role === 'ADMIN' ? (
                      <Shield className="w-4 h-4" />
                    ) : user.role === 'THERAPIST' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-medium"
                        style={{
                          fontFamily: 'var(--font-playfair), serif',
                          color: 'oklch(0.21 0 0)',
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </p>
                      {!user.isActive && (
                        <span
                          className="text-[10px] tracking-wide uppercase px-1.5 py-0.5"
                          style={{
                            background: 'oklch(0.55 0.18 25 / 0.1)',
                            color: 'oklch(0.55 0.18 25)',
                          }}
                        >
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p
                      className="flex flex-wrap items-center gap-x-3 text-xs mt-0.5"
                      style={{ color: 'oklch(0.45 0 0)' }}
                    >
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {user.phone}
                        </span>
                      )}
                    </p>
                  </div>

                  <RolePill role={user.role} />

                  <div className="flex items-center gap-2 lg:justify-end">
                    <Award
                      className="w-3.5 h-3.5"
                      style={{ color: 'oklch(0.668 0.063 64)' }}
                    />
                    <span
                      className="text-sm font-medium tabular-nums"
                      style={{ color: 'oklch(0.21 0 0)' }}
                    >
                      {user.loyaltyPoints} pts
                    </span>
                  </div>

                  <button
                    onClick={() => setExpanded(isOpen ? null : user.id)}
                    className="lg:justify-self-end w-8 h-8 flex items-center justify-center"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isOpen && (
                  <div
                    className="px-5 py-5 border-t grid grid-cols-1 lg:grid-cols-3 gap-6"
                    style={{
                      background: 'oklch(0.97 0.005 90)',
                      borderColor: 'oklch(0.656 0.016 78 / 0.12)',
                    }}
                  >
                    {/* Role change */}
                    <div>
                      <p
                        className="text-[11px] tracking-[0.2em] uppercase mb-3"
                        style={{ color: 'oklch(0.668 0.063 64)' }}
                      >
                        Rol
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => {
                          const active = user.role === role
                          return (
                            <button
                              key={role}
                              onClick={() => {
                                if (active) return
                                updateRole.mutate({ id: user.id, role })
                              }}
                              disabled={updateRole.isPending || active}
                              className="px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors disabled:opacity-60"
                              style={{
                                background: active
                                  ? 'oklch(0.668 0.063 64)'
                                  : 'oklch(0.99 0.004 90)',
                                color: active
                                  ? 'oklch(0.979 0.004 90)'
                                  : 'oklch(0.45 0 0)',
                                border: active
                                  ? '1px solid oklch(0.668 0.063 64)'
                                  : '1px solid oklch(0.656 0.016 78 / 0.25)',
                              }}
                            >
                              {ROLE_LABELS[role]}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Status toggle */}
                    <div>
                      <p
                        className="text-[11px] tracking-[0.2em] uppercase mb-3"
                        style={{ color: 'oklch(0.668 0.063 64)' }}
                      >
                        Estado de la cuenta
                      </p>
                      <button
                        onClick={() =>
                          updateStatus.mutate({
                            id: user.id,
                            isActive: !user.isActive,
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                        style={
                          user.isActive
                            ? {
                                color: 'oklch(0.55 0.18 25)',
                                border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                              }
                            : {
                                background: 'oklch(0.551 0.041 147)',
                                color: 'oklch(0.979 0.004 90)',
                              }
                        }
                      >
                        <UserX className="w-3.5 h-3.5" />
                        {user.isActive ? 'Desactivar' : 'Reactivar'}
                      </button>
                      <p
                        className="text-[11px] mt-2"
                        style={{ color: 'oklch(0.656 0.016 78)' }}
                      >
                        {user.isActive
                          ? 'El usuario podrá acceder a su cuenta'
                          : 'El usuario no puede iniciar sesión'}
                      </p>
                    </div>

                    {/* Award points */}
                    <div>
                      <p
                        className="text-[11px] tracking-[0.2em] uppercase mb-3"
                        style={{ color: 'oklch(0.668 0.063 64)' }}
                      >
                        Otorgar puntos
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          const value = parseInt(draft.value, 10)
                          const description = draft.description.trim()
                          if (!value || !description) return
                          awardPoints.mutate({
                            id: user.id,
                            points: value,
                            description,
                          })
                        }}
                        className="space-y-2"
                      >
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={-1000}
                            max={1000}
                            value={draft.value}
                            onChange={(e) =>
                              setPoints((prev) => ({
                                ...prev,
                                [user.id]: {
                                  ...draft,
                                  value: e.target.value,
                                },
                              }))
                            }
                            placeholder="Puntos"
                            className="w-24 px-3 py-2 text-xs focus:outline-none tabular-nums"
                            style={{
                              background: 'oklch(0.99 0.004 90)',
                              border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                              color: 'oklch(0.21 0 0)',
                            }}
                          />
                          <button
                            type="submit"
                            disabled={awardPoints.isPending}
                            className="flex-1 px-3 py-2 text-xs tracking-wide uppercase transition-colors disabled:opacity-60"
                            style={{
                              background: 'oklch(0.21 0 0)',
                              color: 'oklch(0.979 0.004 90)',
                            }}
                          >
                            Otorgar
                          </button>
                        </div>
                        <input
                          type="text"
                          value={draft.description}
                          onChange={(e) =>
                            setPoints((prev) => ({
                              ...prev,
                              [user.id]: {
                                ...draft,
                                description: e.target.value,
                              },
                            }))
                          }
                          placeholder="Motivo (obligatorio)"
                          className="w-full px-3 py-2 text-xs focus:outline-none"
                          style={{
                            background: 'oklch(0.99 0.004 90)',
                            border: '1px solid oklch(0.656 0.016 78 / 0.25)',
                            color: 'oklch(0.21 0 0)',
                          }}
                        />
                      </form>
                      <p
                        className="text-[11px] mt-2"
                        style={{ color: 'oklch(0.656 0.016 78)' }}
                      >
                        Usa valores negativos para descontar puntos.
                      </p>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function RolePill({ role }: { role: UserRole }) {
  const colors: Record<UserRole, { bg: string; fg: string }> = {
    ADMIN: { bg: 'oklch(0.21 0 0)', fg: 'oklch(0.979 0.004 90)' },
    THERAPIST: { bg: 'oklch(0.551 0.041 147)', fg: 'oklch(0.979 0.004 90)' },
    CUSTOMER: { bg: 'oklch(0.96 0.005 90)', fg: 'oklch(0.45 0 0)' },
  }
  const c = colors[role]
  return (
    <span
      className="text-[10px] tracking-wide uppercase px-2 py-1 inline-block whitespace-nowrap w-fit"
      style={{ background: c.bg, color: c.fg }}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
