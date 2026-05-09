'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  Edit2,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { productCategoriesApi, productsApi } from '@/lib/api'
import type { Product, ProductCategory } from '@/types'

export default function AdminProductosPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | 'ALL'>('ALL')
  const [showInactive, setShowInactive] = useState(true)
  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsApi.getAll().then((r) => r.data),
  })
  const categoriesQuery = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productCategoriesApi.getAll().then((r) => r.data),
  })

  const products: Product[] = productsQuery.data?.data?.products ?? []
  const categories: ProductCategory[] =
    categoriesQuery.data?.data?.categories ?? []

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!showInactive && !p.isActive) return false
      if (categoryFilter !== 'ALL' && p.categoryId !== categoryFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          (p.brand?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [products, search, categoryFilter, showInactive])

  const remove = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
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
              Catálogo
            </span>
          </div>
          <h1
            className="text-3xl lg:text-4xl"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            Productos
          </h1>
          <p
            className="text-xs mt-2"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            {filtered.length} de {products.length} producto
            {products.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-3 text-xs tracking-wide uppercase transition-colors"
          style={{
            background: 'oklch(0.21 0 0)',
            color: 'oklch(0.979 0.004 90)',
          }}
        >
          <Plus className="w-4 h-4" /> Nuevo producto
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
            placeholder="Buscar por nombre o marca..."
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

      {productsQuery.isLoading ? (
        <SkeletonGrid />
      ) : productsQuery.isError ? (
        <p
          className="p-5 text-sm"
          style={{
            background: 'oklch(0.96 0.05 25)',
            border: '1px solid oklch(0.6 0.18 25 / 0.4)',
            color: 'oklch(0.4 0.18 25)',
          }}
        >
          No se pudieron cargar los productos.
        </p>
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? `Sin resultados para "${search}"` : 'No hay productos.'}
        />
      ) : (
        <div
          className="overflow-hidden"
          style={{
            background: 'oklch(0.99 0.004 90)',
            border: '1px solid oklch(0.656 0.016 78 / 0.18)',
          }}
        >
          {/* Header */}
          <div
            className="hidden lg:grid grid-cols-[64px_1fr_140px_100px_100px_140px] gap-4 px-5 py-3 text-[11px] tracking-wide uppercase border-b"
            style={{
              background: 'oklch(0.96 0.005 90)',
              color: 'oklch(0.45 0 0)',
              borderColor: 'oklch(0.656 0.016 78 / 0.18)',
            }}
          >
            <span></span>
            <span>Producto</span>
            <span>Categoría</span>
            <span className="text-right">Precio</span>
            <span className="text-right">Stock</span>
            <span>Acciones</span>
          </div>

          <ul>
            {filtered.map((product) => (
              <li
                key={product.id}
                className="grid grid-cols-[64px_1fr] lg:grid-cols-[64px_1fr_140px_100px_100px_140px] gap-3 lg:gap-4 px-5 py-4 items-center border-b last:border-b-0"
                style={{
                  borderColor: 'oklch(0.656 0.016 78 / 0.12)',
                  opacity: product.isActive ? 1 : 0.6,
                }}
              >
                {/* Image */}
                <div
                  className="relative w-12 h-12 overflow-hidden flex-shrink-0"
                  style={{
                    background: 'oklch(0.96 0.005 90)',
                    border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                  }}
                >
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package
                        className="w-4 h-4"
                        style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Name + meta */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="text-sm font-medium hover:text-[oklch(0.668_0.063_64)] transition-colors truncate"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {product.name}
                    </Link>
                    {product.isFeatured && (
                      <Star
                        className="w-3.5 h-3.5 flex-shrink-0"
                        fill="oklch(0.668 0.063 64)"
                        style={{ color: 'oklch(0.668 0.063 64)' }}
                      />
                    )}
                    {!product.isActive && (
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
                  {product.brand && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                    >
                      {product.brand}
                    </p>
                  )}
                  {/* Mobile-only meta */}
                  <p
                    className="text-xs mt-1 lg:hidden"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    {product.price.toFixed(2).replace('.', ',')}€ · Stock:{' '}
                    <span
                      className={
                        product.stock <= 5 ? 'font-medium' : ''
                      }
                      style={
                        product.stock <= 5
                          ? { color: 'oklch(0.55 0.18 25)' }
                          : undefined
                      }
                    >
                      {product.stock}
                    </span>
                  </p>
                </div>

                {/* Category */}
                <span
                  className="hidden lg:inline text-xs"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  {product.category?.name ?? '—'}
                </span>

                {/* Price */}
                <span
                  className="hidden lg:block text-sm font-medium tabular-nums text-right"
                  style={{ color: 'oklch(0.21 0 0)' }}
                >
                  {product.price.toFixed(2).replace('.', ',')}€
                </span>

                {/* Stock */}
                <span
                  className="hidden lg:flex items-center gap-1.5 text-sm tabular-nums justify-end"
                  style={
                    product.stock <= 5
                      ? { color: 'oklch(0.55 0.18 25)' }
                      : { color: 'oklch(0.21 0 0)' }
                  }
                >
                  {product.stock <= 5 && (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  {product.stock}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 col-span-2 lg:col-span-1">
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors"
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
                          `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`
                        )
                      ) {
                        remove.mutate(product.id)
                      }
                    }}
                    disabled={remove.isPending}
                    className="inline-flex items-center justify-center w-7 h-7 transition-colors disabled:opacity-60"
                    style={{
                      color: 'oklch(0.55 0.18 25)',
                      border: '1px solid oklch(0.55 0.18 25 / 0.4)',
                    }}
                    aria-label={`Eliminar ${product.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'oklch(0.99 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.18)',
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-16 animate-pulse border-b last:border-b-0"
          style={{
            background: 'oklch(0.99 0.004 90)',
            borderColor: 'oklch(0.656 0.016 78 / 0.12)',
          }}
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
      <Package
        className="w-10 h-10 mx-auto mb-4"
        style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
      />
      <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
        {message}
      </p>
    </div>
  )
}
