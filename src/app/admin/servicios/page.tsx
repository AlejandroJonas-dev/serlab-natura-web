'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Clock,
  Edit2,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react'
import { serviceCategoriesApi, servicesApi } from '@/lib/api'
import type { Service, ServiceCategory } from '@/types'

export default function AdminServiciosPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | 'ALL'>('ALL')
  const [showInactive, setShowInactive] = useState(true)
  const queryClient = useQueryClient()

  const servicesQuery = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => servicesApi.getAll().then((r) => r.data),
  })
  const categoriesQuery = useQuery({
    queryKey: ['service-categories'],
    queryFn: () => serviceCategoriesApi.getAll().then((r) => r.data),
  })

  const services: Service[] = servicesQuery.data?.data?.services ?? []
  const categories: ServiceCategory[] =
    categoriesQuery.data?.data?.categories ?? []

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (!showInactive && !s.isActive) return false
      if (categoryFilter !== 'ALL' && s.categoryId !== categoryFilter) return false
      if (search) {
        return s.name.toLowerCase().includes(search.toLowerCase())
      }
      return true
    })
  }, [services, search, categoryFilter, showInactive])

  const remove = useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
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
              Catálogo de servicios
            </span>
          </div>
          <h1
            className="text-3xl lg:text-4xl"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Servicios
          </h1>
          <p
            className="text-xs mt-2"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            {filtered.length} de {services.length} servicio
            {services.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/servicios/nuevo"
          className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wide uppercase transition-colors"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          <Plus className="w-4 h-4" /> Nuevo servicio
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

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm focus:outline-none"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.2)',
            color: 'oklch(0.21 0 0)',
          }}
        >
          <option value="ALL">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

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
          Mostrar inactivos
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

      {servicesQuery.isLoading ? (
        <SkeletonGrid />
      ) : servicesQuery.isError ? (
        <p
          className="p-5 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          No se pudieron cargar los servicios.
        </p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? `Sin resultados para "${search}"` : 'No hay servicios.'}
        />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <li
              key={service.id}
              className="flex flex-col"
              style={{
                background: 'oklch(0.99 0.004 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.18)',
                opacity: service.isActive ? 1 : 0.65,
              }}
            >
              {/* Cover */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {service.images?.[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'oklch(0.96 0.005 90)' }}
                  >
                    <Sparkles
                      className="w-8 h-8"
                      style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
                    />
                  </div>
                )}
                {service.isFeatured && (
                  <span
                    className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] tracking-wide uppercase px-2 py-1"
                    style={{
                      background: 'oklch(0.668 0.063 64)',
                      color: 'oklch(0.979 0.004 90)',
                    }}
                  >
                    <Star className="w-3 h-3" fill="currentColor" /> Destacado
                  </span>
                )}
                {!service.isActive && (
                  <span
                    className="absolute top-3 right-3 text-[10px] tracking-wide uppercase px-2 py-1"
                    style={{
                      background: 'oklch(0.21 0 0 / 0.85)',
                      color: 'oklch(0.979 0.004 90)',
                    }}
                  >
                    Inactivo
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 p-5 flex flex-col">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {service.category?.name ?? 'Sin categoría'}
                </p>
                <h3
                  className="text-lg leading-snug mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.21 0 0)',
                  }}
                >
                  {service.name}
                </h3>
                {service.shortDescription && (
                  <p
                    className="text-xs mb-4 leading-relaxed flex-1"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    {service.shortDescription}
                  </p>
                )}

                <div
                  className="flex items-center justify-between text-xs mb-4 pt-4 border-t"
                  style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
                >
                  <span
                    className="flex items-center gap-1"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  >
                    <Clock className="w-3 h-3" /> {service.duration} min
                  </span>
                  <span
                    className="text-base font-medium tabular-nums"
                    style={{ color: 'oklch(0.668 0.063 64)' }}
                  >
                    {service.price.toFixed(2).replace('.', ',')}€
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/servicios/${service.id}`}
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
                          `¿Eliminar "${service.name}"? Esta acción no se puede deshacer.`
                        )
                      ) {
                        remove.mutate(service.id)
                      }
                    }}
                    disabled={remove.isPending}
                    className="inline-flex items-center justify-center w-9 h-9 transition-colors disabled:opacity-60"
                    style={{
                      color: 'oklch(0.55 0.18 25)',
                      border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                    }}
                    aria-label={`Eliminar ${service.name}`}
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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-80 animate-pulse"
          style={{ background: 'oklch(0.94 0.005 90)' }}
        />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="p-12 text-center"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      <Sparkles
        className="w-10 h-10 mx-auto mb-4"
        style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
      />
      <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
        {message}
      </p>
    </div>
  )
}
