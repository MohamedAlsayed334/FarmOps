/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['msnodesqlv8'],
  turbopack: {},
};

export default nextConfig;
