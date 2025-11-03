import type { NextConfig } from "next";
import dotenv from "dotenv"; 

dotenv.config(); 

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async headers() {
    return [
      {
        source: '/:path*', // Applies to all routes
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};


export default nextConfig;
