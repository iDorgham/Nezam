#!/bin/bash

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
ANTIGRAVITY_CONFIG="$PROJECT_ROOT/.antigravity/phase2-setup.yaml"

# Functions
print_header() {
  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${CYAN}ℹ️  $1${NC}"
}

check_antigravity() {
  if ! command -v antigravity &> /dev/null; then
    print_error "Antigravity not found. Install with: npm install -g @antigravity/cli"
    exit 1
  fi
  print_success "Antigravity available"
}

# Main
main() {
  cd "$PROJECT_ROOT"

  print_header "Antigravity Phase 2 Orchestration"

  # Get action
  if [ $# -lt 1 ]; then
    echo "Usage: $0 <action>"
    echo ""
    echo "Available actions:"
    echo "  setup              Create all 4 branches"
    echo "  sync               Sync all directories to branches"
    echo "  pr                 Create all PRs"
    echo "  status             Show branch status"
    echo "  health             Check phase 2 health"
    echo "  dashboard          Show live dashboard"
    echo "  push               Push all changes"
    echo "  merge              Merge all branches (phase end)"
    echo "  cleanup            Archive branches"
    echo ""
    echo "Batch actions:"
    echo "  full               setup + sync + pr (complete setup)"
    echo "  daily              sync + status (daily routine)"
    echo ""
    exit 1
  fi

  ACTION=$1

  # Check dependencies
  check_antigravity

  # Execute action
  case $ACTION in
    setup)
      print_header "Creating Phase 2 Branches"
      antigravity branch create \
        --config "$ANTIGRAVITY_CONFIG" \
        --phase 2 \
        --auto-label phase2
      print_success "All branches created"
      ;;

    sync)
      print_header "Syncing Phase 2 Directories"

      # Sync reports
      print_info "Syncing reports..."
      antigravity sync \
        --source .nezam/core/reports/ \
        --branch reports/v3.2 \
        --auto-commit

      # Sync plans
      print_info "Syncing plans..."
      antigravity sync \
        --source .nezam/core/plans/ \
        --branch plans/v3.2-health \
        --auto-commit

      # Sync prompts
      print_info "Syncing prompts..."
      antigravity sync \
        --source .nezam/core/prompts/ \
        --branch prompts/phase2-execution \
        --auto-commit

      # Sync docs
      print_info "Syncing docs..."
      antigravity sync \
        --source .nezam/core/docs/ \
        --branch docs/quick-start \
        --auto-commit

      print_success "All directories synced"
      ;;

    pr)
      print_header "Creating Phase 2 Pull Requests"
      antigravity pr create \
        --config "$ANTIGRAVITY_CONFIG" \
        --template phase2 \
        --branches \
          reports/v3.2 \
          plans/v3.2-health \
          prompts/phase2-execution \
          docs/quick-start \
        --auto-label phase2
      print_success "All PRs created"
      ;;

    status)
      print_header "Phase 2 Branch Status"
      antigravity status \
        --phase 2 \
        --format table
      ;;

    health)
      print_header "Phase 2 Health Check"

      echo ""
      echo "Checking branch health..."
      antigravity health check \
        --phase 2 \
        --detailed

      echo ""
      echo "Checking sync status..."
      antigravity sync status \
        --phase 2

      echo ""
      echo "Checking PR status..."
      antigravity pr status \
        --phase 2

      print_success "Health check complete"
      ;;

    dashboard)
      print_header "Phase 2 Live Dashboard"
      antigravity dashboard \
        --phase 2 \
        --refresh 30s \
        --watch
      ;;

    push)
      print_header "Pushing Phase 2 Changes"

      for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
        print_info "Pushing $branch..."
        git push origin "$branch" || print_warning "Could not push $branch"
      done

      print_success "Push complete"
      ;;

    merge)
      print_header "Merging Phase 2 Branches"
      print_warning "This action concludes phase 2. Proceed? (y/n)"
      read -r -n 1 -t 10 response || response="n"
      echo

      if [[ $response =~ ^[Yy]$ ]]; then
        for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
          print_info "Merging $branch..."
          antigravity merge \
            --branch "$branch" \
            --target main \
            --auto-delete
        done
        print_success "Phase 2 merged to main"
      else
        print_warning "Merge cancelled"
      fi
      ;;

    cleanup)
      print_header "Archiving Phase 2 Branches"
      antigravity archive \
        --phase 2 \
        --prefix archived/phase2
      print_success "Phase 2 archived"
      ;;

    full)
      print_header "Complete Phase 2 Setup"

      print_info "Step 1: Creating branches..."
      antigravity branch create \
        --config "$ANTIGRAVITY_CONFIG" \
        --phase 2

      print_info "Step 2: Syncing directories..."
      antigravity sync \
        --config "$ANTIGRAVITY_CONFIG" \
        --auto-commit

      print_info "Step 3: Creating PRs..."
      antigravity pr create \
        --config "$ANTIGRAVITY_CONFIG" \
        --template phase2

      echo ""
      print_success "Phase 2 setup complete!"
      echo ""
      echo "Next steps:"
      echo "  1. Review the branches on GitHub"
      echo "  2. Read reports/v3.2_EXECUTIVE_BRIEF.md"
      echo "  3. Review plans/ROADMAP_v3.2_HEALTH_100.md"
      echo "  4. Begin execution with prompts/phase2-execution"
      echo "  5. Share docs/QUICK-START.md with team"
      ;;

    daily)
      print_header "Daily Phase 2 Routine"

      print_info "Syncing latest changes..."
      antigravity sync \
        --config "$ANTIGRAVITY_CONFIG" \
        --auto-commit

      print_info "Checking health..."
      antigravity health check --phase 2

      print_info "Showing status..."
      antigravity status --phase 2 --format compact

      print_success "Daily routine complete"
      ;;

    *)
      print_error "Unknown action: $ACTION"
      exit 1
      ;;
  esac

  echo ""
  echo "────────────────────────────────────────"
}

# Run
main "$@"
