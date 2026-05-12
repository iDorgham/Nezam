#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
hooks_dir="$repo_root/.githooks"

if [[ ! -d "$hooks_dir" ]]; then
  echo "Missing $hooks_dir. Cannot install hooks."
  exit 1
fi

git -C "$repo_root" config core.hooksPath .githooks
chmod +x "$hooks_dir/post-commit" "$hooks_dir/post-merge" "$hooks_dir/pre-commit"
bash "$repo_root/scripts/context/auto-memory-hooks.sh" --install
echo "Installed context hooks using core.hooksPath=.githooks"
echo "Hooks will auto-refresh .nezam/memory/CONTEXT.md and .nezam/memory/CONTEXT.md"
echo "Hooks now also update MEMORY.md + HEALTH.md spec score + CONTEXT.md timestamp on commit"
