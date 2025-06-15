import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure allowed development origins for cross-origin requests
  allowedDevOrigins: ['192.168.29.57', 'localhost', '127.0.0.1'],
  
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
            key: 'Cache-Control',
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
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Create vendor chunk for shared dependencies
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Create common chunk for shared code
            common: {
              minChunks: 2,
              chunks: 'all',
              name: 'common',
              priority: 5,
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
  
  // Disable webpack cache in development to prevent chunk issues
  experimental: {
    webpackBuildWorker: false,
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // External packages for server components
  serverExternalPackages: [],
  
  // Development settings to prevent cache issues
  generateEtags: false,
  
  // Ensure static assets work properly
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
