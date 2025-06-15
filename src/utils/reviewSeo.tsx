import { StructuredData } from './seo'

interface Review {
  author: string
  rating: number
  comment: string
  date: string
  title?: string
}

interface ReviewSchemaProps {
  product: {
    id: string
    name: string
    rating?: number
    reviews?: number
  }
  reviewsList?: Review[]
  baseUrl?: string
}

export function generateReviewSchema({
  product,
  reviewsList = [],
  baseUrl = 'https://zevany-store.vercel.app'
}: ReviewSchemaProps) {
  // Generate individual review schemas
  const reviewSchemas = reviewsList.map((review, index) => ({
    '@type': 'Review',
    '@id': `${baseUrl}/product/${product.id}#review-${index}`,
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    },
    reviewBody: review.comment,
    name: review.title || `Review by ${review.author}`,
    datePublished: review.date,
    publisher: {
      '@type': 'Organization',
      name: 'ZEVANY Luxury Jewelry'
    }
  }))

  // Aggregate rating schema
  const aggregateRatingSchema = {
    '@type': 'AggregateRating',
    ratingValue: product.rating || 0,
    reviewCount: product.reviews || reviewsList.length,
    bestRating: 5,
    worstRating: 1
  }

  return {
    reviews: reviewSchemas,
    aggregateRating: aggregateRatingSchema
  }
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function generateHowToSchema(steps: Array<{name: string, text: string, image?: string}>, baseUrl = 'https://zevany-store.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Care for Your Jewelry',
    description: 'Proper care instructions for maintaining your luxury jewelry',
    totalTime: 'PT5M',
    supply: ['Soft cloth', 'Jewelry cleaner', 'Storage box'],
    tool: ['Soft brush'],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: `${baseUrl}${step.image}` })
    }))
  }
}

export function generateOfferSchema(product: { id: string; price: string; inStock?: boolean; originalPrice?: string }, baseUrl = 'https://zevany-store.vercel.app') {
  const originalPrice = product.originalPrice?.replace('$', '').replace(',', '')
  const currentPrice = product.price.replace('$', '').replace(',', '')
  
  const offers = [{
    '@type': 'Offer',
    url: `${baseUrl}/product/${product.id}`,
    priceCurrency: 'USD',
    price: currentPrice,
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    condition: 'https://schema.org/NewCondition',
    validFrom: new Date().toISOString(),
    seller: {
      '@type': 'Organization',
      name: 'ZEVANY Luxury Jewelry'
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'USD'
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'US'
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        businessDays: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'https://schema.org/Monday',
            'https://schema.org/Tuesday',
            'https://schema.org/Wednesday',
            'https://schema.org/Thursday',
            'https://schema.org/Friday'
          ]
        },
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 2,
          unitCode: 'd'
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 2,
          maxValue: 5,
          unitCode: 'd'
        }
      }
    }
  }]

  // Add sale offer if there's an original price
  if (originalPrice && originalPrice !== currentPrice) {
    offers.push({
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.id}`,
      priceCurrency: 'USD',
      price: originalPrice,
      availability: 'https://schema.org/Discontinued',
      condition: 'https://schema.org/NewCondition',
      validFrom: new Date().toISOString(),
      seller: {
        '@type': 'Organization',
        name: 'ZEVANY Luxury Jewelry'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'https://schema.org/Monday',
              'https://schema.org/Tuesday',
              'https://schema.org/Wednesday',
              'https://schema.org/Thursday',
              'https://schema.org/Friday'
            ]
          },
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'd'
          }
        }
      }
    })
  }

  return offers
}

export function generateLocalBusinessSchema(baseUrl = 'https://zevany-store.vercel.app') {
  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'ZEVANY Luxury Jewelry',
    image: `${baseUrl}/images/brand/zevany-logo.svg`,
    url: baseUrl,
    telephone: '+1-555-ZEVANY',
    email: 'contact@zevany.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Luxury Avenue',
      addressLocality: 'Beverly Hills',
      addressRegion: 'CA',
      postalCode: '90210',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.0736,
      longitude: -118.4004
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'https://schema.org/Monday',
          'https://schema.org/Tuesday',
          'https://schema.org/Wednesday',
          'https://schema.org/Thursday',
          'https://schema.org/Friday'
        ],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Saturday',
        opens: '10:00',
        closes: '17:00'
      }
    ],
    paymentAccepted: ['Cash', 'Credit Card', 'PayPal'],
    priceRange: '$$$$',
    currenciesAccepted: 'USD'
  }
}

export function generateReviewJsonLd(props: ReviewSchemaProps) {
  const reviewData = generateReviewSchema(props)
  return <StructuredData data={reviewData} />
}

const reviewSeoUtils = {
  generateReviewSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateOfferSchema,
  generateLocalBusinessSchema,
  generateReviewJsonLd
}
export default reviewSeoUtils
