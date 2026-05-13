#!/usr/bin/env bash
# Workspace TUI presentation helpers (terminal + markdown).
# shellcheck disable=SC2155

set -o nounset

WORKSPACE_TUI_FORMAT="${WORKSPACE_TUI_FORMAT:-auto}"
TUI_RESOLVED="markdown"

resolve_format() {
  local fmt="${WORKSPACE_TUI_FORMAT}"
  if [[ "${fmt}" == "auto" ]]; then
    if [[ "${CURSOR_CHAT:-}" == "1" ]] || [[ ! -t 1 ]]; then
      TUI_RESOLVED="markdown"
    else
      TUI_RESOLVED="terminal"
    fi
  else
    TUI_RESOLVED="${fmt}"
  fi
}

print_header() {
  local cmd="${1:-COMMAND}"
  resolve_format
  printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
  printf '📦 Workspace · %s · %s\n' "${cmd}" "$(date '+%Y-%m-%d %H:%M:%S')"
  printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
}

print_footer() {
  local duration="${1:-0}"
  local exit_code="${2:-0}"
  printf '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
  if [[ "${exit_code}" -eq 0 ]]; then
    printf '✅ Done in %ss\n' "${duration}"
  else
    printf '❌ Failed after %ss (exit %s)\n' "${duration}" "${exit_code}"
  fi
  printf '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
}

print_badge() {
  local badge="${1:-INFO}"
  local msg="${2:-}"
  printf '%s   │ %s\n\n' "${badge}" "${msg}"
}

collapsible_start() { printf '[+] %s\n' "${1:-Details}"; }
collapsible_line() { printf '    • %s\n' "${1:-}"; }
collapsible_end() { printf '\n'; }

progress_bar_start() { :; }
progress_bar_update() { :; }
progress_bar_finish() { :; }

render_table() {
  local header="${1:-}"
  shift || true
  printf '%s\n' "${header}"
  for row in "$@"; do
    printf '%s\n' "${row}"
  done
  printf '\n'
}
