/** @type {import('next').NextConfig} */
const nextConfig = {
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
