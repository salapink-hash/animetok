/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'api.dicebear.com', 'cdn.myanimelist.net'],
  },
};

module.exports = nextConfig;

