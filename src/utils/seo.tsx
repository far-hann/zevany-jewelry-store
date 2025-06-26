import { Metadata } from 'next'
import { Product } from '../../types/Product';

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  noindex?: boolean
  product?: Product
  structuredData?: object
}

// Generate structured data for products
export function generateProductSchema(product: Product, baseUrl: string = 'https://zevany-store.vercel.app') {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => `${baseUrl}${img}`),
    brand: {
      '@type': 'Brand',
      name: 'ZEVANY'
    },
    category: 'Jewelry',
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toString(),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      condition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'ZEVANY Luxury Jewelry'
      }
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews || 0,
        bestRating: 5,
        worstRating: 1
      }
    }),    additionalProperty: Object.entries(product.details)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => ({
        '@type': 'PropertyValue',
        name: key,
        value: value as string
      }))
  }
  
  return schema
}

// Generate organization schema
export function generateOrganizationSchema(baseUrl: string = 'https://zevany-store.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZEVANY',
    url: baseUrl,
    logo: `${baseUrl}/images/brand/zevany-logo.svg`,
    description: 'Exquisite, handcrafted jewelry made from pure silver and precious gemstones. Each piece comes with a certificate of authenticity. We offer express, secured shipping worldwide.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@zevany.com'
    },
    sameAs: [
      'https://facebook.com/zevany',
      'https://instagram.com/zevany',
      'https://twitter.com/zevany'
    ]
  }
}

// Generate website schema
export function generateWebsiteSchema(baseUrl: string = 'https://zevany-store.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ZEVANY',
    url: baseUrl,
    description: 'Discover handcrafted jewelry from ZEVANY, made with pure silver and precious gemstones. Shop our collection of rings, necklaces, and more with a certificate of authenticity and worldwide shipping.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>, baseUrl: string = 'https://zevany-store.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  }
}

// Generate Next.js metadata for pages
export function generateMetadata({
  title = 'ZEVANY | Handcrafted Silver & Gemstone Jewelry | Worldwide Shipping',
  description = 'Discover authentic, handcrafted jewelry from ZEVANY. Our pieces are made with pure silver and precious gemstones, and come with a certificate of authenticity. Enjoy express, secured shipping worldwide.',
  keywords = ['handcrafted jewelry', 'pure silver', 'precious gemstones', 'authentic jewelry', 'international jewelry store', 'luxury rings', 'gemstone necklaces', 'silver bracelets', 'designer earrings'],
  canonical,
  ogImage = '/images/brand/zevany-logo.svg',
  product,
  noindex = false
}: SEOProps): Metadata {
  const baseUrl = 'https://zevany-store.vercel.app'
  
  // If it's a product page, customize the meta
  if (product) {
    title = `${product.name} | ZEVANY - Handcrafted Silver & Gemstone Jewelry`
    description = `Shop the ${product.name} by ZEVANY. This handcrafted piece is made from pure silver and features a stunning ${product.details.gemstone || 'gemstone'}. Includes a certificate of authenticity. Order now for express, secured delivery.`
    keywords.push(...(product.tags || []))
    ogImage = product.images?.[0] || ogImage
  }
  
  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonical || baseUrl,
      images: [ogImage],
      type: product ? 'article' : 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    ...(canonical ? { robots: { index: !noindex, follow: true } } : {})
  }
  
  return metadata
}

export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}