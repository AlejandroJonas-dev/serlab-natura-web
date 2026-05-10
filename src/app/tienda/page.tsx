'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { productsApi, productCategoriesApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import type { Product, ProductCategoryNode } from '@/types'

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
// Foto-first editorial: la imagen del producto es la protagonista.
// Sin iconos decorativos; solo tipografía y la propia foto cuentan la historia.
function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock === 0

  const formattedPrice = product.price.toFixed(2).replace('.', ',')
  // Detectar la "subdescripción" tras la barra: "Bileina 60 perlas / Bote 60 perlas"
  const [mainName, ...subParts] = product.name.split(' / ')
  const subtitle = subParts.join(' / ').trim() || null

  return (
    <article
      className={`reveal reveal-delay-${Math.min((index % 6) + 1, 6)} group flex flex-col`}
      style={{
        background: 'oklch(0.979 0.004 90)',
        border: '1px solid oklch(0.656 0.016 78 / 0.12)',
        borderColor: product.isFeatured
          ? 'oklch(0.668 0.063 64 / 0.5)'
          : 'oklch(0.656 0.016 78 / 0.12)',
      }}
    >
      <Link
        href={`/tienda/${product.slug}`}
        className="block aspect-[4/5] relative overflow-hidden"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              filter: outOfStock ? 'grayscale(0.85)' : 'none',
              opacity: outOfStock ? 0.65 : 1,
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-3xl"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.656 0.016 78 / 0.45)',
            }}
          >
            ·
          </div>
        )}

        {product.isFeatured && !outOfStock && (
          <span
            className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            — Selección
          </span>
        )}

        {outOfStock && (
          <span
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center text-xs tracking-[0.4em] uppercase py-2"
            style={{
              background: 'oklch(0.979 0.004 90 / 0.92)',
              color: 'oklch(0.21 0 0)',
              fontFamily: 'var(--font-playfair), serif',
            }}
          >
            Agotado
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col p-5 lg:p-6">
        <p
          className="text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          {product.category?.name ?? 'Producto'}
        </p>

        <h3
          className="text-[17px] leading-[1.25] mb-1"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          <Link
            href={`/tienda/${product.slug}`}
            className="transition-colors hover:text-[oklch(0.668_0.063_64)]"
          >
            {mainName}
          </Link>
        </h3>

        {subtitle && (
          <p
            className="text-xs italic leading-snug mb-4"
            style={{
              fontFamily: 'var(--font-playfair), serif',
              color: 'oklch(0.45 0 0)',
            }}
          >
            {subtitle}
          </p>
        )}

        <div
          className="flex items-baseline justify-between mt-auto pt-5 border-t"
          style={{ borderColor: 'oklch(0.656 0.016 78 / 0.18)' }}
        >
          <span
            className="text-base font-medium tabular-nums"
            style={{
              color: 'oklch(0.21 0 0)',
              fontFamily: 'var(--font-playfair), serif',
            }}
          >
            {formattedPrice}€
          </span>

          <button
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
            disabled={outOfStock}
            className="group/btn inline-flex items-baseline gap-2 text-[11px] tracking-[0.25em] uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: 'oklch(0.21 0 0)' }}
            aria-label={`Añadir ${product.name} al carrito`}
          >
            <span className="border-b border-[oklch(0.21_0_0)] group-hover/btn:border-[oklch(0.668_0.063_64)] group-hover/btn:text-[oklch(0.668_0.063_64)] transition-colors pb-0.5">
              Añadir
            </span>
            <span
              aria-hidden
              className="transition-transform group-hover/btn:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
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

  const products = useMemo(() => {
    let list = allProducts
    if (activeCategoryId) {
      const allowedIds =
        descendantIdsById.get(activeCategoryId) ?? new Set([activeCategoryId])
      list = list.filter((p) => allowedIds.has(p.categoryId))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q),
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
                  for (const [cid, path] of pathById) {
                    if (
                      path.length === idx + 1 &&
                      path.every((p, j) => p === breadcrumb[j])
                    )
                      return cid
                  }
                  return acc
                },
                null,
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
                <p
                  className="text-xs tracking-wider uppercase"
                  style={{ color: 'oklch(0.656 0.016 78)' }}
                >
                  {productsQuery.isLoading
                    ? 'Cargando...'
                    : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
                </p>

                <div className="relative flex-shrink-0">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div
                        className="aspect-[4/5]"
                        style={{ background: 'oklch(0.94 0.005 90)' }}
                      />
                      <div className="p-5 space-y-3">
                        <div
                          className="h-2.5 w-20 rounded"
                          style={{ background: 'oklch(0.94 0.005 90)' }}
                        />
                        <div
                          className="h-4 w-full rounded"
                          style={{ background: 'oklch(0.94 0.005 90)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              ) : (
                <div
                  className="py-24 text-center"
                  style={{
                    background: 'oklch(0.962 0.005 90)',
                    border: '1px solid oklch(0.656 0.016 78 / 0.12)',
                  }}
                >
                  <p
                    className="text-2xl mb-3"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      color: 'oklch(0.21 0 0)',
                    }}
                  >
                    Sin resultados
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    No hay productos en esta selección.
                  </p>
                  {(activeCategoryId || search) && (
                    <button
                      onClick={() => {
                        handleSelectCategory(null)
                        setSearch('')
                      }}
                      className="text-xs tracking-[0.2em] uppercase transition-colors"
                      style={{ color: 'oklch(0.668 0.063 64)' }}
                    >
                      — Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar — type-only, sin iconos */}
      <section
        className="border-t border-[oklch(0.656_0.016_78/0.15)]"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                num: '01',
                title: '100% natural',
                sub: 'Selección profesional, sin parabenos ni siliconas.',
              },
              {
                num: '02',
                title: 'Envío a España',
                sub: 'Gratis a partir de 50€. Entrega en 2-5 días.',
              },
              {
                num: '03',
                title: 'Pago seguro',
                sub: 'Tarjeta, Bizum o transferencia. Sin sorpresas.',
              },
              {
                num: '04',
                title: 'Devoluciones',
                sub: '30 días para que lo pruebes con calma.',
              },
            ].map(({ num, title, sub }) => (
              <div key={num} className="flex items-start gap-4">
                <span
                  className="text-2xl tabular-nums leading-none flex-shrink-0"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.668 0.063 64)',
                  }}
                >
                  {num}
                </span>
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-1.5"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'oklch(0.45 0 0)' }}
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
