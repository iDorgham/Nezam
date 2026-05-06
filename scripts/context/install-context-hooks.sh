#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
hooks_dir="$repo_root/.githooks"

if [[ ! -d "$hooks_dir" ]]; then
  echo "Missing $hooks_dir. Cannot install hooks."
  exit 1
fi

git -C "$repo_root" config core.hooksPath .githooks
chmod +x "$hooks_dir/post-commit" "$hooks_dir/post-merge"
echo "Installed context hooks using core.hooksPath=.githooks"
echo "Hooks will auto-refresh docs/context/workspace.md and docs/context/project.md"
