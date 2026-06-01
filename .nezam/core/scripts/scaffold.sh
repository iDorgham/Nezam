#!/usr/bin/env bash
# scaffold.sh — NEZAM workspace scaffold entrypoint (idempotent)
# Run from repository root: bash .nezam/core/scripts/scaffold.sh
#
# Delegates to maintenance/scaffold.sh for Design Hub directory stubs.
# Safe to re-run: mkdir -p and touch only when files are missing.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
MAINT="${ROOT}/.nezam/core/scripts/maintenance/scaffold.sh"

if [[ ! -f "${MAINT}" ]]; then
  echo "❌ Missing maintenance scaffold: ${MAINT}" >&2
  exit 1
fi

echo "🏗  NEZAM scaffold (via ${MAINT})"
bash "${MAINT}"

# Planning + reports dirs (workspace kit)
mkdir -p "${ROOT}/docs/plan/00-define/specs"
mkdir -p "${ROOT}/docs/plan/01-research"
mkdir -p "${ROOT}/docs/plan/02-ia"
mkdir -p "${ROOT}/docs/plan/03-content"
mkdir -p "${ROOT}/docs/plan/04-arch"
mkdir -p "${ROOT}/docs/plan/04-design"
mkdir -p "${ROOT}/docs/plan/scaffold"
mkdir -p "${ROOT}/docs/reports/a11y"
mkdir -p "${ROOT}/docs/reports/audits"
mkdir -p "${ROOT}/docs/reports/coverage"
mkdir -p "${ROOT}/docs/reports/lighthouse"
mkdir -p "${ROOT}/docs/reports/progress"
mkdir -p "${ROOT}/docs/reports/security"
mkdir -p "${ROOT}/docs/reports/tests"
mkdir -p "${ROOT}/.session/pages"

echo "✅  Scaffold complete."
