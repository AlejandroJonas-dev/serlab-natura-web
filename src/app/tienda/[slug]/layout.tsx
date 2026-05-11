import type { Metadata } from 'next'
import { productsApi } from '@/lib/api'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * generateMetadata se ejecuta en el servidor: hace fetch del producto por
 * slug y devuelve title/description/OG personalizados para la URL.
 * El page.tsx sigue siendo client component (para el carrito); este layout
 * sólo aporta SEO.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await productsApi.getBySlug(slug)
    const product = res.data?.data?.product as
      | {
          name: string
          shortDescription?: string | null
          images?: string[]
          price: number
        }
      | undefined
    if (!product) return {}
    return {
      title: product.name,
      description:
        product.shortDescription?.slice(0, 160) ??
        `${product.name} disponible en Serlab Natura. Herboristería online con envíos a toda España.`,
      alternates: { canonical: `/tienda/${slug}` },
      openGraph: {
        type: 'website',
        title: product.name,
        description: product.shortDescription ?? '',
        images: product.images?.slice(0, 1) ?? [],
      },
    }
  } catch {
    return {}
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
