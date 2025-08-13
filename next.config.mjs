// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 importante: NÃO usar 'export'. Use standalone para rodar via `next start`
  output: 'standalone',

  // bom para DX e alguns warnings
  reactStrictMode: true,

  // se você usa imagens remotas e não quer configurar domains agora:
  images: { unoptimized: true },

  // opcional: evita que o build quebre por warnings de lint
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
