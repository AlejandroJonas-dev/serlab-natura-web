'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ShoppingBag, Package } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import type { Product } from '@/types'
import { useReveal } from '@/hooks/useReveal'

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock === 0

  return (
    <div
      className={`reveal reveal-delay-${Math.min(index + 1, 4)} group relative flex flex-col card-lift`}
      style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
    >
      {/* Image */}
      <Link href={`/tienda/${product.slug}`} className="img-zoom block aspect-square relative overflow-hidden bg-[oklch(0.962_0.005_90)]">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12" style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }} />
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-[oklch(0.979_0.004_90/0.7)] flex items-center justify-center">
            <span className="text-xs tracking-[0.15em] uppercase text-[oklch(0.656_0.016_78)]">Agotado</span>
          </div>
        )}
        {product.isFeatured && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase"
            style={{ background: 'oklch(0.668 0.063 64)', color: 'oklch(0.979 0.004 90)' }}
          >
            Destacado
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <span className="text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'oklch(0.668 0.063 64)' }}>
            {product.category.name}
          </span>
        )}
        <Link href={`/tienda/${product.slug}`}>
          <h3
            className="text-sm font-medium mb-3 leading-snug line-clamp-2 link-underline link-underline-cobre"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[oklch(0.656_0.016_78/0.1)]">
          <span
            className="text-xl font-medium"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
          >
            {product.price.toFixed(2).replace('.', ',')}€
          </span>
          <button
            onClick={() => !outOfStock && addItem({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              images: product.images,
              stock: product.stock,
            })}
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

export function ProductsSection() {
  const sectionRef = useReveal()

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => productsApi.getAll({ isFeatured: true, limit: 4 }).then((r) => r.data),
  })

  const products: Product[] = data?.data?.products ?? []

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-24 lg:py-32"
      style={{ background: 'oklch(0.962 0.005 90)' }}
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="reveal grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase text-[oklch(0.668_0.063_64)]">
                Herbolario online
              </span>
            </div>
            <h2
              id="products-heading"
              className="text-3xl lg:text-4xl"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              Un herbolario
              <em className="block not-italic italic" style={{ color: 'oklch(0.551 0.041 147)' }}>
                en tu pantalla.
              </em>
            </h2>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-[oklch(0.45_0_0)] mb-6">
              Complementos alimenticios, fitoterapia, cosmética natural, seleccionados con criterio
              profesional. Envíos a toda España.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 text-sm tracking-wide link-underline link-underline-cobre transition-colors duration-200"
              style={{ color: 'oklch(0.21 0 0)' }}
            >
              Explorar toda la tienda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse" style={{ border: '1px solid oklch(0.656 0.016 78 / 0.1)' }}>
                <div className="aspect-square" style={{ background: 'oklch(0.9 0.003 90)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-16 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                  <div className="h-4 w-full rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                  <div className="h-4 w-2/3 rounded" style={{ background: 'oklch(0.9 0.003 90)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        ) : (
          /* No featured products yet — show placeholder grid */
          <div className="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLACEHOLDER_PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                className={`reveal-delay-${i + 1} card-lift group`}
                style={{ background: 'oklch(0.979 0.004 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
              >
                <Link href="/tienda" className="block aspect-square flex items-center justify-center" style={{ background: 'oklch(0.951 0.008 90)' }}>
                  <div className="text-4xl select-none">{p.emoji}</div>
                </Link>
                <div className="p-5">
                  <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>{p.cat}</span>
                  <p className="text-sm font-medium mt-1 mb-3 leading-snug" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}>{p.name}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-[oklch(0.656_0.016_78/0.1)]">
                    <span className="text-xl font-medium" style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}>{p.price}€</span>
                    <Link href="/tienda" className="flex items-center justify-center w-9 h-9" style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}>
                      <ShoppingBag className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const PLACEHOLDER_PRODUCTS = [
  { name: 'Mezcla de hierbas digestivas', cat: 'Infusiones', price: '12,90', emoji: '🌿' },
  { name: 'Aceite esencial de lavanda', cat: 'Aceites esenciales', price: '18,50', emoji: '💜' },
  { name: 'Magnesio marino 60 cáps.', cat: 'Suplementos', price: '24,90', emoji: '✨' },
  { name: 'Crema facial con aloe vera', cat: 'Cosmética natural', price: '32,00', emoji: '🌱' },
]
