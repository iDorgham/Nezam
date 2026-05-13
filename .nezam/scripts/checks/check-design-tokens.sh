#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

VIOLATIONS="$(
  rg -n \
    --glob '*.css' \
    --glob '*.scss' \
    --glob '*.ts' \
    --glob '*.tsx' \
    --glob '!**/node_modules/**' \
    --glob '!**/.cursor/**' \
    --glob '!**/.git/**' \
    "(color\\s*:\\s*#[0-9a-fA-F]{3,8}|font-size\\s*:\\s*[0-9]+px|z-index\\s*:\\s*[0-9]+)" \
    . \
    | rg -v "tokens|design-tokens|variables|DESIGN\\.md" || true
)"

if [[ -n "$VIOLATIONS" ]]; then
  echo "Gate 1 FAIL: Hardcoded design primitives found:"
  echo "$VIOLATIONS"
  exit 1
fi

echo "Gate 1 PASS: No hardcoded primitives detected"
