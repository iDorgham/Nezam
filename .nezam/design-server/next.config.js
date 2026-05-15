/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow server-side file I/O to reach outside .nezam/design-server/
  // (to read .nezam/design/ profiles and project root files)
  serverExternalPackages: ['chokidar'],

  // Expose port configuration
  env: {
    NEZAM_DESIGN_PORT: process.env.NEZAM_DESIGN_PORT || '4000',
  },

  // Webpack: ignore chokidar's optional native fs-events on non-macOS
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = [...(config.externals || []), 'chokidar']
    }
    return config
  },
}

module.exports = nextConfig
