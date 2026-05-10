'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'

const FREE_SHIPPING_THRESHOLD = 50

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const subtotal = totalPrice()
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 4.99
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <main
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'oklch(0.979 0.004 90)' }}
      >
        <ShoppingBag
          className="w-16 h-16 mb-6"
          style={{ color: 'oklch(0.656 0.016 78 / 0.4)' }}
        />
        <h1
          className="text-2xl mb-3"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
        >
          Tu carrito está vacío
        </h1>
        <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'oklch(0.45 0 0)' }}>
          Explora nuestra tienda y añade los productos que más te interesen.
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300"
          style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
        >
          Ir a la tienda <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    )
  }

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
          <span>Carrito</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex items-center gap-3 mb-10">
          <span className="rule-cobre" />
          <h1
            className="text-3xl lg:text-4xl"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
          >
            Tu carrito
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          {/* Items list */}
          <div>
            <div className="space-y-px" style={{ background: 'oklch(0.656 0.016 78 / 0.1)' }}>
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-5 p-5 sm:p-6"
                  style={{ background: 'oklch(0.979 0.004 90)' }}
                >
                  {/* Image */}
                  <Link
                    href={`/tienda/${product.slug}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden"
                    style={{ background: 'oklch(0.962 0.005 90)', border: '1px solid oklch(0.656 0.016 78 / 0.15)' }}
                  >
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8" style={{ color: 'oklch(0.656 0.016 78 / 0.3)' }} />
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/tienda/${product.slug}`}>
                      <h3
                        className="text-sm font-medium mb-1 leading-snug truncate hover:text-[oklch(0.668_0.063_64)] transition-colors"
                        style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs mb-3" style={{ color: 'oklch(0.656 0.016 78)' }}>
                      {product.price.toFixed(2).replace('.', ',')}€ / ud.
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div
                        className="flex items-center border border-[oklch(0.656_0.016_78/0.25)]"
                      >
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[oklch(0.962_0.005_90)] transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[oklch(0.962_0.005_90)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className="text-base font-medium"
                          style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
                        >
                          {(product.price * quantity).toFixed(2).replace('.', ',')}€
                        </span>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="flex items-center justify-center w-8 h-8 transition-colors hover:text-red-500"
                          style={{ color: 'oklch(0.656 0.016 78)' }}
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 text-xs mt-6 transition-colors"
              style={{ color: 'oklch(0.656 0.016 78)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Seguir comprando
            </Link>
          </div>

          {/* Order summary */}
          <div
            className="p-8 lg:sticky lg:top-28"
            style={{
              background: 'oklch(0.962 0.005 90)',
              border: '1px solid oklch(0.656 0.016 78 / 0.15)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-cobre" />
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'oklch(0.668 0.063 64)' }}>
                Resumen
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'oklch(0.45 0 0)' }}>Subtotal</span>
                <span style={{ color: 'oklch(0.21 0 0)' }}>
                  {subtotal.toFixed(2).replace('.', ',')}€
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'oklch(0.45 0 0)' }}>Envío</span>
                <span style={{ color: shippingCost === 0 ? 'oklch(0.551 0.041 147)' : 'oklch(0.21 0 0)' }}>
                  {shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2).replace('.', ',')}€`}
                </span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                <p className="text-xs" style={{ color: 'oklch(0.551 0.041 147)' }}>
                  Añade{' '}
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2).replace('.', ',')}€ más para
                  envío gratis
                </p>
              )}
            </div>

            <div
              className="flex justify-between pt-4 mb-7 border-t border-[oklch(0.656_0.016_78/0.15)]"
            >
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.21 0 0)' }}
              >
                Total
              </span>
              <span
                className="text-xl"
                style={{ fontFamily: 'var(--font-playfair), serif', color: 'oklch(0.668 0.063 64)' }}
              >
                {total.toFixed(2).replace('.', ',')}€
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium tracking-wide mb-3 transition-all duration-300"
              style={{ background: 'oklch(0.21 0 0)', color: 'oklch(0.979 0.004 90)' }}
            >
              Proceder al pago <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-center mt-4" style={{ color: 'oklch(0.656 0.016 78)' }}>
              Envíos a toda España · 30 días de devolución
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
