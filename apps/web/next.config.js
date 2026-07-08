/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  transpilePackages: ["@arrivio/firebase", "@arrivio/shared", "@arrivio/ui"]
};

module.exports = nextConfig;
