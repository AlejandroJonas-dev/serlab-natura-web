'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { serviceCategoriesApi, servicesApi } from '@/lib/api'
import type { ServiceCategory } from '@/types'

export default function AdminServicioNuevoPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: ['service-categories'],
    queryFn: () => serviceCategoriesApi.getAll().then((r) => r.data),
  })
  const categories: ServiceCategory[] =
    categoriesQuery.data?.data?.categories ?? []

  const create = useMutation({
    mutationFn: (formData: FormData) => servicesApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      router.push('/admin/servicios')
    },
  })

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
            Crear servicio
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Nuevo servicio
        </h1>
      </header>

      <ServiceForm
        initial={null}
        categories={categories}
        onSubmit={(formData) => create.mutate(formData)}
        submitLabel="Crear servicio"
        onCancel={() => router.push('/admin/servicios')}
        submitting={create.isPending}
        errorMessage={
          create.isError ? (create.error as Error).message : undefined
        }
      />
    </div>
  )
}
