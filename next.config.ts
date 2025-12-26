import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scenezone-prod-bucket.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'yoraaecommerce.s3.amazonaws.com', // Added this based on your API data
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Useful for testing
      }
    ],
  },
};

export default nextConfig;