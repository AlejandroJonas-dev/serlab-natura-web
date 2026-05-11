/**
 * Constantes y utilidades de SEO compartidas por toda la web.
 *
 * Centralizamos aquí la URL base, los datos del negocio (para
 * structured data) y los helpers para generar fragmentos JSON-LD.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://serlabnatura.com'

export const SITE_NAME = 'Serlab Natura'

export const BUSINESS = {
  name: 'Serlab Natura',
  tagline: 'Centro de Bienestar Natural en Córdoba',
  description:
    'Herboristería online y centro de bienestar en Córdoba con terapias, estética avanzada (INDIBA, Hydrafacial), reflexología, mindfulness y clases de pilates, tai-chí y bowspring.',
  email: 'info@serlabnatura.com',
  telephone: ['+34957923347', '+34604230456'],
  whatsapp: '+34604230456',
  address: {
    streetAddress: 'Av. Llanos del Pretorio, 1, Local',
    addressLocality: 'Córdoba',
    addressRegion: 'Córdoba',
    postalCode: '14006',
    addressCountry: 'ES',
  },
  geo: {
    latitude: 37.8915,
    longitude: -4.7793,
  },
  openingHours: [
    'Mo-Fr 09:00-20:00',
    'Sa 09:00-14:00',
  ],
  sameAs: [
    'https://www.instagram.com/serlabnatura',
    'https://www.facebook.com/serlabnatura',
  ],
} as const

// ─── JSON-LD HELPERS ─────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string
  url: string
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-serlab-natura.webp`,
    description: BUSINESS.description,
    email: BUSINESS.email,
    telephone: BUSINESS.telephone[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    sameAs: BUSINESS.sameAs,
  }
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}#localbusiness`,
    name: BUSINESS.name,
    image: `${SITE_URL}/logo-serlab-natura.webp`,
    url: SITE_URL,
    telephone: BUSINESS.telephone[0],
    email: BUSINESS.email,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    sameAs: BUSINESS.sameAs,
  }
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

export function productJsonLd(product: {
  name: string
  slug: string
  description?: string
  price: number
  images?: string[]
  brand?: string | null
  stock: number
  category?: { name: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? product.name,
    image: product.images ?? [],
    sku: product.brand ?? product.slug,
    category: product.category?.name,
    brand: {
      '@type': 'Brand',
      name: product.brand ?? BUSINESS.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/tienda/${product.slug}`,
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: BUSINESS.name,
      },
    },
  }
}

export function serviceJsonLd(service: {
  name: string
  slug: string
  description?: string
  price: number
  duration: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description ?? service.name,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS.name,
      address: BUSINESS.address.streetAddress + ', ' + BUSINESS.address.addressLocality,
    },
    areaServed: {
      '@type': 'City',
      name: 'Córdoba',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/servicios/${service.slug}`,
      price: service.price.toFixed(2),
      priceCurrency: 'EUR',
    },
  }
}
