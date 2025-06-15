import { Metadata } from 'next'

interface Product {
  id: string
  name: string
  description: string
  price: string
  images: string[]
  collection: string
  specifications: Record<string, string | undefined>
  rating?: number
  reviews?: number
  inStock?: boolean
}

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
      price: product.price.replace('$', '').replace(',', ''),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
    }),    additionalProperty: Object.entries(product.specifications)
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
    name: 'ZEVANY Luxury Jewelry',
    url: baseUrl,
    logo: `${baseUrl}/images/brand/zevany-logo.svg`,
    description: 'Premium luxury jewelry store offering exquisite rings, necklaces, earrings, and bracelets.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
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
    name: 'ZEVANY Luxury Jewelry',
    url: baseUrl,
    description: 'Discover exquisite luxury jewelry at ZEVANY. Premium rings, necklaces, earrings, and bracelets crafted with precision.',
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
  title = 'ZEVANY - Luxury Jewelry Store | Premium Rings, Necklaces & More',
  description = 'Discover exquisite luxury jewelry at ZEVANY. Shop premium rings, necklaces, earrings, and bracelets crafted with precision and elegance.',
  keywords = ['luxury jewelry', 'premium rings', 'diamond necklaces', 'gold earrings', 'designer bracelets', 'fine jewelry'],
  canonical,
  ogImage = '/images/brand/zevany-logo.svg',
  product
}: SEOProps): Metadata {
  const baseUrl = 'https://zevany-store.vercel.app'
  
  // If it's a product page, customize the meta
  if (product) {
    title = `${product.name} | ZEVANY Luxury Jewelry`
    description = `${product.description} - ${product.price}. Shop premium ${product.collection} collection at ZEVANY.`
    keywords = [
      ...keywords,
      product.name.toLowerCase(),
      product.collection.toLowerCase(),
      'luxury jewelry',
      'premium quality'
    ]
    ogImage = product.images[0] || ogImage
  }

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'ZEVANY Luxury Jewelry' }],
    creator: 'ZEVANY',
    publisher: 'ZEVANY',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical || baseUrl,
      siteName: 'ZEVANY Luxury Jewelry',
      title,
      description,      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(product && {
        'product:price:amount': product.price?.replace('$', '').replace(',', '') || '0',
        'product:price:currency': 'USD',
        'product:availability': product.inStock ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': 'ZEVANY'
      })
    },
    twitter: {
      card: 'summary_large_image',
      site: '@zevany',
      creator: '@zevany',
      title,
      description,
      images: [`${baseUrl}${ogImage}`],    },
    alternates: {
      canonical: canonical || baseUrl,
    },
    other: {
      'price': product?.price?.replace('$', '').replace(',', '') || '0',
      'priceCurrency': 'USD',
      'availability': product?.inStock ? 'InStock' : 'OutOfStock',
      'condition': 'NewCondition',
    },
  }
}

// Component for structured data injection
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

// Hook for SEO in pages
export function useSEO(props: SEOProps) {
  const metadata = generateMetadata(props)
  
  const structuredDataArray = []
  
  // Always include organization and website schemas
  structuredDataArray.push(generateOrganizationSchema())
  structuredDataArray.push(generateWebsiteSchema())
  
  // Add product schema if product is provided
  if (props.product) {
    structuredDataArray.push(generateProductSchema(props.product))
  }
  
  // Add custom structured data
  if (props.structuredData) {
    structuredDataArray.push(props.structuredData)
  }
  
  return {
    metadata,
    structuredData: structuredDataArray
  }
}

// Named export for SEO utilities
export const seoUtilities = {
  generateMetadata,
  generateProductSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  StructuredData,
  useSEO
}