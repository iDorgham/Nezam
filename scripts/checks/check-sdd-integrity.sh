#!/usr/bin/env bash
# scripts/checks/check-sdd-integrity.sh
# Detects legacy path references (.nezam/memory/ and docs/core/) across the workspace

set -e

echo "Running SDD Integrity Check..."

FAIL=0

# Check for legacy .nezam/memory/ references, ignoring .nezam/memory/
echo "Checking for legacy .nezam/memory/ references..."
MEMORY_REFS=$(grep -rn ".nezam/memory/" .cursor/ docs/ scripts/ .github/ 2>/dev/null | grep -v ".nezam/workspace/" | grep -v "check-sdd-integrity.sh" || true)

if [ -n "$MEMORY_REFS" ]; then
    echo "❌ Legacy path '.nezam/memory/' found (should be '.nezam/memory/'):"
    echo "$MEMORY_REFS"
    FAIL=1
else
    echo "✅ No legacy '.nezam/memory/' paths found."
fi

# Check for legacy docs/core/ references
echo "Checking for legacy docs/core/ references..."
CORE_REFS=$(grep -rn "docs/core/" .cursor/ docs/ scripts/ .github/ 2>/dev/null | grep -v ".nezam/workspace/" | grep -v "check-sdd-integrity.sh" || true)

if [ -n "$CORE_REFS" ]; then
    echo "❌ Legacy path 'docs/core/' found (should be '.nezam/workspace/core/'):"
    echo "$CORE_REFS"
    FAIL=1
else
    echo "✅ No legacy 'docs/core/' paths found."
fi

if [ "$FAIL" = "1" ]; then
    echo "⚠️  Integrity check failed due to legacy paths. Please migrate to .nezam/workspace/."
    exit 1
fi

echo "✅ SDD Integrity Check passed!"
