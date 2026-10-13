/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      // L'ancienne adresse de `/produits` est traitée par `proxy.ts` (selon l'adresse demandée).
      { source: "/extension", destination: "/secret-guard", permanent: true },
    ];
  },
};

export default nextConfig;
