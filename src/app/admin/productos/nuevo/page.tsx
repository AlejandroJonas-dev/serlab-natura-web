'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import { productCategoriesApi, productsApi } from '@/lib/api'
import type { ProductCategory } from '@/types'

export default function AdminProductoNuevoPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productCategoriesApi.getAll().then((r) => r.data),
  })
  const categories: ProductCategory[] =
    categoriesQuery.data?.data?.categories ?? []

  const create = useMutation({
    mutationFn: (formData: FormData) => productsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      router.push('/admin/productos')
    },
  })

  return (
    <div className="max-w-[1100px] mx-auto">
      <Link
        href="/admin/productos"
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
            Crear producto
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Nuevo producto
        </h1>
      </header>

      <ProductForm
        initial={null}
        categories={categories}
        onSubmit={(formData) => create.mutate(formData)}
        submitLabel="Crear producto"
        onCancel={() => router.push('/admin/productos')}
        submitting={create.isPending}
        errorMessage={
          create.isError ? (create.error as Error).message : undefined
        }
      />
    </div>
  )
}
