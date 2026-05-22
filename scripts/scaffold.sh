#!/usr/bin/env bash
# scaffold.sh — Idempotent project scaffold for Nezam Design Hub / Server
# Run from NEZAM workspace root: bash scripts/scaffold.sh
# Safe to re-run: uses mkdir -p and touch (no overwrites)

set -e

DS=".nezam/design-hub"

echo "🏗  Scaffolding Nezam Workspace..."

# ─────────────────────────────────────────────────────────────────────────────
# 1. NEZAM DESIGN PLATFORM SCAFFOLD
# ─────────────────────────────────────────────────────────────────────────────
echo "👉 Scaffolding Design Hub platform UI suite under $DS..."

# App Router directories
mkdir -p "$DS/app/settings"
mkdir -p "$DS/app/profiles"
mkdir -p "$DS/app/sitemap"
mkdir -p "$DS/app/review"
mkdir -p "$DS/app/wireframe"
mkdir -p "$DS/app/tokens"
mkdir -p "$DS/app/api/context"
mkdir -p "$DS/app/api/profiles"
mkdir -p "$DS/app/api/lock"
mkdir -p "$DS/app/api/presets/save"
mkdir -p "$DS/app/api/presets/sync-to-disk"
mkdir -p "$DS/app/api/canvas/node"
mkdir -p "$DS/app/api/assets/upload"
mkdir -p "$DS/app/api/ai/vision-gate"
mkdir -p "$DS/app/api/ai/generate-node"
mkdir -p "$DS/app/api/session/save-page"

# Source directories
mkdir -p "$DS/src/store"
mkdir -p "$DS/src/types"
mkdir -p "$DS/src/config"
mkdir -p "$DS/src/hooks"
mkdir -p "$DS/src/lib"
mkdir -p "$DS/src/styles"

# Components directories
mkdir -p "$DS/components/layout"
mkdir -p "$DS/components/tokens"
mkdir -p "$DS/components/canvas"
mkdir -p "$DS/components/inspector"
mkdir -p "$DS/components/motion"
mkdir -p "$DS/components/assets"
mkdir -p "$DS/components/ui"
mkdir -p "$DS/components/wireframe"

# Tests directories
mkdir -p "$DS/tests/unit/store"
mkdir -p "$DS/tests/unit/lib"
mkdir -p "$DS/tests/integration/api"
mkdir -p "$DS/tests/integration/components"

# Public directories
mkdir -p "$DS/public/fonts"
mkdir -p "$DS/public/icons"

# NEZAM local workspace storage directories
mkdir -p ".nezam/sessions"
mkdir -p ".nezam/design/nezam-obsidian-cyan-orange"

# ─────────────────────────────────────────────────────────────────────────────
# 2. TOUCH STUB FILES IDEMPOTENTLY
# ─────────────────────────────────────────────────────────────────────────────
touch_if_missing() {
  [ -f "$1" ] || touch "$1"
}

echo "📝 Touching file stubs..."

# App pages
touch_if_missing "$DS/app/settings/page.tsx"
touch_if_missing "$DS/app/profiles/page.tsx"
touch_if_missing "$DS/app/sitemap/page.tsx"
touch_if_missing "$DS/app/review/page.tsx"
touch_if_missing "$DS/app/wireframe/page.tsx"
touch_if_missing "$DS/app/tokens/page.tsx"

# API routes
touch_if_missing "$DS/app/api/context/route.ts"
touch_if_missing "$DS/app/api/profiles/route.ts"
touch_if_missing "$DS/app/api/lock/route.ts"
touch_if_missing "$DS/app/api/presets/route.ts"
touch_if_missing "$DS/app/api/presets/save/route.ts"
touch_if_missing "$DS/app/api/presets/sync-to-disk/route.ts"
touch_if_missing "$DS/app/api/canvas/route.ts"
touch_if_missing "$DS/app/api/canvas/node/route.ts"
touch_if_missing "$DS/app/api/assets/upload/route.ts"
touch_if_missing "$DS/app/api/ai/vision-gate/route.ts"
touch_if_missing "$DS/app/api/ai/generate-node/route.ts"
touch_if_missing "$DS/app/api/session/save-page/route.ts"

# Stores
touch_if_missing "$DS/src/store/session.store.ts"
touch_if_missing "$DS/src/store/tokens.store.ts"

# Types
touch_if_missing "$DS/src/types/tokens.types.ts"
touch_if_missing "$DS/src/types/canvas.types.ts"
touch_if_missing "$DS/src/types/motion.types.ts"
touch_if_missing "$DS/src/types/asset.types.ts"

# Config
touch_if_missing "$DS/src/config/design-tokens.config.ts"

# Hooks
touch_if_missing "$DS/src/hooks/useRTL.ts"
touch_if_missing "$DS/src/hooks/useTokenInjection.ts"
touch_if_missing "$DS/src/hooks/useSyncStatus.ts"
touch_if_missing "$DS/src/hooks/useCanvasViewport.ts"
touch_if_missing "$DS/src/hooks/useReducedMotion.ts"

