// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      domains: ['res.cloudinary.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*',
        },
        {
          protocol: 'https',
          hostname: '*',
          port: '*',
          pathname: '*',
        },
      ]
    }
  };
  
  module.exports = nextConfig;
  