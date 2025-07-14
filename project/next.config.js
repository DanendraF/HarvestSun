/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/cuaca',
        destination: 'http://localhost:4000/api/cuaca',
      },
      {
        source: '/api/tugas/:path*',
        destination: 'http://localhost:4000/api/tugas/:path*',
      },
      {
        source: '/api/laporan/:path*',
        destination: 'http://localhost:4000/api/laporan/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
