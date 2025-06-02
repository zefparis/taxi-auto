/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['localhost', 'taxi-express-rdc.vercel.app', 'randomuser.me'],
  },
  swcMinify: true,
  // App directory is enabled by default in Next.js 13+
};

module.exports = nextConfig;
