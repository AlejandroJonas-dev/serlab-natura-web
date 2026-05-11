import type { Metadata } from 'next'
import { servicesApi } from '@/lib/api'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await servicesApi.getBySlug(slug)
    const service = res.data?.data?.service as
      | {
          name: string
          shortDescription?: string | null
          images?: string[]
          duration: number
        }
      | undefined
    if (!service) return {}
    return {
      title: service.name,
      description:
        service.shortDescription?.slice(0, 160) ??
        `${service.name} en Serlab Natura, Córdoba. Sesión de ${service.duration} minutos.`,
      alternates: { canonical: `/servicios/${slug}` },
      openGraph: {
        type: 'website',
        title: service.name,
        description: service.shortDescription ?? '',
        images: service.images?.slice(0, 1) ?? [],
      },
    }
  } catch {
    return {}
  }
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
