import type { Metadata } from 'next'
import { classesApi } from '@/lib/api'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await classesApi.getBySlug(slug)
    const cls = res.data?.data?.class as
      | {
          name: string
          shortDescription?: string | null
          images?: string[]
        }
      | undefined
    if (!cls) return {}
    return {
      title: cls.name,
      description:
        cls.shortDescription?.slice(0, 160) ??
        `Clase de ${cls.name} en Serlab Natura, Córdoba.`,
      alternates: { canonical: `/clases/${slug}` },
      openGraph: {
        type: 'website',
        title: cls.name,
        description: cls.shortDescription ?? '',
        images: cls.images?.slice(0, 1) ?? [],
      },
    }
  } catch {
    return {}
  }
}

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
