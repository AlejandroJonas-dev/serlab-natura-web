'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCartStore } from '@/stores/cart.store'
import type { Product } from '@/types'

// Las descripciones del dataset suelen llegar con secciones en mayúsculas
// dentro del mismo texto: "INDICACIÓN ... PRECAUCIONES ... COMPOSICIÓN ...
// POSOLOGÍA ...". Las dividimos en bloques editoriales para presentarlas
// como una ficha estructurada en vez de un párrafo gigante.
const SECTION_HEADINGS = [
  'INDICACIONES',
  'INDICACIÓN',
  'PROPIEDADES E INDICACIONES',
  'PROPIEDADES Y BENEFICIOS',
  'PRECAUCIONES',
  'PRECAUCIONE S',
  'COMPOSICIÓN',
  'POSOLOGÍA',
  'POSOLOGIA',
  'MODO DE EMPLEO',
  'MODO DE USO',
  'RECOMENDACIONES DE USO',
] as const

function parseDescription(
  desc: string,
): Array<{ heading: string; body: string }> {
  if (!desc?.trim()) return []
  const escaped = SECTION_HEADINGS.map((h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  ).join('|')
  const regex = new RegExp(`(${escaped})`, 'g')
  const matches = [...desc.matchAll(regex)]

  if (matches.length === 0) {
    return [{ heading: 'Descripción', body: desc.trim() }]
  }

  const sections: Array<{ heading: string; body: string }> = []
  // Texto antes del primer heading (si lo hay)
  const firstStart = matches[0].index ?? 0
  if (firstStart > 0) {
    const intro = desc.slice(0, firstStart).trim()
    if (intro) sections.push({ heading: 'Descripción', body: intro })
  }

  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][0]
    const start = (matches[i].index ?? 0) + heading.length
    const end =
      i + 1 < matches.length ? matches[i + 1].index ?? desc.length : desc.length
    const body = desc.slice(start, end).trim()
    if (body) {
      sections.push({
        heading: humanizeHeading(heading),
        body,
      })
    }
  }

  return sections
}

