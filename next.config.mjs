/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["radix-ui", "motion", "lucide-react"],
  },
}

export default nextConfig
