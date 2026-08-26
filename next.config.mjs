/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/r2-image-loader.ts',
    deviceSizes: [300, 700, 1400],
    imageSizes: [150, 300, 700],
    formats: ['image/webp'],
  },
};

export default nextConfig;
