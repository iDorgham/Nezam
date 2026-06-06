#!/bin/bash
# NEZAM Design References Sync
# Downloads/updates external design references to reduce repo size

set -e

REFS_DIR=".cursor/design/references"
REFS_REPO="https://github.com/YOUR_ORG/nezam-design-references"

echo "📥 Syncing NEZAM design references..."
echo ""

# Check if directory exists
if [ -d "$REFS_DIR" ]; then
    echo "♻️  Updating existing references..."
    cd "$REFS_DIR"
    git pull --quiet
    cd - > /dev/null
    echo "✓ Updated: $REFS_DIR"
else
    echo "📥 Cloning design references..."
    git clone --quiet "$REFS_REPO" "$REFS_DIR"
    echo "✓ Cloned: $REFS_DIR"
fi

# Verify clone success
if [ ! -d "$REFS_DIR/.git" ]; then
    echo "⚠️  References repo not found at: $REFS_REPO"
    echo "   Creating local directory (empty)..."
    mkdir -p "$REFS_DIR/refs"
    echo "# NEZAM Design References" > "$REFS_DIR/README.md"
    echo "External design reference repository (update manually)" >> "$REFS_DIR/README.md"
fi

echo ""
echo "📊 Directory size:"
du -sh "$REFS_DIR" 2>/dev/null || echo "   (not yet downloaded)"

echo ""
echo "✓ Design references sync complete"
