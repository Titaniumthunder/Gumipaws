/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Marketing photos are loaded from Unsplash in this demo. Replace with your
    // own CDN / storage in production.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // The Azure App Service build box (B1, 1.75GB) OOMs on next build's
  // in-process type check. Types are verified with `tsc --noEmit` before
  // deploying instead.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
