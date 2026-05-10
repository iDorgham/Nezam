#!/usr/bin/env bash
# Planning readiness for CI. Constitution (`docs/CONSTITUTION.md`) is intentionally optional —
# scaffold with `/CREATE constitution` when invariants matter; do not gate `/PLAN` on it here.
#
# Portable: uses only grep/find/python3 (no ripgrep) so ubuntu-latest runners pass without extra packages.
set -euo pipefail

hardlock_paths_file="docs/core/hardlock-paths.json"

read_json_string() {
  local file="$1"
  local key="$2"
  python3 - <<'PY' "$file" "$key"
import json,sys
path=sys.argv[1]
key=sys.argv[2]
obj=json.load(open(path,'r',encoding='utf-8'))
cur=obj
for part in key.split('.'):
  if part not in cur:
    raise SystemExit(2)
  cur=cur[part]
if not isinstance(cur,str):
  raise SystemExit(3)
print(cur)
PY
}

read_json_array() {
  local file="$1"
  local key="$2"
  python3 - <<'PY' "$file" "$key"
import json,sys
path=sys.argv[1]
key=sys.argv[2]
obj=json.load(open(path,'r',encoding='utf-8'))
cur=obj
for part in key.split('.'):
  cur=cur[part]
if not isinstance(cur,list):
  raise SystemExit(3)
for x in cur:
  if isinstance(x,str):
    print(x)
PY
}

if [[ ! -f "$hardlock_paths_file" ]]; then
  echo "Missing hardlock path registry: $hardlock_paths_file"
  echo "Create it first to configure required paths."
  exit 1
fi

prd_path="$(read_json_string "$hardlock_paths_file" "intake.prd" || true)"
prompt_path="$(read_json_string "$hardlock_paths_file" "intake.projectPrompt" || true)"
gate_manifest_path="$(read_json_string "$hardlock_paths_file" "planning.gateManifest" || true)"
changelog_path="$(read_json_string "$hardlock_paths_file" "planning.changelog" || true)"
versioning_path="$(read_json_string "$hardlock_paths_file" "planning.versioning" || true)"
plans_root="$(read_json_string "$hardlock_paths_file" "subphasePrompts.plansRoot" || true)"
task_glob="$(read_json_string "$hardlock_paths_file" "subphasePrompts.taskFileGlob" || true)"

if [[ -z "$prd_path" || -z "$prompt_path" || -z "$gate_manifest_path" || -z "$changelog_path" || -z "$versioning_path" || -z "$plans_root" || -z "$task_glob" ]]; then
  echo "Invalid hardlock path registry: missing required keys."
  exit 1
fi

missing=0
changelog_missing=0

required_files=(
  "$prd_path"
  "$prompt_path"
  "$gate_manifest_path"
  "$versioning_path"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required onboarding artifact: $file"
    missing=1
  fi
done

if [[ ! -f "$changelog_path" ]]; then
  changelog_missing=1
fi

# PRD quality gate: block obvious template/placeholder PRDs (avoid false positives on words like "templates/").
if [[ -f "$prd_path" ]]; then
  prd_file="$prd_path"
  if grep -qiE 'lorem ipsum|\{\{|fill in the blank|placeholder-only|\bTBD:\s*(here|replace|fixme)\b|^# .*\(draft template\)' "$prd_file"; then
    echo "PRD appears template/placeholder-based: $prd_file"
    echo "Please complete PRD content before planning is unlocked."
    missing=1
  fi
fi

# PRD <-> PROJECT_PROMPT alignment gate.
if [[ -f "$prd_path" && -f "$prompt_path" ]]; then
  prd_file="$prd_path"
  prompt_file="$prompt_path"

  prd_title="$(grep -m1 '^# ' "$prd_file" 2>/dev/null | sed 's/^# *//' | tr '[:upper:]' '[:lower:]' || true)"
  prompt_title="$(grep -m1 '^# ' "$prompt_file" 2>/dev/null | sed 's/^# *//' | tr '[:upper:]' '[:lower:]' || true)"

  if [[ -n "$prd_title" && -n "$prompt_title" ]]; then
    if [[ "$prompt_title" != *"${prd_title%%—*}"* && "${prd_title%%—*}" != *"$prompt_title"* ]]; then
      echo "PRD/PROMPT title mismatch: documents appear misaligned."
      echo "PRD title: $prd_title"
      echo "PROMPT title: $prompt_title"
      missing=1
    fi
  fi

  # Require at least 2 shared domain keywords (length >= 5) between files.
  shared_keywords="$(
    {
      grep -oE '[A-Za-z][A-Za-z0-9_-]{4,}' "$prd_file" || true
      echo "---"
      grep -oE '[A-Za-z][A-Za-z0-9_-]{4,}' "$prompt_file" || true
    } | awk '
      BEGIN { section=1 }
      /^---$/ { section=2; next }
      {
        w=tolower($0)
        if (w ~ /^(about|after|before|being|build|check|create|design|docs|file|files|from|have|into|must|project|prompt|required|rules|should|that|this|using|with|where|when|will|work|workspace)$/) next
        if (section==1) a[w]=1
        else b[w]=1
      }
      END {
        c=0
        for (k in a) if (k in b) c++
        print c
      }'
  )"

  shared_keywords="${shared_keywords//[[:space:]]/}"
  if [[ -z "$shared_keywords" || "$shared_keywords" -lt 2 ]]; then
    echo "PRD/PROMPT semantic mismatch: insufficient shared domain keywords."
    echo "Expected PRD and PROJECT_PROMPT to describe the same scope."
    missing=1
  fi
