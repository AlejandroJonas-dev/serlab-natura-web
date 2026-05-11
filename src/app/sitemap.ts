import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { classesApi, productsApi, servicesApi } from '@/lib/api'

interface ApiResp<T> {
  data?: {
    [key: string]: T[] | unknown
  }
}

interface Slugged {
  slug: string
  updatedAt?: string
  createdAt?: string
}

/**
 * Sitemap dinámico. Lista rutas estáticas + entidades de la API
 * (productos, servicios, clases). Si la API no responde en build/SSR,
 * caemos al sitemap estático sin fallar.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Rutas estáticas ────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/quienes-somos`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/asesoramiento`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/servicios`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/tienda`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/clases`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/aviso-legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // ── Rutas dinámicas: productos, servicios, clases ────────────
  const fetchSlugs = async (
    fn: () => Promise<{ data: ApiResp<Slugged> }>,
    key: string,
  ): Promise<Slugged[]> => {
    try {
      const res = await fn()
      const data = res.data?.data
      const items = (data?.[key] as Slugged[] | undefined) ?? []
      return items
    } catch {
      return []
    }
  }

  const [products, services, classes] = await Promise.all([
    fetchSlugs(() => productsApi.getAll({ limit: 200 }), 'products'),
    fetchSlugs(() => servicesApi.getAll({ limit: 200 }), 'services'),
    fetchSlugs(() => classesApi.getAll({ limit: 200 }), 'classes'),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...products.map((p) => ({
      url: `${SITE_URL}/tienda/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: `${SITE_URL}/servicios/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...classes.map((c) => ({
      url: `${SITE_URL}/clases/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
