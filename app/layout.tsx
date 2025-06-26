import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Montserrat, Work_Sans } from "next/font/google";
import "./globals.css";
import "../styles/product-card-overrides.css";
import "../styles/swarovski-exact-match.css";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/SimpleFooter";
import { Toaster } from "@/components/Toaster";
import { headers } from 'next/headers';
import CacheBuster from '@/src/components/CacheBuster';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

// Disable static caching to always get fresh content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL('https://zevany-store.vercel.app'),
  title: {
    default: 'ZEVANY - Luxury Handcrafted Jewelry Store',
    template: '%s | ZEVANY Luxury Jewelry'
  },
  description: 'Discover exquisite luxury jewelry at ZEVANY. Shop premium rings, necklaces, earrings, and bracelets crafted with precision and timeless elegance. Free shipping on orders over $500.',
  keywords: ['luxury jewelry', 'handcrafted jewelry', 'diamond rings', 'gold necklaces', 'designer earrings', 'premium bracelets', 'ZEVANY', 'fine jewelry'],
  authors: [{ name: 'ZEVANY' }],
  creator: 'ZEVANY Luxury Jewelry',
  publisher: 'ZEVANY',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zevany-store.vercel.app',
    siteName: 'ZEVANY Luxury Jewelry',
    title: 'ZEVANY - Luxury Handcrafted Jewelry Store',
    description: 'Discover exquisite luxury jewelry at ZEVANY. Shop premium rings, necklaces, earrings, and bracelets.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ZEVANY Luxury Jewelry Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZEVANY - Luxury Handcrafted Jewelry Store',
    description: 'Discover exquisite luxury jewelry at ZEVANY. Shop premium rings, necklaces, earrings, and bracelets.',
    images: ['/images/og-image.jpg']
  },
  alternates: {
    canonical: 'https://zevany-store.vercel.app'
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', type: 'image/svg+xml', sizes: '16x16' },
      { url: '/favicon-32x32.svg', type: 'image/svg+xml', sizes: '32x32' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml', sizes: '180x180' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable} ${montserrat.variable}`}>
      <head>
        {/* Cache control headers */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ZEVANY Luxury Jewelry',
              url: 'https://zevany-store.vercel.app',
              logo: 'https://zevany-store.vercel.app/images/brand/zevany-logo.svg',
              description: 'Premium luxury jewelry store offering exquisite rings, necklaces, earrings, and bracelets.',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'contact@zevany.com',
                availableLanguage: 'English'
              },
              sameAs: [
                'https://facebook.com/zevany',
                'https://instagram.com/zevany',
                'https://twitter.com/zevany'
              ]
            })
          }}
        />
        {/* Preload critical JS chunks to avoid ChunkLoadError */}
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/webpack.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/pages/_app.js" as="script" />
      </head>
      <body className={`${inter.variable} ${cormorantGaramond.variable} ${montserrat.variable} ${workSans.variable} antialiased font-sans bg-white`}>
        <Toaster />
        <Navbar />
        <main className="pt-16 lg:pt-20 pb-20 lg:pb-0">
          {children}
        </main>
        <SimpleFooter />
        <CacheBuster />
        {/* Error handling for chunk loading errors */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('error', function(e) {
              if (e.message && (e.message.includes('ChunkLoadError') || e.message.includes('Loading chunk') || e.message.includes('Loading CSS chunk'))) {
                console.error('Chunk loading error detected, attempting recovery...');
                // Attempt to reload the page if it's a chunk loading error
                if (!sessionStorage.getItem('chunk_reload')) {
                  sessionStorage.setItem('chunk_reload', '1');
                  window.location.reload(true); // Force reload from server
                }
              }
            });
            // Clear cache on initial load
            if (!sessionStorage.getItem('cache_cleared')) {
              sessionStorage.setItem('cache_cleared', '1');
              // Force reload CSS
              const links = document.querySelectorAll('link[rel="stylesheet"]');
              links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                  const url = new URL(href, window.location.origin);
                  url.searchParams.set('_v', Date.now().toString());
                  link.setAttribute('href', url.toString());
                }
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
