#!/usr/bin/env bash
# Design Excellence Audit — STRICT mode.
# Fails on any anti-pattern hit, token drift, slop, missing schema, or below-threshold metrics.
# Reference: .cursor/rules/design-excellence-gates.mdc + .cursor/state/design_health.yaml
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)"
cd "$ROOT_DIR"

FAILS=0
WARNINGS=0
HEALTH_YAML=".cursor/state/design_health.yaml"

red()   { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow(){ printf '\033[0;33m%s\033[0m\n' "$*"; }
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }

fail() { red "  ✗ $*"; FAILS=$((FAILS+1)); }
pass() { green "  ✓ $*"; }
warn() { yellow "  ⚠ $*"; WARNINGS=$((WARNINGS+1)); }

bold "Design Excellence — STRICT audit"
echo "Root: $ROOT_DIR"
echo

# --- Gate 1: design_health.yaml schema ------------------------------------
bold "Gate 1 · design_health.yaml schema"
if [[ ! -f "$HEALTH_YAML" ]]; then
  fail "missing $HEALTH_YAML"
else
  for key in version baseline_exists metrics thresholds; do
    if ! grep -q "^${key}:" "$HEALTH_YAML"; then
      fail "missing required key: $key"
    fi
  done
  for metric in anti_pattern_score a11y_compliance rtl_parity token_drift; do
    if ! grep -q "  ${metric}:" "$HEALTH_YAML"; then
      fail "missing metric: $metric"
    fi
  done
  [[ $FAILS -eq 0 ]] && pass "schema valid"
fi
echo

# --- Gate 2: Token drift (no hardcoded primitives in components) ----------
bold "Gate 2 · Token drift"
if bash .nezam/core/scripts/checks/check-design-tokens.sh > /tmp/token-check.log 2>&1; then
  pass "no hardcoded primitives"
else
  fail "token drift detected:"
  sed -n '1,10p' /tmp/token-check.log | sed 's/^/      /'
fi
echo

# --- Gate 3: Anti-pattern greps -------------------------------------------
bold "Gate 3 · Anti-pattern hard blocks"
GLOBS=(--glob '*.{ts,tsx,css,scss}' --glob '!**/node_modules/**' --glob '!**/.next/**' --glob '!**/_archive/**' --glob '!**/*.test.*')

# Purple-to-blue gradient (lazy AI default)
if rg "${GLOBS[@]}" -n "from-(purple|violet|indigo)-\d+\s+to-blue-\d+" . >/dev/null 2>&1; then
  fail "purple-to-blue gradient detected (use OKLCH tinted neutrals)"
else
  pass "no purple-to-blue gradients"
fi

# Bounce easing
if rg "${GLOBS[@]}" -n "cubic-bezier\(0\.68\s*,\s*-0\.55" . >/dev/null 2>&1; then
  fail "bounce easing detected (use measured cubic-bezier)"
else
  pass "no bounce easing"
fi

# Pure black (#000)
if rg "${GLOBS[@]}" -n "#000(000)?\\b" . >/dev/null 2>&1; then
  fail "pure black (#000) detected — use tinted near-black"
else
  pass "no pure black"
fi

# Animation duration > 600ms
if rg "${GLOBS[@]}" -n "duration-(700|800|900|1000)\b|transition.*[7-9][0-9]{2}ms" . >/dev/null 2>&1; then
  fail "animation > 600ms detected"
else
  pass "no slow animations (>600ms)"
fi

# Bootstrap/Tailwind default colors leaking through
if rg "${GLOBS[@]}" -n "\b(bg|text|border)-(slate|gray|zinc)-(100|200|300|400)\b" . >/dev/null 2>&1; then
  warn "default Tailwind neutrals in components — consider DESIGN.md tokens"
fi
echo

# --- Gate 4: Impeccable slop detect (strict) ------------------------------
bold "Gate 4 · Impeccable slop (fail-mode)"
if [[ -d ".nezam/design-hub/src" ]]; then
  if IMPECCABLE_SLOP_MODE=fail bash .nezam/core/scripts/checks/check-impeccable-slop.sh > /tmp/slop.log 2>&1; then
    pass "no slop signals"
  else
    fail "impeccable slop signals (see /tmp/slop.log)"
    tail -5 /tmp/slop.log | sed 's/^/      /'
  fi
else
  warn "design-hub src missing — skipped"
fi
echo

# --- Gate 5: ai:check + sync drift ----------------------------------------
bold "Gate 5 · Workspace integrity"
if pnpm ai:check > /tmp/aicheck.log 2>&1; then
  pass "ai:check passes (no sync drift)"
else
  fail "ai:check failed"
  tail -5 /tmp/aicheck.log | sed 's/^/      /'
fi
echo

# --- Gate 6: Thresholds (only when baseline_exists: true) -----------------
bold "Gate 6 · Threshold compliance"
if grep -q "^baseline_exists: true" "$HEALTH_YAML" 2>/dev/null; then
  # Trivial threshold check — assumes metrics are numeric. Real impl would parse YAML.
  if command -v python3 >/dev/null 2>&1; then
    python3 - "$HEALTH_YAML" <<'PY' || FAILS=$((FAILS+1))
import sys, re
path = sys.argv[1]
with open(path) as f:
    src = f.read()

def num(key):
    m = re.search(r'\b' + key + r':\s*([0-9.]+)', src)
    return float(m.group(1)) if m else None

checks = [
    ('anti_pattern_score', 'min_anti_pattern_score', '>='),
    ('a11y_compliance',     'min_a11y_compliance',    '>='),
    ('rtl_parity',          'min_rtl_parity',         '>='),
    ('token_drift',         'max_token_drift',        '<='),
]
fails = 0
for metric, threshold, op in checks:
    v = num(metric); t = num(threshold)
    if v is None or t is None: continue
    ok = v >= t if op == '>=' else v <= t
    sym = '✓' if ok else '✗'
    print(f"  {sym} {metric}={v} {op} {t}")
    if not ok: fails += 1
sys.exit(1 if fails else 0)
PY
  else
    warn "python3 not found — threshold parse skipped"
  fi
else
  warn "baseline_exists: false — threshold gate skipped (set baseline_exists: true after first calibration)"
fi
echo

# --- Verdict --------------------------------------------------------------
bold "Verdict"
if [[ $FAILS -gt 0 ]]; then
  red "STRICT AUDIT FAILED — $FAILS hard fail(s), $WARNINGS warning(s)"
  exit 1
fi
green "STRICT AUDIT PASSED — 0 fails, $WARNINGS warning(s)"