# Lib
touch_if_missing "$DS/src/lib/token-injection.ts"
touch_if_missing "$DS/src/lib/context-compression.ts"
touch_if_missing "$DS/src/lib/canvas-math.ts"
touch_if_missing "$DS/src/lib/hardlock-check.ts"
touch_if_missing "$DS/src/lib/svg-sanitizer.ts"
touch_if_missing "$DS/src/lib/asset-optimizer.ts"

# Styles
touch_if_missing "$DS/src/styles/tokens.css"
touch_if_missing "$DS/src/styles/canvas.css"

# Layout components
touch_if_missing "$DS/components/layout/AppShell.tsx"
touch_if_missing "$DS/components/layout/TopNav.tsx"
touch_if_missing "$DS/components/layout/LeftDock.tsx"
touch_if_missing "$DS/components/layout/RightDock.tsx"
touch_if_missing "$DS/components/layout/BottomDock.tsx"

# Token components
touch_if_missing "$DS/components/tokens/ColorEditor.tsx"
touch_if_missing "$DS/components/tokens/BorderRadiusEditor.tsx"
touch_if_missing "$DS/components/tokens/TypographyScaleGrid.tsx"
touch_if_missing "$DS/components/tokens/ProfileCard.tsx"
touch_if_missing "$DS/components/tokens/SyncStatusPill.tsx"
touch_if_missing "$DS/components/tokens/TokenEditor.tsx"

# Canvas components
touch_if_missing "$DS/components/canvas/CanvasWorkspace.tsx"
touch_if_missing "$DS/components/canvas/CanvasNode.tsx"
touch_if_missing "$DS/components/canvas/BezierWire.tsx"
touch_if_missing "$DS/components/canvas/FloatingToolbar.tsx"
touch_if_missing "$DS/components/canvas/WireInspector.tsx"
touch_if_missing "$DS/components/canvas/VisionGateBadge.tsx"
touch_if_missing "$DS/components/canvas/HardlockOverlay.tsx"
touch_if_missing "$DS/components/canvas/GenerateButton.tsx"

# Inspector components
touch_if_missing "$DS/components/inspector/PropertyInspector.tsx"
touch_if_missing "$DS/components/inspector/BoxModelFields.tsx"
touch_if_missing "$DS/components/inspector/TypographyFields.tsx"
touch_if_missing "$DS/components/inspector/A11yTab.tsx"
touch_if_missing "$DS/components/inspector/HardlockError.tsx"

# Motion components
touch_if_missing "$DS/components/motion/MotionStudio.tsx"
touch_if_missing "$DS/components/motion/Timeline.tsx"
touch_if_missing "$DS/components/motion/TrackList.tsx"
touch_if_missing "$DS/components/motion/KeyframeDiamond.tsx"
touch_if_missing "$DS/components/motion/EasingSelector.tsx"

# Asset components
touch_if_missing "$DS/components/assets/AssetBrowser.tsx"
touch_if_missing "$DS/components/assets/AssetCard.tsx"
touch_if_missing "$DS/components/assets/DropZone.tsx"
touch_if_missing "$DS/components/assets/UploadProgress.tsx"

# UI primitives
touch_if_missing "$DS/components/ui/Button.tsx"
touch_if_missing "$DS/components/ui/Input.tsx"
touch_if_missing "$DS/components/ui/Badge.tsx"
touch_if_missing "$DS/components/ui/Chip.tsx"
touch_if_missing "$DS/components/ui/Separator.tsx"
touch_if_missing "$DS/components/ui/Toast.tsx"
touch_if_missing "$DS/components/ui/EmptyState.tsx"
touch_if_missing "$DS/components/ui/Tooltip.tsx"
touch_if_missing "$DS/components/ui/TabBar.tsx"

# Wireframe components
touch_if_missing "$DS/components/wireframe/WireframeEditor.tsx"
touch_if_missing "$DS/components/wireframe/BlockLibrary.tsx"
touch_if_missing "$DS/components/wireframe/BlockRenderer.tsx"
touch_if_missing "$DS/components/wireframe/PropsPanel.tsx"

# Test stubs
touch_if_missing "$DS/tests/unit/store/session.store.test.ts"
touch_if_missing "$DS/tests/unit/store/tokens.store.test.ts"
touch_if_missing "$DS/tests/unit/store/canvas-graph.store.test.ts"
touch_if_missing "$DS/tests/unit/lib/token-injection.test.ts"
touch_if_missing "$DS/tests/unit/lib/context-compression.test.ts"
touch_if_missing "$DS/tests/unit/lib/canvas-math.test.ts"
touch_if_missing "$DS/tests/unit/lib/hardlock-check.test.ts"
touch_if_missing "$DS/tests/integration/api/presets.test.ts"
touch_if_missing "$DS/tests/integration/api/canvas.test.ts"
touch_if_missing "$DS/tests/integration/api/assets.test.ts"
touch_if_missing "$DS/tests/integration/components/CanvasWorkspace.test.tsx"
touch_if_missing "$DS/tests/integration/components/PropertyInspector.test.tsx"

echo "✅  Scaffold complete."
echo "    Design server: $(find "$DS" -type f | wc -l | tr -d ' ') files — $(find "$DS" -type d | wc -l | tr -d ' ') directories"
