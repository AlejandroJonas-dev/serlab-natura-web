'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ShoppingBag,
  Package,
  Minus,
  Plus,
  CheckCircle2,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  })

  const product: Product | undefined = data?.data?.product

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
        stock: product.stock,
      },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'oklch(0.979 0.004 90)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <div
              className="aspect-square animate-pulse"
              style={{ background: 'oklch(0.9 0.003 90)' }}
            />
            <div className="space-y-4 pt-8">
              <div className="h-4 w-24 rounded animate-pulse" style={{ background: 'oklch(0.9 0.003 90)' }} />
              <div className="h-9 w-3/4 rounded animate-pulse" style={{ background: 'oklch(0.9 0.003 90)' }} />
              <div className="h-10 w-32 rounded animate-pulse" style={{ background: 'oklch(0.9 0.003 90)' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'oklch(0.979 0.004 90)' }}
      >
        <h1
          className="text-2xl"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          Producto no encontrado
        </h1>
        <Link href="/tienda" className="text-sm underline" style={{ color: 'oklch(0.668 0.063 64)' }}>
          ← Volver a la tienda
        </Link>
      </div>
    )
  }

  const outOfStock = product.stock === 0
  const images = product.images?.length > 0 ? product.images : []

  return (
    <main style={{ background: 'oklch(0.979 0.004 90)' }}>
      {/* Breadcrumb */}
      <div
        className="py-4 px-6 lg:px-8 border-b border-[oklch(0.656_0.016_78/0.1)]"
        style={{ background: 'oklch(0.962 0.005 90)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[oklch(0.656_0.016_78)]">
          <Link href="/" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-[oklch(0.668_0.063_64)] transition-colors">
            Tienda
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Images */}
          <div>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
              style={{ color: 'oklch(0.656 0.016 78)' }}
            >
              <ArrowLeft className="w-4 h-4" /> Volver a la tienda
            </Link>

            <div
              className="aspect-square relative overflow-hidden mb-3"
              style={{
                background: 'oklch(0.962 0.005 90)',
                border: '1px solid oklch(0.656 0.016 78 / 0.15)',
              }}
            >
              {images[activeImage] ? (
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20" style={{ color: 'oklch(0.656 0.016 78 / 0.3)' }} />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 overflow-hidden flex-shrink-0 transition-all ${
                      activeImage === i
                        ? 'ring-2 ring-[oklch(0.668_0.063_64)]'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                    style={{
                      background: 'oklch(0.962 0.005 90)',
                      border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                    }}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info + Cart */}
          <div className="lg:pt-12">
            <div className="flex items-center gap-3 mb-4">
              {product.category && (
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {product.category.name}
                </span>
              )}
              {product.isFeatured && (
                <span
                  className="px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase"
                  style={{ background: 'oklch(0.668 0.063 64)', color: 'oklch(0.979 0.004 90)' }}
                >
                  Destacado
                </span>
              )}
            </div>

            <h1
              className="text-3xl lg:text-4xl mb-2"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-sm mb-6" style={{ color: 'oklch(0.656 0.016 78)' }}>
                por {product.brand}
              </p>
            )}

            <div className="flex items-end gap-3 mb-5">
              <span
                className="text-4xl"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
              >
                {product.price.toFixed(2).replace('.', ',')}€
              </span>
              <span className="text-sm mb-1" style={{ color: 'oklch(0.656 0.016 78)' }}>
                IVA incluido
              </span>
            </div>

            <div className="flex items-center gap-2 mb-7">
              <div
                className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-red-400' : 'bg-green-500'}`}
              />
              <span className="text-sm" style={{ color: 'oklch(0.45 0 0)' }}>
                {outOfStock ? 'Sin stock' : `En stock (${product.stock} uds.)`}
              </span>
            </div>

            {product.shortDescription && (
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: 'oklch(0.45 0 0)' }}
              >
                {product.shortDescription}
              </p>
            )}

            {!outOfStock ? (
              <div className="flex items-stretch gap-3 mb-8">
                <div
                  className="flex items-center border border-[oklch(0.656_0.016_78/0.3)]"
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-[oklch(0.962_0.005_90)] transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span
                    className="w-12 text-center text-sm font-medium py-3"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-[oklch(0.962_0.005_90)] transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium tracking-wide transition-all duration-300"
                  style={{
                    background: added ? 'oklch(0.551 0.041 147)' : 'oklch(0.21 0 0)',
                    color: 'oklch(0.979 0.004 90)',
                  }}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Añadido
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Añadir al carrito
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                className="py-3 px-4 text-sm text-center mb-8"
                style={{
                  background: 'oklch(0.962 0.005 90)',
                  color: 'oklch(0.656 0.016 78)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                }}
              >
                Temporalmente sin stock
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[oklch(0.656_0.016_78/0.12)]">
              {[
                { Icon: Truck, label: 'Envío a España' },
                { Icon: Shield, label: 'Certificado' },
                { Icon: RotateCcw, label: '30 días' },
              ].map(({ Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: 'oklch(0.551 0.041 147)' }} />
                  <p className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full description */}
        {product.description && (
          <div className="mt-16 pt-12 border-t border-[oklch(0.656_0.016_78/0.12)]">
            <h2
              className="text-2xl mb-6"
              style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
            >
              Descripción del producto
            </h2>
            <p
              className="text-sm leading-relaxed max-w-3xl whitespace-pre-line"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              {product.description}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
