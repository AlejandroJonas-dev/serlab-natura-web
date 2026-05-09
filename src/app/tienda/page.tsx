'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronDown,
  ChevronRight,
  Leaf,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import { productsApi, productCategoriesApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import type { Product, ProductCategoryNode } from '@/types'

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock === 0

  return (
    <div
      className={`reveal reveal-delay-${Math.min((index % 6) + 1, 6)} group flex flex-col card-lift`}
      style={{
        background: 'oklch(0.979 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.15)',
      }}
    >
      <Link
        href={`/tienda/${product.slug}`}
        className="block aspect-square relative overflow-hidden img-zoom"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package
              className="w-12 h-12"
              style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
            />
          </div>
        )}
        {outOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'oklch(0.979 0.004 90 / 0.75)' }}
          >
            <span
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: 'oklch(0.656 0.016 78)' }}
            >
              Agotado
            </span>
          </div>
        )}
        {product.isFeatured && !outOfStock && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase"
            style={{ background: 'oklch(0.668 0.063 64)', color: 'oklch(0.979 0.004 90)' }}
          >
            Destacado
          </div>
        )}
      </Link>

      <div className="flex-1 flex flex-col p-5">
        <p
          className="text-[10px] tracking-[0.2em] uppercase mb-2"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          {product.category?.name ?? 'Producto'}
        </p>
        <h3
          className="text-base leading-snug mb-2 flex-1"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          <Link
            href={`/tienda/${product.slug}`}
            className="hover:text-[oklch(0.668_0.063_64)] transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        {product.brand && (
          <p
            className="text-xs mb-3"
            style={{ color: 'oklch(0.656 0.016 78)' }}
          >
            {product.brand}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-base font-medium tabular-nums"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            {product.price.toFixed(2).replace('.', ',')}€
          </span>
          <button
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
            disabled={outOfStock}
            className="w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'oklch(0.21 0 0)',
              color: 'oklch(0.979 0.004 90)',
            }}
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TiendaPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const treeQuery = useQuery({
    queryKey: ['product-categories', 'tree'],
    queryFn: () =>
      productCategoriesApi
        .getAll({ tree: true, includeCount: true })
        .then((r) => r.data),
  })
  const productsQuery = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAll({ limit: 200 }).then((r) => r.data),
  })

  const tree: ProductCategoryNode[] = treeQuery.data?.data?.categories ?? []
  const allProducts: Product[] = productsQuery.data?.data?.products ?? []

  // Mapas auxiliares: ruta y descendientes para cada categoría
  const { pathById, descendantIdsById, byId } = useMemo(() => {
    const pathMap = new Map<string, string[]>()
    const descMap = new Map<string, Set<string>>()
    const byIdMap = new Map<string, ProductCategoryNode>()

    const collectDescendants = (node: ProductCategoryNode): Set<string> => {
      const ids = new Set<string>([node.id])
      node.children.forEach((child) => {
        const childIds = collectDescendants(child)
        childIds.forEach((id) => ids.add(id))
      })
      descMap.set(node.id, ids)
      return ids
    }

    const walk = (nodes: ProductCategoryNode[], parents: string[]) => {
      nodes.forEach((n) => {
        byIdMap.set(n.id, n)
        const path = [...parents, n.name]
        pathMap.set(n.id, path)
        walk(n.children, path)
      })
    }

    walk(tree, [])
    tree.forEach(collectDescendants)

    return { pathById: pathMap, descendantIdsById: descMap, byId: byIdMap }
  }, [tree])

  // Filtrado: por categoría (incluyendo descendientes) + búsqueda
  const products = useMemo(() => {
    let list = allProducts
    if (activeCategoryId) {
      const allowedIds = descendantIdsById.get(activeCategoryId) ?? new Set([activeCategoryId])
      list = list.filter((p) => allowedIds.has(p.categoryId))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allProducts, activeCategoryId, descendantIdsById, search])

  const breadcrumb = activeCategoryId ? pathById.get(activeCategoryId) ?? [] : []

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleSelectCategory = (id: string | null) => {
    setActiveCategoryId(id)
    setMobileFiltersOpen(false)
    if (id) {
      // Auto-expand ancestors (open the tree to show selected)
      setExpanded((prev) => {
        const next = new Set(prev)
        let current = byId.get(id)
        while (current?.parentId) {
          next.add(current.parentId)
          current = byId.get(current.parentId)
        }
        return next
      })
    }
  }

  return (
    <main>
      {/* Hero */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: 'oklch(0.962 0.005 90)' }}
        aria-labelledby="tienda-h1"
      >
        <div
          aria-hidden
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent 0%, oklch(0.668 0.063 64 / 0.04) 100%)',
            clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8 flex-wrap"
          >
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <button
              onClick={() => handleSelectCategory(null)}
              className="hover:text-[oklch(0.668_0.063_64)] transition-colors"
            >
              Tienda
            </button>
            {breadcrumb.map((name, idx) => {
              const id = breadcrumb.slice(0, idx + 1).reduce<string | null>(
                (acc, _, i) => {
                  if (i !== idx) return acc
                  // find category whose path matches
                  for (const [cid, path] of pathById) {
                    if (
                      path.length === idx + 1 &&
                      path.every((p, j) => p === breadcrumb[j])
                    )
                      return cid
                  }
                  return acc
                },
                null
              )
              const isLast = idx === breadcrumb.length - 1
              return (
                <span key={`${name}-${idx}`} className="flex items-center gap-2">
                  <span>/</span>
                  {isLast ? (
                    <span style={{ color: 'oklch(0.21 0 0)' }}>{name}</span>
                  ) : (
                    <button
                      onClick={() => id && handleSelectCategory(id)}
                      className="hover:text-[oklch(0.668_0.063_64)] transition-colors"
                    >
                      {name}
                    </button>
                  )}
                </span>
              )
            })}
          </nav>
          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              {activeCategoryId
                ? breadcrumb[breadcrumb.length - 1] ?? 'Categoría'
                : 'Herbolario online'}
            </span>
          </div>
          <h1
            id="tienda-h1"
            className="text-4xl lg:text-5xl mb-6 max-w-2xl"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.21 0 0)',
            }}
          >
            {activeCategoryId ? (
              breadcrumb[breadcrumb.length - 1]
            ) : (
              <>
                Productos naturales
                <em
                  className="block not-italic italic"
                  style={{ color: 'oklch(0.551 0.041 147)' }}
                >
                  seleccionados con criterio.
                </em>
              </>
            )}
          </h1>
          {!activeCategoryId && (
            <p
              className="text-base lg:text-lg max-w-xl leading-relaxed"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              Fitoterapia, suplementos, cosmética natural y más. Todos elegidos
              con rigor profesional y envíos a toda España.
            </p>
          )}
        </div>
      </section>

      {/* Sidebar + Grid */}
      <section
        className="py-12 lg:py-16"
        style={{ background: 'oklch(0.979 0.004 90)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-12 items-start">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden flex items-center justify-between w-full px-4 py-3 text-sm transition-colors"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                color: 'oklch(0.21 0 0)',
              }}
            >
              <span>
                {activeCategoryId
                  ? `Filtro: ${breadcrumb[breadcrumb.length - 1]}`
                  : 'Filtrar por categoría'}
              </span>
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{
                  transform: mobileFiltersOpen ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>

            {/* Sidebar */}
            <aside
              className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}
              aria-label="Categorías"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="rule-cobre" />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  Categorías
                </span>
              </div>

              <button
                onClick={() => handleSelectCategory(null)}
                className="block w-full text-left text-sm py-2 mb-2 transition-colors"
                style={{
                  color:
                    activeCategoryId === null
                      ? 'oklch(0.668 0.063 64)'
                      : 'oklch(0.21 0 0)',
                  fontFamily: 'var(--font-playfair), serif',
                  fontWeight: activeCategoryId === null ? 500 : 400,
                  borderBottom:
                    activeCategoryId === null
                      ? '1px solid oklch(0.668 0.063 64)'
                      : '1px solid transparent',
                  paddingBottom: '6px',
                  width: 'fit-content',
                }}
              >
                Todos los productos
              </button>

              {treeQuery.isLoading ? (
                <div className="space-y-2 pt-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 animate-pulse"
                      style={{ background: 'oklch(0.94 0.005 90)' }}
                    />
                  ))}
                </div>
              ) : (
                <CategoryTree
                  nodes={tree}
                  expanded={expanded}
                  activeId={activeCategoryId}
                  onToggle={toggleExpand}
                  onSelect={handleSelectCategory}
                  level={0}
                />
              )}
            </aside>

            {/* Grid area */}
            <div className="min-w-0">
              {/* Search + count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[oklch(0.656_0.016_78/0.12)]">
                <p className="text-xs" style={{ color: 'oklch(0.656 0.016 78)' }}>
                  {productsQuery.isLoading
                    ? 'Cargando...'
                    : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
                </p>

                <div className="relative flex-shrink-0">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar productos..."
                    className="pl-9 pr-4 py-2 text-sm focus:outline-none transition-colors"
                    style={{
                      width: '240px',
                      background: 'oklch(0.962 0.005 90)',
                      border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                      color: 'oklch(0.21 0 0)',
                    }}
                  />
                </div>
              </div>

              {productsQuery.isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse"
                      style={{ border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
                    >
                      <div
                        className="aspect-square"
                        style={{ background: 'oklch(0.9 0.003 90)' }}
                      />
                      <div className="p-5 space-y-2">
                        <div
                          className="h-3 w-16 rounded"
                          style={{ background: 'oklch(0.9 0.003 90)' }}
                        />
                        <div
                          className="h-4 w-full rounded"
                          style={{ background: 'oklch(0.9 0.003 90)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Package
                    className="w-10 h-10 mx-auto mb-4"
                    style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
                  />
                  <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                    No hay productos en esta selección.
                  </p>
                  {(activeCategoryId || search) && (
                    <button
                      onClick={() => {
                        handleSelectCategory(null)
                        setSearch('')
                      }}
                      className="text-sm mt-3 underline"
                      style={{ color: 'oklch(0.668 0.063 64)' }}
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section
        className="border-t border-[oklch(0.656_0.016_78/0.12)]"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[oklch(0.656_0.016_78/0.1)]">
            {[
              { Icon: Leaf, title: '100% natural', sub: 'Selección profesional' },
              { Icon: Truck, title: 'Envío a España', sub: 'Gratis desde 50€' },
              { Icon: ShieldCheck, title: 'Pago seguro', sub: 'Cifrado SSL' },
              { Icon: RotateCcw, title: 'Devoluciones', sub: '30 días garantizados' },
            ].map(({ Icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 px-6 py-6 first:pl-0 last:pr-0"
              >
                <Icon
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: 'oklch(0.551 0.041 147)' }}
                />
                <div>
                  <p
                    className="text-xs font-medium tracking-wide"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  >
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CategoryTree({
  nodes,
  expanded,
  activeId,
  onToggle,
  onSelect,
  level,
}: {
  nodes: ProductCategoryNode[]
  expanded: Set<string>
  activeId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  level: number
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0
        const isOpen = expanded.has(node.id)
        const isActive = activeId === node.id
        return (
          <li key={node.id}>
            <div
              className="flex items-center gap-1 group"
              style={{ paddingLeft: level === 0 ? 0 : `${level * 14}px` }}
            >
              <button
                onClick={() => hasChildren && onToggle(node.id)}
                className="w-5 h-5 flex-shrink-0 flex items-center justify-center"
                style={{
                  color: hasChildren
                    ? 'oklch(0.656 0.016 78)'
                    : 'transparent',
                }}
                aria-label={isOpen ? 'Cerrar' : 'Abrir'}
                disabled={!hasChildren}
              >
                {hasChildren && isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : hasChildren ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : null}
              </button>

              <button
                onClick={() => onSelect(node.id)}
                className="flex-1 text-left py-1.5 text-sm transition-colors truncate"
                style={{
                  color: isActive
                    ? 'oklch(0.668 0.063 64)'
                    : level === 0
                      ? 'oklch(0.21 0 0)'
                      : 'oklch(0.45 0 0)',
                  fontFamily:
                    level === 0 ? 'var(--font-playfair), serif' : undefined,
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {node.name}
                {typeof node.productCount === 'number' &&
                  node.productCount > 0 && (
                    <span
                      className="ml-1.5 text-[10px] tabular-nums"
                      style={{ color: 'oklch(0.656 0.016 78)' }}
                    >
                      ({node.productCount})
                    </span>
                  )}
              </button>
            </div>

            {hasChildren && isOpen && (
              <CategoryTree
                nodes={node.children}
                expanded={expanded}
                activeId={activeId}
                onToggle={onToggle}
                onSelect={onSelect}
                level={level + 1}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
