#!/usr/bin/env bash
# Gate 5 — a11y (WCAG 2.2 AA) readiness report (non-destructive).
# Run from repository root: bash .nezam/core/scripts/checks/check-gate-5-a11y.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
DH="${ROOT}/.nezam/design-hub"
A11Y_DIR="${ROOT}/docs/reports/a11y"

echo "════════════════════════════════════════════════════"
echo " GATE 5 — a11y (WCAG 2.2 AA)"
echo "════════════════════════════════════════════════════"

echo ""
echo "── axe-core dependency (design-hub + root) ──"
grep -rE '"axe-core"|"@axe-core|"vitest-axe"' \
  "${DH}/package.json" "${ROOT}/package.json" 2>/dev/null | head -10 || true
if ! grep -qE 'axe-core|vitest-axe' "${DH}/package.json" 2>/dev/null; then
  echo "  ⚠️  axe-core / vitest-axe not listed in .nezam/design-hub/package.json"
fi

echo ""
echo "── reports directory ──"
if [[ -d "${A11Y_DIR}" ]]; then
  echo "  ✅ docs/reports/a11y/"
  ls -1 "${A11Y_DIR}" 2>/dev/null | head -10 || true
else
  echo "  ⚠️  no docs/reports/a11y/ — run: bash .nezam/core/scripts/scaffold.sh"
fi

echo ""
echo "── WCAG contrast unit tests (color-a11y) ──"
if [[ -f "${DH}/src/test/color-a11y.wcag.test.ts" ]]; then
  echo "  ✅ color-a11y.wcag.test.ts present"
else
  echo "  ⚠️  missing src/test/color-a11y.wcag.test.ts"
fi

echo ""
echo "── axe component smoke (optional) ──"
if [[ -f "${DH}/package.json" ]] && grep -q '"test:a11y"' "${DH}/package.json"; then
  (cd "${DH}" && pnpm test:a11y) || echo "  ⚠️  pnpm test:a11y failed (see output above)"
else
  echo "  ⚠️  no test:a11y script — Phase 3 scope (T-Q-001 @axe-core/playwright)"
fi

echo ""
echo "── latest written report ──"
if [[ -f "${A11Y_DIR}/gate-5.latest.md" ]]; then
  echo "  ✅ docs/reports/a11y/gate-5.latest.md"
  wc -l < "${A11Y_DIR}/gate-5.latest.md" | xargs echo "     lines:"
else
  echo "  ℹ️  no gate-5.latest.md yet — run: pnpm run check:gate-5-a11y:report"
fi

echo ""
echo "Gate 5 report complete."
