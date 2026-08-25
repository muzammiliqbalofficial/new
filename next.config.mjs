/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/r2-image-loader.ts',
    deviceSizes: [300, 700, 1400],
    imageSizes: [150, 300, 700],
    formats: ['image/webp'],
  },
};

export default nextConfig;
