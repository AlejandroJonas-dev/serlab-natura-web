'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package, ShoppingBag, Search, Leaf, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { productsApi, productCategoriesApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import type { Product, ProductCategory } from '@/types'

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
            <Package className="w-12 h-12" style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }} />
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

      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <span
            className="text-[10px] tracking-[0.2em] uppercase mb-1.5"
            style={{ color: 'oklch(0.668 0.063 64)' }}
          >
            {product.category.name}
          </span>
        )}
        <Link href={`/tienda/${product.slug}`}>
          <h3
            className="text-sm font-medium mb-1 leading-snug line-clamp-2 link-underline link-underline-cobre"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            {product.name}
          </h3>
        </Link>
        {product.brand && (
          <span className="text-xs mb-2" style={{ color: 'oklch(0.656 0.016 78)' }}>
            {product.brand}
          </span>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[oklch(0.656_0.016_78/0.1)]">
          <span
            className="text-xl"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
          >
            {product.price.toFixed(2).replace('.', ',')}€
          </span>
          <button
            onClick={() =>
              !outOfStock &&
              addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                images: product.images,
                stock: product.stock,
              })
            }
            disabled={outOfStock}
            className="flex items-center justify-center w-9 h-9 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { data: catData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productCategoriesApi.getAll().then((r) => r.data),
  })

  const { data: prodData, isLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsApi.getAll({ limit: 100 }).then((r) => r.data),
  })

  const categories: ProductCategory[] = catData?.data?.categories ?? []
  const allProducts: Product[] = prodData?.data?.products ?? []

  const products = useMemo(() => {
    let list = allProducts
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allProducts, activeCategory, search])

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
            className="flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)] mb-8"
          >
            <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span>Tienda</span>
          </nav>
          <div className="flex items-center gap-3 mb-5">
            <span className="rule-cobre" />
            <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
              Herbolario online
            </span>
          </div>
          <h1
            id="tienda-h1"
            className="text-4xl lg:text-5xl mb-6 max-w-2xl"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            Productos naturales
            <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
              seleccionados con criterio.
            </em>
          </h1>
          <p
            className="text-base lg:text-lg max-w-xl leading-relaxed"
            style={{ color: 'oklch(0.45 0 0)' }}
          >
            Fitoterapia, suplementos, cosmética natural y más. Todos elegidos con rigor profesional
            y envíos a toda España.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 lg:py-24" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-[oklch(0.656_0.016_78/0.12)]">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 text-xs tracking-wide transition-all duration-200 ${
                  activeCategory === null
                    ? 'bg-[oklch(0.21_0_0)] text-[oklch(0.979_0.004_90)]'
                    : 'border border-[oklch(0.656_0.016_78/0.3)] text-[oklch(0.45_0_0)] hover:border-[oklch(0.21_0_0)]'
                }`}
              >
                Todo
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 text-xs tracking-wide transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-[oklch(0.21_0_0)] text-[oklch(0.979_0.004_90)]'
                      : 'border border-[oklch(0.656_0.016_78/0.3)] text-[oklch(0.45_0_0)] hover:border-[oklch(0.21_0_0)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

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
                  width: '220px',
                  background: 'oklch(0.962 0.005 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                  color: 'oklch(0.21 0 0)',
                }}
              />
            </div>
          </div>

          {!isLoading && (
            <p className="text-xs mb-6" style={{ color: 'oklch(0.656 0.016 78)' }}>
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          )}

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{ border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}
                >
                  <div className="aspect-square" style={{ background: 'oklch(0.9 0.003 90)' }} />
                  <div className="p-5 space-y-2">
                    <div className="h-3 w-16 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                    <div className="h-4 w-full rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                    <div className="h-4 w-2/3 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Package
                className="w-10 h-10 mx-auto mb-4"
                style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
              />
              <p className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                No hay productos disponibles.
              </p>
              {(activeCategory || search) && (
                <button
                  onClick={() => {
                    setActiveCategory(null)
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
              <div key={title} className="flex items-center gap-3 px-6 py-6 first:pl-0 last:pr-0">
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.551 0.041 147)' }} />
                <div>
                  <p className="text-xs font-medium tracking-wide" style={{ color: 'oklch(0.21 0 0)' }}>
                    {title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'oklch(0.656 0.016 78)' }}>
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
