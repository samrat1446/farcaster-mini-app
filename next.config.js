/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
    QUOTIENT_API_KEY: process.env.QUOTIENT_API_KEY,
    AIRSTACK_API_KEY: process.env.AIRSTACK_API_KEY,
  },
  images: {
    domains: ['i.imgur.com', 'res.cloudinary.com', 'imagedelivery.net'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
