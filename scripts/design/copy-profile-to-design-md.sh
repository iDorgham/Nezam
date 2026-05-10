#!/usr/bin/env bash
# Copy a design catalog profile into the repo-root DESIGN.md (SDD contract file).
# Source: .cursor/design/<brand>/design.md  →  Destination: <repo-root>/DESIGN.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# pnpm forwards `pnpm run design:apply -- <brand>` as `--` then `<brand>`; skip dashes.
BRAND=""
for arg in "$@"; do
  [[ "$arg" == "--" ]] && continue
  [[ "$arg" == -* ]] && continue
  BRAND="$arg"
  break
done

usage() {
  echo "Usage: $(basename "$0") <brand>"
  echo ""
  echo "  <brand> is a folder name under .cursor/design/ (each folder contains design.md)."
  echo "  Copies:  .cursor/design/<brand>/design.md  →  DESIGN.md (repository root)"
  echo ""
  echo "Examples:"
  echo "  $(basename "$0") shadcn"
  echo "  $(basename "$0") minimal"
  echo ""
  echo "pnpm:  pnpm run design:apply -- <brand>"
  echo ""
  echo "First folders under .cursor/design/:"
  ls "$ROOT/.cursor/design" 2>/dev/null | head -30 || true
}

if [[ -z "${BRAND:-}" ]]; then
  usage
  exit 1
fi

SRC="$ROOT/.cursor/design/$BRAND/design.md"
if [[ ! -f "$SRC" ]]; then
  echo "Error: profile not found: $SRC" >&2
  usage
  exit 1
fi

cp "$SRC" "$ROOT/DESIGN.md"
echo "OK: copied"
echo "  from: $SRC"
echo "  to:   $ROOT/DESIGN.md"
echo ""
echo "Next: commit DESIGN.md when it reflects your chosen system; optional legacy mirror: cp DESIGN.md docs/DESIGN.md"