function humanizeHeading(h: string): string {
  // "PRECAUCIONE S" → "Precauciones", "COMPOSICIÓN" → "Composición"
  const cleaned = h.replace(/\s+/g, ' ').trim()
  return cleaned
    .toLowerCase()
    .replace(/^(\w)/, (m) => m.toUpperCase())
}

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

  const sections = useMemo(
    () => (product?.description ? parseDescription(product.description) : []),
    [product],
  )

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
      quantity,
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
              className="aspect-[4/5] animate-pulse"
              style={{ background: 'oklch(0.94 0.005 90)' }}
            />
            <div className="space-y-4 pt-8">
              <div
                className="h-3 w-24 animate-pulse"
                style={{ background: 'oklch(0.94 0.005 90)' }}
              />
              <div
                className="h-9 w-3/4 animate-pulse"
                style={{ background: 'oklch(0.94 0.005 90)' }}
              />
              <div
                className="h-10 w-32 animate-pulse"
                style={{ background: 'oklch(0.94 0.005 90)' }}
              />
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
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'oklch(0.21 0 0)',
          }}
        >
          Producto no encontrado
        </h1>
        <Link
          href="/tienda"
          className="text-sm tracking-[0.2em] uppercase"
          style={{ color: 'oklch(0.668 0.063 64)' }}
        >
          — Volver a la tienda
        </Link>
      </div>
    )
  }

  const outOfStock = product.stock === 0
  const lowStock = !outOfStock && product.stock <= 5
  const images = product.images?.length > 0 ? product.images : []
  const formattedPrice = product.price.toFixed(2).replace('.', ',')

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
          <Link
            href="/tienda"
            className="hover:text-[oklch(0.668_0.063_64)] transition-colors"
          >
            Tienda
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="hidden sm:inline">{product.category.name}</span>
            </>
          )}
          <span>/</span>
          <span
            className="truncate max-w-[200px]"
            style={{ color: 'oklch(0.21 0 0)' }}
          >
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
          {/* ───────── IZQUIERDA: galería ───────── */}
          <div className="lg:sticky lg:top-24">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-6 transition-colors hover:text-[oklch(0.668_0.063_64)]"
              style={{ color: 'oklch(0.45 0 0)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a la tienda
            </Link>

            <div
              className="aspect-[4/5] relative overflow-hidden mb-3"
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
                  className="object-contain p-10"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-7xl"
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    color: 'oklch(0.656 0.016 78 / 0.4)',
                  }}
                >
                  ·
                </div>
              )}

              {product.isFeatured && !outOfStock && (
                <span
                  className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  — Selección
                </span>
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
                        ? 'ring-1 ring-[oklch(0.668_0.063_64)]'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                    style={{
                      background: 'oklch(0.962 0.005 90)',
                      border: '1px solid oklch(0.656 0.016 78 / 0.15)',
                    }}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ───────── DERECHA: info + acción ───────── */}
          <div className="lg:pt-12">
            {product.category && (
              <div className="flex items-center gap-3 mb-5">
                <span className="rule-cobre" />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: 'oklch(0.668 0.063 64)' }}
                >
                  {product.category.name}
                </span>
              </div>
            )}

            <h1
              className="text-3xl lg:text-[2.4rem] leading-[1.15] mb-3"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              {product.name}
            </h1>

            {/* La referencia interna (product.brand) es código de proveedor —
                no se expone al cliente, solo se ve desde el panel admin. */}
            <div className="mb-8" />

            {product.shortDescription && (
              <p
                className="text-sm leading-relaxed mb-10 max-w-lg"
                style={{ color: 'oklch(0.45 0 0)' }}
              >
                {product.shortDescription}
              </p>
            )}

            {/* Precio + stock */}
            <div
              className="flex items-baseline gap-4 pb-6 mb-8 border-b"
              style={{ borderColor: 'oklch(0.656 0.016 78 / 0.18)' }}
            >
              <span
                className="text-4xl tabular-nums"
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'oklch(0.21 0 0)',
                }}
              >
                {formattedPrice}€
              </span>
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: 'oklch(0.656 0.016 78)' }}
              >
                IVA incluido
              </span>
            </div>

            {/* Stock indicator typografico */}
            <p
              className="text-[11px] tracking-[0.25em] uppercase mb-7"
              style={{
                color: outOfStock
                  ? 'oklch(0.55 0.18 25)'
                  : lowStock
                    ? 'oklch(0.668 0.063 64)'
                    : 'oklch(0.551 0.041 147)',
              }}
            >
              {outOfStock
                ? '— Sin stock'
                : lowStock
                  ? `— Quedan ${product.stock} unidades`
                  : `— Disponible · ${product.stock} unidades`}
            </p>

            {/* Cantidad + Añadir */}
            {!outOfStock ? (
              <div className="flex items-stretch gap-3 mb-10">
                <div
                  className="flex items-center"
                  style={{
                    border: '1px solid oklch(0.656 0.016 78 / 0.3)',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-full flex items-center justify-center transition-colors hover:bg-[oklch(0.962_0.005_90)]"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className="w-12 text-center text-sm font-medium tabular-nums py-3"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="w-11 h-full flex items-center justify-center transition-colors hover:bg-[oklch(0.962_0.005_90)]"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-3 py-3 text-sm tracking-[0.25em] uppercase transition-all duration-300"
                  style={{
                    background: added ? 'oklch(0.551 0.041 147)' : 'oklch(0.21 0 0)',
                    color: 'oklch(0.979 0.004 90)',
                  }}
                >
                  {added ? (
                    <>
                      <span aria-hidden>✓</span>
                      Añadido
                    </>
                  ) : (
                    <>
                      Añadir al carrito
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                className="py-4 px-5 mb-10"
                style={{
                  background: 'oklch(0.962 0.005 90)',
                  border: '1px solid oklch(0.656 0.016 78 / 0.2)',
                }}
              >
                <p
                  className="text-sm tracking-wide"
                  style={{ color: 'oklch(0.45 0 0)' }}
                >
                  Temporalmente sin stock. Si quieres ser avisada cuando vuelva,{' '}
                  <Link
                    href="/contacto"
                    className="underline transition-colors hover:text-[oklch(0.668_0.063_64)]"
                  >
                    contáctanos
                  </Link>
                  .
                </p>
              </div>
            )}

            {/* Garantías — type-only, sin iconos */}
            <div
              className="grid grid-cols-3 gap-6 pt-8 border-t"
              style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
            >
              {[
                { num: '01', title: 'Envío 24-72h', sub: 'Toda España' },
                { num: '02', title: 'Pago seguro', sub: 'Tarjeta, Bizum o transferencia' },
                { num: '03', title: '30 días', sub: 'Devolución libre' },
              ].map(({ num, title, sub }) => (
                <div key={num}>
                  <span
                    className="block text-lg leading-none mb-2 tabular-nums"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      color: 'oklch(0.668 0.063 64)',
                    }}
                  >
                    {num}
                  </span>
                  <p
                    className="text-[11px] tracking-[0.18em] uppercase mb-0.5"
                    style={{ color: 'oklch(0.21 0 0)' }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-[11px] leading-snug"
                    style={{ color: 'oklch(0.656 0.016 78)' }}
                  >
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───────── FICHA DEL PRODUCTO ───────── */}
        {sections.length > 0 && (
          <section
            className="mt-20 pt-16 border-t"
            style={{ borderColor: 'oklch(0.656 0.016 78 / 0.15)' }}
            aria-labelledby="ficha-heading"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="rule-cobre" />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ color: 'oklch(0.668 0.063 64)' }}
              >
                Ficha del producto
              </span>
            </div>
            <h2
              id="ficha-heading"
              className="text-3xl lg:text-4xl mb-12 max-w-2xl"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                color: 'oklch(0.21 0 0)',
              }}
            >
              Información detallada
            </h2>

            <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10">
              {sections.map((section, idx) => (
                <article
                  key={`${section.heading}-${idx}`}
                  className={
                    sections.length === 1
                      ? 'lg:col-span-12'
                      : section.heading.toLowerCase().startsWith('compos') ||
                          section.heading.toLowerCase().startsWith('descrip') ||
                          section.heading.toLowerCase().startsWith('indicac')
                        ? 'lg:col-span-7'
                        : 'lg:col-span-5'
                  }
                >
                  <header className="flex items-baseline gap-4 mb-4">
                    <span
                      className="text-xl tabular-nums leading-none"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.668 0.063 64)',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="text-lg leading-tight"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: 'oklch(0.21 0 0)',
                      }}
                    >
                      {section.heading}
                    </h3>
                  </header>
                  <p
                    className="text-sm leading-[1.7] whitespace-pre-line"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    {section.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