fi

if [[ -f "$gate_manifest_path" ]]; then
  if ! grep -Fq '"manifestVersion"' "$gate_manifest_path"; then
    echo "Invalid gate manifest: missing manifestVersion"
    missing=1
  fi
  if ! grep -Fq '"gates"' "$gate_manifest_path"; then
    echo "Invalid gate manifest: missing gates array"
    missing=1
  fi
fi

subphase_tasks="$(find "$plans_root" -type f -name TASKS.md 2>/dev/null || true)"
if [[ -n "$subphase_tasks" ]]; then
  while IFS= read -r tasks_file; do
    [[ -z "$tasks_file" ]] && continue
    subphase_dir="$(dirname "$tasks_file")"
    if [[ ! -f "$subphase_dir/prompt.json" ]]; then
      echo "Missing required sub-phase prompt artifact: $subphase_dir/prompt.json"
      missing=1
    fi
    if [[ ! -f "$subphase_dir/PROMPT.md" ]]; then
      echo "Missing required sub-phase prompt artifact: $subphase_dir/PROMPT.md"
      missing=1
    fi
  done <<< "$subphase_tasks"
fi

# Silent bootstrap: once PRD+PROJECT_PROMPT quality/alignment and other hardlocks pass,
# initialize CHANGELOG.md from template automatically if it is the only missing gate.
if [[ "$missing" -eq 0 && "$changelog_missing" -eq 1 ]]; then
  node "scripts/changelog/ensure-changelog-initialized.js" >/dev/null 2>&1 || true
  if [[ ! -f "$changelog_path" ]]; then
    echo "Missing required onboarding artifact: $changelog_path"
    missing=1
  fi
fi

if [[ "$missing" -ne 0 ]]; then
  echo
  echo "Planning readiness check failed."
  echo "Required order:"
  echo "1. /START repo"
  echo "2. Add $prd_path manually (preferred; copy from docs/prd/PRD.md if that is your canonical draft)"
  echo "3. Optional: /CREATE prd for guided drafting"
  echo "4. Add $prompt_path manually (or /CREATE prompt)"
  echo "5. Create gate manifest at $gate_manifest_path (or docs/plans/gates/GITHUB_GATE_MATRIX.json per hardlock-paths.json)"
  echo "6. Initialize $versioning_path"
  echo "7. Ensure each $plans_root/<phase>/<subphase>/ with TASKS.md has prompt.json + PROMPT.md"
  echo "8. /START gates"
  if [[ ! -f "$changelog_path" ]]; then
    echo "9. Ensure $changelog_path exists (auto-bootstrap runs silently when other gates pass)"
  fi
  exit 1
fi

echo "Planning readiness check passed."
