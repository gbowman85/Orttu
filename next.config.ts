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
    
    // Define allowed origins for CORS
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_CONVEX_URL?.replace('https://', 'https://'),
      process.env.CONVEX_SITE_URL,
      ...(isDev ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : [])
    ].filter(Boolean)
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : allowedOrigins.join(', ')
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
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
