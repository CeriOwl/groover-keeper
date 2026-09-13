import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.discogs.com" },
      { protocol: "https", hostname: "st.discogs.com" },
    ],
  },
};

export default nextConfig;
