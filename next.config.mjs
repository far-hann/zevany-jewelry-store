/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // Enable image optimization for better performance
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '192.168.29.57',
        port: '3000',
      },
    ],
  },
  
  // Compression and performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Static generation optimizations
  output: 'standalone',
  
  // Headers for CDN optimization
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    // Optimize chunks and prevent loading errors
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    // Optimize bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    
    return config;
  },
  
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  
  generateEtags: false,
  
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  
  reactStrictMode: true,
};

export default nextConfig; 