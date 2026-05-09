'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Calendar,
  Clock,
  Edit2,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { classesApi } from '@/lib/api'
import type { GroupClass } from '@/types'

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function AdminClasesPage() {
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(true)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-classes'],
    queryFn: () => classesApi.getAll().then((r) => r.data),
  })

  const classes: GroupClass[] = data?.data?.classes ?? []
  const filtered = classes.filter((c) => {
    if (!showInactive && !c.isActive) return false
    if (search) {
      return c.name.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  const remove = useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="rule-cobre" />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'oklch(0.668 0.063 64)' }}
            >
              Clases grupales
            </span>
          </div>
          <h1
            className="text-3xl lg:text-4xl"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Clases
          </h1>
          <p
            className="text-xs mt-2"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            {filtered.length} de {classes.length} clase
            {classes.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/clases/nueva"
          className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wide uppercase transition-colors"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          <Plus className="w-4 h-4" /> Nueva clase
        </Link>
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
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              background: 'oklch(0.99 0.004 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.2)',
              color: 'oklch(0.21 0 0)',
            }}
          />
        </div>
        <label
          className="flex items-center gap-2 text-xs cursor-pointer"
          style={{ color: 'oklch(0.45 0 0)' }}
        >
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="accent-[oklch(0.668_0.063_64)]"
          />
          Mostrar inactivas
        </label>
      </div>

      {remove.isError && (
        <div
          className="mb-4 p-3 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          {(remove.error as Error)?.message ?? 'Error al eliminar'}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse"
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
          No se pudieron cargar las clases.
        </p>
      ) : filtered.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          <GraduationCap
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
          />
          <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
            {search ? `Sin resultados para "${search}"` : 'No hay clases.'}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <li
              key={cls.id}
              className="flex flex-col"
              style={{
                background: 'oklch(0.99 0.004 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.18)',
                opacity: cls.isActive ? 1 : 0.65,
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {cls.images?.[0] ? (
                  <Image
                    src={cls.images[0]}
                    alt={cls.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'oklch(0.96 0.005 90)' }}
                  >
                    <GraduationCap
                      className="w-8 h-8"
                      style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
                    />
                  </div>
                )}
                {!cls.isActive && (
                  <span
                    className="absolute top-3 right-3 text-[10px] tracking-wide uppercase px-2 py-1"
                    style={{
                      background: 'oklch(0.21 0 0 / 0.85)',
                      color: 'oklch(0.979 0.004 90)',
                    }}
                  >
                    Inactiva
                  </span>
                )}
              </div>

              <div className="flex-1 p-5 flex flex-col">
                <h3
                  className="text-lg leading-snug mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {cls.name}
                </h3>

                {cls.shortDescription && (
                  <p
                    className="text-xs mb-3 leading-relaxed line-clamp-2 flex-1"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    {cls.shortDescription}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-xs mb-4">
                  <span
                    className="flex items-center gap-1"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  >
                    <Calendar className="w-3 h-3" />
                    {cls.schedules.length} horario
                    {cls.schedules.length === 1 ? '' : 's'}
                  </span>
                  {cls.activeEnrollments != null && (
                    <span
                      className="flex items-center gap-1"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                    >
                      <Users className="w-3 h-3" />
                      {cls.activeEnrollments} inscrit
                      {cls.activeEnrollments === 1 ? 'o' : 'os'}
                    </span>
                  )}
                </div>

                {/* Schedule preview */}
                {cls.schedules.length > 0 && (
                  <div
                    className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b"
                    style={{ borderColor: 'oklch(0.656 0.016 78 / 0.12)' }}
                  >
                    {cls.schedules.slice(0, 4).map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1 text-[10px] tracking-wide px-2 py-1"
                        style={{
                          background: 'oklch(0.96 0.005 90)',
                          color: 'oklch(0.45 0 0)',
                        }}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {DAYS_SHORT[s.dayOfWeek]} {s.startTime}
                      </span>
                    ))}
                    {cls.schedules.length > 4 && (
                      <span
                        className="text-[10px] px-2 py-1"
                        style={{ color: 'oklch(0.656 0.016 78)' }}
                      >
                        +{cls.schedules.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-baseline justify-between mb-4">
                  <span
                    className="text-base font-medium tabular-nums"
                    style={{ color: 'oklch(0.668 0.063 64)' }}
                  >
                    {cls.pricePerSession.toFixed(2).replace('.', ',')}€
                    <span
                      className="text-xs ml-1"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                    >
                      / sesión
                    </span>
                  </span>
                  {cls.priceMonthly && (
                    <span
                      className="text-xs"
                      style={{ color: 'oklch(0.45 0 0)' }}
                    >
                      Bono: {cls.priceMonthly.toFixed(2).replace('.', ',')}€/mes
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/clases/${cls.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-[11px] tracking-wide uppercase transition-colors"
                    style={{
                      color: 'oklch(0.45 0 0)',
                      border: '1px solid oklch(0.656 0.016 78 / 0.3)',
                    }}
                  >
                    <Edit2 className="w-3 h-3" /> Editar
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `¿Eliminar "${cls.name}"? Esta acción no se puede deshacer.`
                        )
                      ) {
                        remove.mutate(cls.id)
                      }
                    }}
                    disabled={remove.isPending}
                    className="inline-flex items-center justify-center w-9 h-9 transition-colors disabled:opacity-60"
                    style={{
                      color: 'oklch(0.55 0.18 25)',
                      border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                    }}
                    aria-label={`Eliminar ${cls.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
