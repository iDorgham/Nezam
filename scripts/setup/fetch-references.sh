#!/bin/bash
set -e

REF_DEST="$HOME/nezam-references"
NEZAM_REFS=".cursor/design/references"

echo "📦 Fetching NEZAM reference materials..."
mkdir -p "$REF_DEST"

# Clone/sync reference repos
if [ -d "$REF_DEST/open-design-main" ]; then
  echo "  ✓ References already present at $REF_DEST"
  exit 0
fi

echo "  Cloning reference repos to $REF_DEST..."
git clone https://github.com/penpot/penpot-design-main.git "$REF_DEST/open-design-main" --depth=1 2>/dev/null || echo "  ⚠ Could not clone, manual setup required"

echo "✅ Done. Update .cursor/commands/design.md to reference $REF_DEST"
