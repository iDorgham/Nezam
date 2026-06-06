#!/bin/bash
# NEZAM — Workspace Link Validator CI Harness
set -euo pipefail

echo "=========================================================="
echo "🔍 NEZAM: Crawling and validating all workspace relative links..."
echo "=========================================================="

# Invoke the canonical check-broken-links script
node .nezam/core/scripts/checks/check-broken-links.js

echo "✅ NEZAM: Link integrity checks passed successfully."
exit 0
