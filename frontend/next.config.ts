/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://192.168.5.220:3000', // IP de desarrollo
    'http://localhost:3000',     // opcional, localhost
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.viewsurf.com',
      },
      {
        protocol: 'https',
        hostname: 'www.windy.com',
      },
    ],
  },
};

module.exports = nextConfig;
