import { Metadata } from 'next'

type Product = {
  id: string
  name: string
  price: string
  description: string
  images: string[]
  collection: string
  articleNo: string
  inStock: boolean
  rating: number
  reviews: number
}

export function generateProductMetadata(product: Product): Metadata {
  return {
    title: `${product.name} | ZEVANY Luxury Jewelry`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ZEVANY`,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "brand": {
      "@type": "Brand",
      "name": "ZEVANY"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.replace('$', '').replace(',', ''),
      "priceCurrency": "USD",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews
    }
  }
}
