/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // i18n configuration
  i18n,
  
  // Image optimization
  images: {
    domains: ['localhost', 'taxi-express-rdc.vercel.app', 'randomuser.me'],
    unoptimized: true,
  },
  
  // Build optimization
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  output: 'standalone',
  
  // Handle client-side routing
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/client/:path*',
        destination: '/client/:path*',
      },
      {
        source: '/driver/:path*',
        destination: '/driver/:path*',
      },
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
