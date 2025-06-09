import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    return config;
  },
  // Disable webpack cache in development to prevent chunk issues
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
