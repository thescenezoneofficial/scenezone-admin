import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scenezone-media-uploads.s3.ap-south-1.amazonaws.com', // Added the regional URL
      },
      {
        protocol: 'https',
        hostname: 'scenezone-media-uploads.s3.amazonaws.com', // Keep the global one just in case
      },
      {
        protocol: 'https',
        hostname: 'scenezone-prod-bucket.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'yoraaecommerce.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
  },
};

export default nextConfig;