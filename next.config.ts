import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'], // ✅ allow Cloudinary images
  },
};

export default nextConfig;
