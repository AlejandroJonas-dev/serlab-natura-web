'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { serviceCategoriesApi, servicesApi } from '@/lib/api'
import type { Service, ServiceCategory } from '@/types'

export default function AdminServicioEditPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const id = params.id as string

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
  const service = services.find((s) => s.id === id) ?? null

  const update = useMutation({
    mutationFn: (formData: FormData) => servicesApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      router.push('/admin/servicios')
    },
  })

  if (servicesQuery.isLoading) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-4">
        <div
          className="h-6 w-40 animate-pulse"
          style={{ background: 'oklch(0.94 0.005 90)' }}
        />
        <div
          className="h-10 w-72 animate-pulse"
          style={{ background: 'oklch(0.94 0.005 90)' }}
        />
        <div
          className="h-96 animate-pulse"
          style={{ background: 'oklch(0.94 0.005 90)' }}
        />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="max-w-[1100px] mx-auto">
        <p
          className="p-5 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          No se encontró el servicio solicitado.{' '}
          <Link href="/admin/servicios" className="underline">
            Volver al catálogo
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <Link
        href="/admin/servicios"
        className="inline-flex items-center gap-1 text-xs tracking-wide uppercase mb-6 transition-colors hover:text-[oklch(0.668_0.063_64)]"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Volver al catálogo
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Editar servicio
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          {service.name}
        </h1>
      </header>

      <ServiceForm
        initial={service}
        categories={categories}
        onSubmit={(formData) => update.mutate(formData)}
        submitLabel="Guardar cambios"
        onCancel={() => router.push('/admin/servicios')}
        submitting={update.isPending}
        errorMessage={
          update.isError ? (update.error as Error).message : undefined
        }
      />
    </div>
  )
}
