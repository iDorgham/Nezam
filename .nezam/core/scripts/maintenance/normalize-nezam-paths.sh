#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Normalizing NEZAM v4 paths..."

# 1. Create target directories if they don't exist
mkdir -p .nezam/templates
mkdir -p .nezam/memory

# 2. Move templates from .cursor if they exist
if [ -d .cursor/templates ]; then
  echo "Moving .cursor/templates to .nezam/templates..."
  find .cursor/templates -type f -exec mv -t .nezam/templates/ {} + 2>/dev/null || true
fi

# 3. Move memory/context from docs if they exist
# Specifically check docs/workspace/context which I found earlier
if [ -d docs/workspace/context ]; then
  echo "Moving docs/workspace/context to .nezam/memory..."
  find docs/workspace/context -type f -exec mv -t .nezam/memory/ {} + 2>/dev/null || true
fi

# Check for other potential legacy paths
for legacy_path in "docs/nezam/memory" "docs/memory" "docs/context"; do
  if [ -d "$legacy_path" ]; then
    echo "Moving $legacy_path to .nezam/memory..."
    find "$legacy_path" -type f -exec mv -t .nezam/memory/ {} + 2>/dev/null || true
  fi
done

# 4. Handle core/required moves if they exist
if [ -d docs/core ]; then
  echo "Moving docs/core to .nezam/workspace/prd..."
  mkdir -p .nezam/workspace/prd
  find docs/core -type f -exec mv -t .nezam/workspace/prd/ {} + 2>/dev/null || true
fi

# 5. Update workspace paths config
echo "Updating .cursor/workspace.paths.yaml..."
cat > .cursor/workspace.paths.yaml << 'EOF'
workspace:
  templates_root: ".nezam/templates"
  memory_root: ".nezam/memory"
  project_docs: "docs/"
  state_root: ".cursor/state/"
EOF

# 6. Grepl-fix legacy references in .cursor/ and .nezam/
echo "Fixing legacy references in files..."
# Using a simpler sed approach compatible with macOS
find .cursor .nezam -name "*.md" -o -name "*.mdc" -o -name "*.yaml" | while read -r f; do
  # Avoid binary files or directories
  if [ -f "$f" ]; then
    sed -i '' \
      -e 's|\.cursor/templates/|.nezam/templates/|g' \
      -e 's|docs/nezam/memory/|.nezam/memory/|g' \
      -e 's|docs/core/required/|.nezam/workspace/prd/|g' \
      -e 's|docs/memory/|.nezam/memory/|g' \
      "$f"
  fi
done

echo "✅ Path normalization complete. Run: pnpm ai:sync && pnpm ai:check"
