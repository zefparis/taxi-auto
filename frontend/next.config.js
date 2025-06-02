/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['localhost', 'taxi-express-rdc.vercel.app', 'randomuser.me'],
    unoptimized: true, // Disable image optimization to reduce memory usage
  },
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false, // Disable source maps in production
  output: 'standalone', // Enable standalone output for smaller Docker images
  
  // Enable app directory
  experimental: {
    appDir: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Handle client-side routing
  async rewrites() {
    return [
      // API routes
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // Client routes
      {
        source: '/client/:path*',
        destination: '/client/:path*',
      },
      // Driver routes
      {
        source: '/driver/:path*',
        destination: '/driver/:path*',
      },
      // Fallback to index.html for all other routes
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        destination: '/',
      },
    ];
  },

  experimental: {
    // Enable experimental features that reduce memory usage
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  webpack: (config, { isServer }) => {
    // Reduce memory usage by limiting the number of parallel processes
    if (!isServer) {
      config.optimization.minimize = true;
      config.optimization.minimizer = [];
    }
    return config;
  },
};

// Only enable profiling in development
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
