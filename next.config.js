/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? process.env.API_URL
            : "http://localhost:3000/:path*", // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig
