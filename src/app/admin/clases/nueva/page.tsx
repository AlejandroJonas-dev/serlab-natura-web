'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { ClassForm } from '@/components/admin/ClassForm'
import { classesApi } from '@/lib/api'

export default function AdminClaseNuevaPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (formData: FormData) => classesApi.create(formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      const id = res.data?.data?.class?.id as string | undefined
      // Si se creó correctamente, ir directamente a la edición para añadir horarios
      router.push(id ? `/admin/clases/${id}` : '/admin/clases')
    },
  })

  return (
    <div className="max-w-[1100px] mx-auto">
      <Link
        href="/admin/clases"
        className="inline-flex items-center gap-1 text-xs tracking-wide uppercase mb-6 transition-colors hover:text-[oklch(0.668_0.063_64)]"
        style={{ color: 'oklch(0.45 0 0)' }}
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Volver al listado
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rule-cobre" />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            Crear clase
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Nueva clase
        </h1>
        <p
          className="text-xs mt-2 max-w-md"
          style={{ color: 'oklch(0.656 0.016 78)' }}
        >
          Tras crearla, podrás añadir los horarios desde la pantalla de
          edición.
        </p>
      </header>

      <ClassForm
        initial={null}
        onSubmit={(formData) => create.mutate(formData)}
        submitLabel="Crear clase"
        onCancel={() => router.push('/admin/clases')}
        submitting={create.isPending}
        errorMessage={
          create.isError ? (create.error as Error).message : undefined
        }
      />
    </div>
  )
}
