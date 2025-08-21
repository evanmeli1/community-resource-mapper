const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = withPWA({
  // Your existing config
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Add CDN configuration
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://bayarea-resource.com' : '',
  trailingSlash: true,
  compress: true,
  
  // Cache headers for static files
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  webpack: (config) => {
    // Silence the noisy dynamic require warnings from Sentry/OTEL
    config.ignoreWarnings = [
      { module: /@opentelemetry/ },
      { module: /require-in-the-middle/ },
    ];
    return config;
  },
});

module.exports = withSentryConfig(nextConfig);