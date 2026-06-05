#!/usr/bin/env bash
# Optional Impeccable slop detect (WARN-only — does not fail CI by default).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
TARGET="${1:-$ROOT/.nezam/design-hub/src}"
MODE="${IMPECCABLE_SLOP_MODE:-warn}"

if ! command -v npx >/dev/null 2>&1; then
  echo "check-impeccable-slop: skip (npx not found)"
  exit 0
fi

if [[ ! -d "$TARGET" ]]; then
  echo "check-impeccable-slop: skip (target missing: $TARGET)"
  exit 0
fi

echo "check-impeccable-slop: npx impeccable detect $TARGET (mode=$MODE)"
set +e
npx --yes impeccable detect "$TARGET" 2>&1
code=$?
set -e

if [[ "$MODE" == "fail" && $code -ne 0 ]]; then
  echo "check-impeccable-slop: FAILED (set IMPECCABLE_SLOP_MODE=warn to soften)"
  exit "$code"
fi

if [[ $code -ne 0 ]]; then
  echo "check-impeccable-slop: WARN only (exit $code ignored)"
fi
exit 0
