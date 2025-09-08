import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.pipedream.net',
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self'${isDev ? " 'unsafe-eval'" : ''} https://assets.pipedream.net https://*.convex.cloud https://*.convex.dev`,
              "style-src 'self' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https://assets.pipedream.net https://*.convex.cloud https://*.convex.dev",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.convex.cloud https://*.convex.dev https://assets.pipedream.net wss://*.convex.cloud wss://*.convex.dev",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ]
  },
};

export default nextConfig;
