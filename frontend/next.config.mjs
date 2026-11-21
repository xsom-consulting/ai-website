import { existsSync } from "node:fs";

/**
 * La vidéo de démonstration de guard.xsom.fr n'existe pas encore : sa présence est lue
 * à la construction, si bien que la page ne demande jamais un fichier absent.
 */
const media = (name) => (existsSync(new URL(`./public/signal-media/${name}`, import.meta.url)) ? "1" : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SG_DEMO_VIDEO: media("secret-guard-demo.mp4"),
    SG_DEMO_POSTER: media("secret-guard-demo.jpg"),
  },
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
