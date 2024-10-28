import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NUTRITIONIX_APP_ID: process.env.NUTRITIONIX_APP_ID,
    NUTRITIONIX_APP_KEY: process.env.NUTRITIONIX_APP_KEY,
  },
};

export default nextConfig;
