/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

let finalConfig = nextConfig;

try {
  const { withSentryConfig } = require('@sentry/nextjs');
  finalConfig = withSentryConfig(nextConfig, {
    silent: true,
  });
} catch (e) {
  // Sentry not installed or offline
}

module.exports = finalConfig;



