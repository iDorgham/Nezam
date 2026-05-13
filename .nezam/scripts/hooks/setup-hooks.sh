#!/usr/bin/env bash
# NEZAM — Git Hook Installer
# Installs the pre-commit hook that auto-runs pnpm ai:sync when .cursor/ files are staged.
# Run once after cloning: bash .nezam/scripts/hooks/setup-hooks.sh

set -euo pipefail

HOOK_SOURCE=".nezam/scripts/hooks/pre-commit"
HOOK_DEST=".git/hooks/pre-commit"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"

cd "$REPO_ROOT"

if [ ! -d ".git" ]; then
  echo "❌ Not a git repository. Run this script from the repo root."
  exit 1
fi

if [ ! -f "$HOOK_SOURCE" ]; then
  echo "❌ Hook source not found: $HOOK_SOURCE"
  echo "   Make sure you have the full NEZAM repository."
  exit 1
fi

mkdir -p ".git/hooks"

# Backup existing hook if present
if [ -f "$HOOK_DEST" ]; then
  cp "$HOOK_DEST" "${HOOK_DEST}.bak"
  echo "⚠️  Existing pre-commit hook backed up to ${HOOK_DEST}.bak"
fi

cp "$HOOK_SOURCE" "$HOOK_DEST"
chmod +x "$HOOK_DEST"

echo "✅ NEZAM pre-commit hook installed at $HOOK_DEST"
echo "   It will auto-run 'pnpm ai:sync' whenever .cursor/ files are staged."
echo ""
echo "   To uninstall: rm $HOOK_DEST"
echo "   To skip hook for one commit: git commit --no-verify"
