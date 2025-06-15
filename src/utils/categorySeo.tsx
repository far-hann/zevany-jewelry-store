import { Metadata } from 'next'
import { generateMetadata as generateBasicMetadata, generateBreadcrumbSchema, StructuredData } from './seo'

interface CategorySEOProps {
  category: string
  description?: string
  baseUrl?: string
}

export function generateCategoryMetadata({
  category,
  description,
  baseUrl = 'https://zevany-store.vercel.app'
}: CategorySEOProps): Metadata {
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
  const defaultDescription = `Discover our exquisite collection of luxury ${category}. Shop premium ${categoryTitle} crafted with precision and elegance at ZEVANY. Free shipping on orders over $100.`
  
  return generateBasicMetadata({
    title: `${categoryTitle} Collection - Premium Luxury ${categoryTitle} | ZEVANY`,
    description: description || defaultDescription,
    keywords: [
      `luxury ${category}`,
      `premium ${category}`,
      `designer ${category}`,
      `fine ${category}`,
      `${category} collection`,
      'ZEVANY jewelry',
      'handcrafted jewelry',
      'luxury jewelry store'
    ],
    canonical: `${baseUrl}/${category}`,
    ogImage: `/images/categories/${category}-category.jpg`,
  })
}

export function generateCategoryStructuredData({
  category,
  description,
  baseUrl = 'https://zevany-store.vercel.app'
}: CategorySEOProps) {
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
  
  // Collection Page Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryTitle} Collection`,
    description: description || `Premium luxury ${category} collection at ZEVANY`,
    url: `${baseUrl}/${category}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${categoryTitle} Products`,
      numberOfItems: 0,
      itemListElement: [] // This would be populated with actual products
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'ZEVANY Luxury Jewelry',
      url: baseUrl
    }
  }

  // Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: categoryTitle, url: `/${category}` }
  ], baseUrl)

  return [collectionSchema, breadcrumbSchema]
}

export function generateCategoryJsonLd(props: CategorySEOProps) {
  const schemas = generateCategoryStructuredData(props)
  
  return schemas.map((schema, index) => (
    <StructuredData key={index} data={schema} />
  ))
}

// Category-specific keywords for different jewelry types
export const categoryKeywords = {
  rings: [
    'engagement rings',
    'wedding bands',
    'diamond rings',
    'gold rings',
    'silver rings',
    'promise rings',
    'cocktail rings',
    'statement rings'
  ],
  necklaces: [
    'diamond necklaces',
    'pearl necklaces',
    'gold necklaces',
    'silver necklaces',
    'pendant necklaces',
    'chain necklaces',
    'choker necklaces',
    'statement necklaces'
  ],
  earrings: [
    'diamond earrings',
    'gold earrings',
    'silver earrings',
    'pearl earrings',
    'stud earrings',
    'drop earrings',
    'hoop earrings',
    'chandelier earrings'
  ],
  bracelets: [
    'tennis bracelets',
    'gold bracelets',
    'silver bracelets',
    'diamond bracelets',
    'charm bracelets',
    'bangle bracelets',
    'cuff bracelets',
    'statement bracelets'
  ]
}

const categorySeoUtils = {
  generateCategoryMetadata,
  generateCategoryStructuredData,
}
export default categorySeoUtils
