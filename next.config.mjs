/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-4327055644f945ce92583334944f4675.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.slatic.net',
      },
      {
        protocol: 'https',
        hostname: '*.daraz.pk',
      },
    ],
  },
};

export default nextConfig;
