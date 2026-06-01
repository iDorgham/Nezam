#!/usr/bin/env bash
# Writes docs/reports/a11y/gate-5.latest.md from check-gate-5-a11y.sh output.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
OUT="${ROOT}/docs/reports/a11y/gate-5.latest.md"
CHECK="${ROOT}/.nezam/core/scripts/checks/check-gate-5-a11y.sh"

mkdir -p "$(dirname "${OUT}")"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

{
  echo "---"
  echo "report: gate-5-a11y"
  echo "generated_at: ${TS}"
  echo "---"
  echo ""
  echo "# Gate 5 — a11y (WCAG 2.2 AA)"
  echo ""
  echo "\`\`\`"
  bash "${CHECK}" 2>&1 || true
  echo "\`\`\`"
} > "${OUT}"

echo "Wrote ${OUT}"
