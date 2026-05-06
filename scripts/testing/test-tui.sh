#!/usr/bin/env bash
# Optional local validation for scripts/ui/workspace-tui.sh — safe in CI logs (TTY optional).
# Do not pipe this script to `head`/`tail`; long-running demos will SIGPIPE (exit 141).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="${ROOT}/scripts/ui/workspace-tui.sh"

run_demo() {
  local fmt="${1:?}"
  local label="${2:?}"
  local export_cursor="${3:-}"

  COIA_ROOT="${ROOT}" COIA_TUI_FORMAT="${fmt}" CURSOR_CHAT="${export_cursor:-}" bash -s <<'EOSCRIPT' "${SRC}" "${label}"
set -euo pipefail
SRC="${1:?}"
LABEL="${2:?}"
[[ -r "${SRC}" ]] || exit 2
source "${SRC}"

print_header "${LABEL}"

print_badge PASS "Smoke validation"

collapsible_start "Sample collapsible" 0
collapsible_line "line one"
collapsible_line "line two"
collapsible_end

render_table 'Package|Current|Severity' 'lodash|4.17.20|HIGH' 'axios|0.21.1|MEDIUM'

print_badge INFO "Synthetic SCAN-style output"

DELAY="${COIA_TUI_TEST_SLEEP:-0.2}"
progress_bar_start 5 "timing demo" || true
for i in 1 2 3 4 5; do
  progress_bar_update "${COIA_PB_HANDLE:-}" "${i}" "step ${i}"
  sleep "${DELAY}"
done
progress_bar_finish

start_ts="${COIA_CMD_START_TS:-$(date +%s)}"
end_ts="$(date +%s)"
print_footer "$(( end_ts - start_ts ))" 0
EOSCRIPT

}

run_demo markdown SCAN_MARKDOWN_SAMPLE ""
run_demo terminal SCAN_TERMINAL_SAMPLE ""
COIA_ROOT="${ROOT}" CURSOR_CHAT=1 COIA_TUI_FORMAT=auto bash -s <<'EOSCRIPT' "${SRC}"
set -euo pipefail
SRC="${1:?}"
source "${SRC}"
print_header 'AUTO_via_CURSOR_CHAT'
print_badge INFO "auto → markdown profile when CURSOR_CHAT=1"
start_ts="$(date +%s)"
print_footer "$(($(date +%s)-start_ts))" 0
EOSCRIPT

printf '\n%s\n' "test-tui OK"
