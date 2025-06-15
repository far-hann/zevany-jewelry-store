import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/orders/',
          '/success/',
          '/track-order/',
          '/returns/',
          '/shipping/',
          '/_next/',
          '/*.json$',
          '/private/',
          '/temp/',
          '/search?*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about',
          '/collections',
          '/rings',
          '/necklaces',
          '/earrings',
          '/bracelets',
          '/product/',
          '/contact',
          '/support',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/orders/',
          '/success/',
          '/track-order/',
          '/returns/',
          '/shipping/',
        ],
      },
    ],
    sitemap: 'https://zevany-store.vercel.app/sitemap.xml',
    host: 'https://zevany-store.vercel.app',
  }
}
