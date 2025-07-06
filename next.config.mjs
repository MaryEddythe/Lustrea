/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: [
      'http://192.168.1.10',
      { origin: 'http://192.168.1.10', includes: ['/_next/*'] }
    ],
  },
}

export default nextConfig
