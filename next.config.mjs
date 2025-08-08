import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Optimize RSC performance
    serverComponentsExternalPackages: ['@prisma/client'],
    // Enable streaming for better performance
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Optimize images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable compression
  compress: true,
  // Optimize bundle
  swcMinify: true,
  // Reduce RSC payload size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Cache optimization
  generateEtags: false,
  // Reduce initial bundle size
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
};
 
export default withNextIntl(nextConfig);