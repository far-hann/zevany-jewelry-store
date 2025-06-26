import { Product } from '../../types/Product';
import { Metadata } from 'next';
import { generateMetadata as generateBasicMetadata, generateProductSchema, generateBreadcrumbSchema, StructuredData } from './seo'

export function generateProductMetadata(product: Product): Metadata {
  const baseUrl = 'https://zevany-store.vercel.app'
  const title = `ZEVANY | ${product.name} - Handcrafted Pure Silver & Gemstone Jewelry`;
  const description = `Discover the exquisite ${product.name} from ZEVANY. This piece is handcrafted from pure silver, adorned with precious gemstones, and comes with a certificate of authenticity. Order now for express, secured home delivery.`;

  return generateBasicMetadata({
    title,
    description,
    keywords: [      'ZEVANY',
      product.name,
      'handcrafted jewelry',
      'pure silver jewelry',
      'precious gemstones',
      'luxury jewelry',
      'international shipping',
      'authentic jewelry',
      ...(product.collection ? [product.collection] : []),
      ...(product.tags || [])
    ],
    canonical: `${baseUrl}/product/${product.id}`,
    ogImage: product.images[0],
    product: product
  })
}

export function generateProductStructuredData(product: Product) {
  const baseUrl = 'https://zevany-store.vercel.app'
  
  const productSchema = generateProductSchema(product, baseUrl)
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Jewelry', url: '/collections' },
    ...(product.collection ? [{ name: product.collection, url: `/${product.collection.toLowerCase()}` }] : []),
    { name: product.name, url: `/product/${product.id}` }
  ], baseUrl)
  
  return [productSchema, breadcrumbSchema]
}

export function generateProductJsonLd(product: Product) {
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: `Discover the exquisite ${product.name} from ZEVANY. This piece is handcrafted from pure silver, adorned with precious gemstones, and comes with a certificate of authenticity. Order now for express, secured home delivery.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'ZEVANY',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.zevany.com/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toString(),
      priceValidUntil: new Date().toISOString().split('T')[0], // Today
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '9.95',
          currency: 'USD'
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',      ratingValue: product.rating?.toString() || '5',
      reviewCount: product.reviews?.toString() || '10',
    },
  }

  return (
    <StructuredData data={productJsonLd} />
  )
}

const productSeoUtils = {
  generateProductMetadata,
  generateProductStructuredData,
  generateProductJsonLd
}
export default productSeoUtils