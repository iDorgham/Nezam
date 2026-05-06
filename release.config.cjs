/**
 * Semantic-release config for optional `semantic-release.yml` (workflow_dispatch).
 * Do not use alongside manual `release.yml` cuts on the same commit without coordination —
 * both create tags/releases.
 *
 * @type {import('semantic-release').Options}
 */
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
  ],
};
