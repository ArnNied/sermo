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
            : "http://127.0.0.1:5001/sermo-api/asia-southeast2/default/:path*", // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig
