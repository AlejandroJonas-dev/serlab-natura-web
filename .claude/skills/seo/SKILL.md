---
name: seo
description: Apply SEO best practices for the Serlab Natura web (Next.js 16 App Router, Spanish, local SEO Córdoba, herboristería). Use when adding/editing pages, product/service detail routes, sitemaps, robots, structured data (JSON-LD), Open Graph, or when reviewing metadata. Triggers on requests like "mejora el SEO", "añade metadata", "schema.org", "datos estructurados", "sitemap", "robots.txt", "Open Graph", "indexación", "etiquetas canonical".
---

# SEO Skill — Serlab Natura

Project context: TFG e-commerce/booking site for a herboristería in Córdoba (Spain). Next.js 16 App Router (NOT Pages Router), Spanish (`lang="es"`), targeting local search ("herboristería Córdoba", "terapias naturales Córdoba", product brand names) plus product/service long-tail.

Apply this skill anytime page metadata, structured data, indexation, or content surfaces are touched. Do not ship a public-facing route without metadata, canonical, and OG image.

## Non-negotiables

Every public route MUST have, before it's considered done:

1. **`metadata`** export (or `generateMetadata` if dynamic) with `title`, `description`, `alternates.canonical`, `openGraph`, `robots` (only if special).
2. **JSON-LD** appropriate to the page (LocalBusiness on home, Product on product detail, Service on service detail, BreadcrumbList anywhere with breadcrumbs, FAQPage if FAQs exist).
3. **One H1** per page. Subheadings hierarchical (no skipping levels).
4. **Images**: `next/image` with `alt` written for humans (never the filename, never empty unless decorative — then `alt=""`).
5. **Canonical URL** absolute, lowercased, no trailing slash, no query params (unless query is semantically meaningful for indexation).

If any of these are missing the task is not done.

## Metadata API — patterns to copy

The file [src/app/layout.tsx](src/app/layout.tsx) sets defaults (`title.template`, `title.default`, base description). Page-level metadata overrides those — don't repeat what the root already sets.

### Static page

```tsx
// src/app/contacto/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto y horario',
  description:
    'Visítanos en nuestra herboristería de Córdoba. Horario, dirección, teléfono y formulario de contacto para reservar terapia o resolver dudas.',
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: 'Contacto | Serlab Natura',
    description: 'Herboristería en Córdoba — visítanos o escríbenos.',
    url: '/contacto',
    type: 'website',
    locale: 'es_ES',
    images: [{ url: '/og/contacto.jpg', width: 1200, height: 630 }],
  },
}
```

### Dynamic page (product / service detail)

```tsx
// src/app/productos/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { productsApi } from '@/lib/api'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await productsApi.getBySlug(slug).catch(() => ({ data: null }))
  const product = data?.data?.product
  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: product.name,
    description: product.shortDescription ?? product.description.slice(0, 160),
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      title: `${product.name} | Serlab Natura`,
      description: product.shortDescription ?? undefined,
      url: `/productos/${product.slug}`,
      type: 'website',
      images: product.images?.length
        ? [{ url: product.images[0], width: 1200, height: 1200 }]
        : undefined,
    },
  }
}
```

In Next.js 16 `params` is a `Promise` — always `await` it. Don't read `searchParams` in `generateMetadata` unless the search is part of a canonical, indexable URL (it usually isn't — make it `noindex` instead).

### Set `metadataBase` once, in the root layout

```tsx
// src/app/layout.tsx (add to existing metadata)
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
```

This makes relative URLs in `openGraph.images` and `alternates.canonical` resolve correctly. Set `NEXT_PUBLIC_SITE_URL=https://serlabnatura.com` (or final domain) in the production env.

## sitemap.ts and robots.ts

Use the Next.js conventions — they generate `/sitemap.xml` and `/robots.txt` automatically.

```tsx
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { productsApi, servicesApi, classesApi } from '@/lib/api'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/productos`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/servicios`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/clases`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contacto`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  // Pull dynamic slugs server-side. If the API isn't reachable at build time,
  // fail soft and ship the static map rather than break the build.
  const [products, services, classes] = await Promise.all([
    productsApi.getAll({ limit: 1000 }).then((r) => r.data?.data?.products ?? []).catch(() => []),
    servicesApi.getAll({ limit: 1000 }).then((r) => r.data?.data?.services ?? []).catch(() => []),
    classesApi.getAll({ limit: 1000 }).then((r) => r.data?.data?.classes ?? []).catch(() => []),
  ])

  const dynamic: MetadataRoute.Sitemap = [
    ...products.map((p: any) => ({
      url: `${BASE}/productos/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...services.map((s: any) => ({
      url: `${BASE}/servicios/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...classes.map((c: any) => ({
      url: `${BASE}/clases/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return [...staticEntries, ...dynamic]
}
```

```tsx
// src/app/robots.ts
import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/auth'] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
```

`/auth/*` and `/admin/*` MUST be disallowed and the pages themselves should also export `metadata: { robots: { index: false, follow: false } }` (defense in depth — robots.txt is a hint, not a guarantee).

## Structured data (JSON-LD)

Render JSON-LD inside the route as a `<script type="application/ld+json">`. Use `dangerouslySetInnerHTML` (the schema content is server-controlled — safe). Don't use `next/script`'s `strategy="beforeInteractive"`, that's only for `app/layout.tsx`.

### LocalBusiness — root layout or home page only

The single most impactful thing for a Córdoba herboristería. Replace placeholders with real values before going live.

```tsx
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  '@id': `${BASE}/#localbusiness`,
  name: 'Serlab Natura',
  description:
    'Herboristería en Córdoba con productos naturales, terapias individuales y clases grupales de bienestar.',
  url: BASE,
  telephone: '+34 XXX XXX XXX',
  priceRange: '€€',
  image: `${BASE}/og/home.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle … nº …',
    addressLocality: 'Córdoba',
    addressRegion: 'Córdoba',
    postalCode: '14XXX',
    addressCountry: 'ES',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 37.8882, longitude: -4.7794 }, // Córdoba centre — replace
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00', closes: '14:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '17:00', closes: '20:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/serlabnatura',
    'https://www.facebook.com/serlabnatura',
  ],
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
/>
```

### Product schema — on `/productos/[slug]`

```ts
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.shortDescription ?? product.description,
  image: product.images,
  sku: product.id,
  brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
  category: product.category?.name,
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: product.price,
    availability:
      product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    url: `${BASE}/productos/${product.slug}`,
  },
  aggregateRating: stats?.totalReviews
    ? {
        '@type': 'AggregateRating',
        ratingValue: stats.averageRating,
        reviewCount: stats.totalReviews,
      }
    : undefined,
}
```

Only include `aggregateRating` when there are real reviews. Faking it is a manual penalty risk.

### Service schema — on `/servicios/[slug]`

```ts
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: service.category?.name,
  name: service.name,
  description: service.description,
  provider: { '@type': 'HealthAndBeautyBusiness', '@id': `${BASE}/#localbusiness` },
  areaServed: { '@type': 'City', name: 'Córdoba' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: service.price,
    url: `${BASE}/servicios/${service.slug}`,
  },
}
```

### BreadcrumbList — anywhere with breadcrumbs

```ts
const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'Productos', item: `${BASE}/productos` },
    { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE}/productos/${product.slug}` },
  ],
}
```

## Local SEO checklist (Córdoba)

1. **Google Business Profile** verified, identical NAP (Name/Address/Phone) as the site.
2. NAP appears in plain text in the footer of every page (crawlers don't always parse JSON-LD reliably for ranking signals).
3. `addressLocality: 'Córdoba'` AND `addressRegion: 'Córdoba'` (the province) — both helps disambiguate from Córdoba (Argentina) and Córdoba (Veracruz, México).
4. Mention "Córdoba" in the home H1, in the meta description, and in the first paragraph above the fold.
5. Embed Google Maps on `/contacto` (use `<iframe loading="lazy">` so it doesn't tank LCP).
6. Internal linking from "Servicios" / "Productos" landing pages to category pages and from there to detail pages — never orphan a detail page.
7. URL slugs in lowercase Spanish, no accents, hyphens not underscores: `/servicios/masaje-relajante`, not `/servicios/Masaje_Relajante`.

## Core Web Vitals — they are a ranking factor

Page Experience signals affect ranking. The frontend-design skill biases toward heavy visual treatment — counter that with:

- **Hero image**: `next/image` with `priority` on LCP image only. Never on more than one image per route.
- **Fonts**: `next/font` with `display: 'swap'`. Don't load five weights, load the two you actually use.
- **Above-the-fold**: no client components if avoidable. JSON-LD, hero, headings should be in the server component.
- **CLS**: every image has explicit `width` + `height` (or `fill` with a sized parent). Reserve space for async content (skeletons with the same height).
- **Third-party scripts** (analytics, chat, maps): `next/script` with `strategy="lazyOnload"` or `afterInteractive`. Never `beforeInteractive`.

## Content rules

- One **H1** per page, contains the primary keyword naturally.
- Meta description: 140–160 characters, includes a verb (acción), location ("Córdoba"), and a hook. No keyword stuffing.
- Title tag: ≤60 characters, includes brand at the end (`%s | Serlab Natura` is already templated in [src/app/layout.tsx](src/app/layout.tsx#L17-L20)).
- Image filenames AND alt text are descriptive Spanish: `alt="Aceite esencial de lavanda 30ml — Serlab Natura"`, not `alt="image1"`.
- Don't index thank-you pages, search result pages with empty queries, paginated archives past page 1 (use `rel="canonical"` to page 1), or filter combinations that produce duplicate content. Set `robots: { index: false }` in their metadata.

## Things that look like SEO but aren't, or are harmful

- **Meta keywords**: ignored by Google since 2009. Don't add them.
- **`rel="canonical"` to itself**: harmless but pointless. Only add when the canonical differs from the current URL (e.g., a filtered listing pointing to the unfiltered version).
- **Redirect chains** (A → B → C): each hop loses signal. Always redirect to the final URL.
- **Hidden text** (white on white, `display: none` for crawler-only content): manual action risk.
- **AI-generated content with no review**: works for a draft, never as the final published copy. Always have a human pass for tone and factual claims, especially anything health-related (herboristería ↔ medical claims is a YMYL trap — be careful with wording).

## Definition of done for an SEO-touching PR

- [ ] `metadata` (or `generateMetadata`) exported for every new page.
- [ ] Canonical absolute URL, lowercase, no trailing slash.
- [ ] Open Graph image set (1200×630), real not placeholder.
- [ ] JSON-LD validated in [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] `sitemap.ts` includes the new route (or its dynamic source covers it).
- [ ] Lighthouse SEO score ≥ 95 on the affected route.
- [ ] No new H1 collisions and heading order is sequential.
