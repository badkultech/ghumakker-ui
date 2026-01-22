/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // ✅ Explicitly force Webpack
  experimental: {
    webpackBuildWorker: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

export default nextConfig;
