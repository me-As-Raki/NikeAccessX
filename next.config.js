/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // important for static hosting
  }
};

module.exports = nextConfig;
