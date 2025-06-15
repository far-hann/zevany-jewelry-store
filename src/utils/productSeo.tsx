import { Metadata } from 'next'
import { generateMetadata as generateBasicMetadata, generateProductSchema, generateBreadcrumbSchema, StructuredData } from './seo'

interface Product {
  id: string
  name: string
  description: string
  price: string
  originalPrice?: string
  images: string[]
  collection: string
  specifications: Record<string, string | undefined>
  rating?: number
  reviews?: number
  inStock?: boolean
  articleNo?: string
}

export function generateProductMetadata(product: Product): Metadata {
  const baseUrl = 'https://zevany-store.vercel.app'
  
  return generateBasicMetadata({
    title: `${product.name} - ${product.price} | ZEVANY Luxury Jewelry`,
    description: `${product.description.substring(0, 155)}... Shop this exquisite ${product.collection} piece at ZEVANY. ${product.price}. Free shipping available.`,
    keywords: [
      product.name.toLowerCase(),
      product.collection.toLowerCase(),
      'luxury jewelry',
      'premium quality',
      'fine jewelry',
      'designer jewelry',
      'handcrafted jewelry'
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
    { name: product.collection, url: `/${product.collection.toLowerCase()}` },
    { name: product.name, url: `/product/${product.id}` }
  ], baseUrl)
  
  return [productSchema, breadcrumbSchema]
}

export function generateProductJsonLd(product: Product) {
  const schemas = generateProductStructuredData(product)
  
  return schemas.map((schema, index) => (
    <StructuredData key={index} data={schema} />
  ))
}

const productSeoUtils = {
  generateProductMetadata,
  generateProductStructuredData,
  generateProductJsonLd
}
export default productSeoUtils