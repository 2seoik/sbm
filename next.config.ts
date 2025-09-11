import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "*.googleusercontent.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "phinf.pstatic.net" },
      { hostname: "*.kakaocdn.net" },
      { hostname: "sbm.topician.com" },
      { hostname: "localhost" },
    ],
  },
};

export default nextConfig;
