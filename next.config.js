const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
