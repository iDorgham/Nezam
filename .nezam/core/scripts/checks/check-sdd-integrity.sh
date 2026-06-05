#!/usr/bin/env bash
# .nezam/core/scripts/checks/check-sdd-integrity.sh
# Detects legacy path references (docs/nezam/memory/ and docs/core/) across the workspace

set -e

echo "Running SDD Integrity Check..."

FAIL=0

# Check for legacy docs/nezam/memory/ references (canonical path is .nezam/memory/)
# Excludes migration scripts that legitimately contain this string as a sed/grep pattern.
echo "Checking for legacy docs/nezam/memory/ references..."
MEMORY_REFS=$(grep -rn "docs/nezam/memory/" .cursor/ docs/ .nezam/core/scripts/ .github/ 2>/dev/null \
  | grep -v "check-sdd-integrity.sh" \
  | grep -v "normalize-nezam-paths.sh" \
  || true)

if [ -n "$MEMORY_REFS" ]; then
    echo "❌ Legacy path '.nezam/memory/' found (should be '.nezam/core/memory/'):"
    echo "$MEMORY_REFS"
    FAIL=1
else
    echo "✅ No legacy 'docs/nezam/memory/' paths found."
fi

# Check for legacy docs/core/ references (canonical path is .nezam/core/)
# Excludes checker/migration scripts that reference the pattern string itself.
echo "Checking for legacy docs/core/ references..."
CORE_REFS=$(grep -rn "docs/core/" .cursor/ docs/ .nezam/core/scripts/ .github/ 2>/dev/null \
  | grep -v "\.nezam/core/" \
  | grep -v "check-sdd-integrity.sh" \
  | grep -v "sync-and-drift-check.yml" \
  || true)

if [ -n "$CORE_REFS" ]; then
    echo "❌ Legacy path 'docs/core/' found (should be '.nezam/core/'):"
    echo "$CORE_REFS"
    FAIL=1
else
    echo "✅ No legacy 'docs/core/' paths found."
fi

if [ "$FAIL" = "1" ]; then
    echo "⚠️  Integrity check failed due to legacy paths. Please migrate to .nezam/core/."
    exit 1
fi

echo "✅ SDD Integrity Check passed!"
