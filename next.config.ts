import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],  // Add Cloudinary domain to the list
  },
};

export default nextConfig;
