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
    print_warning "Antigravity CLI not found. Using pure-git/bash fallback mode."
    USE_FALLBACK=true
  else
    print_success "Antigravity available"
  fi
}

# Fallback functions when antigravity CLI is not available

fallback_setup() {
  print_info "Creating Phase 2 Branches locally..."
  for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
    if git rev-parse --verify "$branch" &>/dev/null; then
      print_warning "Branch already exists: $branch"
    else
      print_info "Creating branch $branch..."
      git branch "$branch" Master
      print_success "Created branch: $branch"
    fi
  done
  print_success "All branches created locally"
}

fallback_sync_branch() {
  local source_dir=$1
  local dest_dir=$2
  local branch=$3
  local commit_msg=$4

  print_info "Syncing $source_dir to branch $branch ($dest_dir)..."
  
  if ! git rev-parse --verify "$branch" &>/dev/null; then
    git branch "$branch" Master
  fi

  local current_branch
  current_branch=$(git branch --show-current)

  # Switch to target branch
  git checkout "$branch"

  # Sync files (clean old destination and copy new files)
  mkdir -p "$dest_dir"
  find "$dest_dir" -mindepth 1 -maxdepth 1 -not -name ".git*" -exec rm -rf {} + 2>/dev/null || true
  cp -R "$source_dir"* "$dest_dir"/ 2>/dev/null || true

  # Commit if changed
  git add "$dest_dir"
  if ! git diff-index --quiet HEAD --; then
    git commit -m "$commit_msg"
    print_success "Synced and committed changes on branch $branch"
  else
    print_info "No changes to commit on branch $branch"
  fi

  # Return to original branch
  git checkout "$current_branch"
}

fallback_sync_all() {
  print_info "Syncing directories via git..."
  fallback_sync_branch ".nezam/core/reports/" "reports/v3.2" "reports/v3.2" "docs(reports): Auto-sync from core/reports"
  fallback_sync_branch ".nezam/core/plans/" "plans/v3.2-health" "plans/v3.2-health" "docs(plans): Auto-sync from core/plans"
  fallback_sync_branch ".nezam/core/prompts/" "prompts/phase2-execution" "prompts/phase2-execution" "docs(prompts): Auto-sync from core/prompts"
  fallback_sync_branch ".nezam/core/docs/" "docs/quick-start" "docs/quick-start" "docs(docs): Auto-sync from core/docs"
  print_success "All directories synced locally via git"
}

fallback_pr() {
  print_info "Creating Pull Requests..."
  for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
    local title body
    case $branch in
      reports/v3.2)
        title="📊 [Reports] Phase 2 Executive Briefing & Audits"
        body="Executive briefing, audit reports, and progress tracking."
        ;;
      plans/v3.2-health)
        title="🎯 [Plans] Phase 2 Strategic Roadmap & Health Metrics"
        body="Strategic roadmap, milestones, and health metrics for phase 2."
        ;;
      prompts/phase2-execution)
        title="⚙️ [Execution] Phase 2 Claude Code Prompts & Handoffs"
        body="All execution prompts and Claude Code handoffs for phase 2 work."
        ;;
      docs/quick-start)
        title="📖 [Docs] Phase 2 Quick Start & Command Reference"
        body="Developer onboarding and quick reference guide."
        ;;
    esac

    if command -v gh &>/dev/null; then
      if gh pr view "$branch" &>/dev/null; then
        print_warning "PR already exists for $branch"
      else
        print_info "Pushing $branch and creating PR..."
        if git push --force-with-lease origin "$branch" 2>/dev/null || git push -f origin "$branch" 2>/dev/null; then
          gh pr create --title "$title" --body "$body" --head "$branch" --base Master --label phase2 || print_warning "Could not create PR via gh CLI. Create manually."
        else
          print_warning "Could not push $branch. Push it manually to create PR."
        fi
      fi
    else
      print_warning "gh CLI not found. Please push and create PR manually on GitHub:"
      echo "  Link: https://github.com/iDorgham/Nezam/compare/Master...$branch"
    fi
  done
}

fallback_status() {
  print_info "Phase 2 Branch Status (Local)"
  echo "----------------------------------------"
  for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
    if git rev-parse --verify "$branch" &>/dev/null; then
      local last_commit
      last_commit=$(git log -1 --format="%h - %s (%cr)" "refs/heads/$branch" --)
      echo -e "🟢 ${GREEN}$branch${NC}: $last_commit"
    else
      echo -e "🔴 ${RED}$branch${NC}: Does not exist"
    fi
  done
  echo "----------------------------------------"
}

fallback_health() {
  print_info "Phase 2 Health Check (Local)"
  local all_exist=true
  for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
    if git rev-parse --verify "$branch" &>/dev/null; then
      print_success "Branch exists: $branch"
    else
      print_error "Branch missing: $branch"
      all_exist=false
    fi
  done

  if [ "$all_exist" = true ]; then
    print_success "All Phase 2 branches exist locally"
  else
    print_warning "Some branches are missing. Run setup first."
  fi
}

fallback_dashboard() {
  fallback_status
}

fallback_merge() {
  print_warning "Merging all Phase 2 branches back into Master. Proceed? (y/n)"
  read -r -n 1 -t 10 response || response="n"
  echo

  if [[ $response =~ ^[Yy]$ ]]; then
    local current_branch
    current_branch=$(git branch --show-current)
    git checkout Master

    for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
      if git rev-parse --verify "$branch" &>/dev/null; then
        print_info "Merging $branch..."
        git merge "$branch" --no-edit
        git branch -d "$branch"
        print_success "Merged and deleted local branch: $branch"
      fi
    done
    git checkout "$current_branch"
  else
    print_warning "Merge cancelled"
  fi
}

fallback_cleanup() {
  print_warning "Deleting all local Phase 2 branches. Proceed? (y/n)"
  read -r -n 1 -t 10 response || response="n"
  echo

  if [[ $response =~ ^[Yy]$ ]]; then
    for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
      if git rev-parse --verify "$branch" &>/dev/null; then
        git branch -D "$branch"
        print_success "Deleted local branch: $branch"
      fi
    done
  else
    print_warning "Cleanup cancelled"
  fi
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
      if [ "$USE_FALLBACK" = true ]; then
        fallback_setup
      else
        antigravity branch create \
          --config "$ANTIGRAVITY_CONFIG" \
          --phase 2 \
          --auto-label phase2
        print_success "All branches created"
      fi
      ;;

    sync)
      print_header "Syncing Phase 2 Directories"

      if [ "$USE_FALLBACK" = true ]; then
        fallback_sync_all
      else
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
      fi
      ;;

    pr)
      print_header "Creating Phase 2 Pull Requests"
      if [ "$USE_FALLBACK" = true ]; then
        fallback_pr
      else
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
      fi
      ;;

    status)
      print_header "Phase 2 Branch Status"
      if [ "$USE_FALLBACK" = true ]; then
        fallback_status
      else
        antigravity status \
          --phase 2 \
          --format table
      fi
      ;;

    health)
      print_header "Phase 2 Health Check"

      if [ "$USE_FALLBACK" = true ]; then
        fallback_health
      else
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
      fi
      ;;

    dashboard)
      print_header "Phase 2 Live Dashboard"
      if [ "$USE_FALLBACK" = true ]; then
        fallback_dashboard
      else
        antigravity dashboard \
          --phase 2 \
          --refresh 30s \
          --watch
      fi
      ;;

    push)
      print_header "Pushing Phase 2 Changes"

      for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
        print_info "Pushing $branch..."
        git push --force-with-lease origin "$branch" || git push -f origin "$branch" || print_warning "Could not push $branch"
      done

      print_success "Push complete"
      ;;

    merge)
      print_header "Merging Phase 2 Branches"
      if [ "$USE_FALLBACK" = true ]; then
        fallback_merge
      else
        print_warning "This action concludes phase 2. Proceed? (y/n)"
        read -r -n 1 -t 10 response || response="n"
        echo

        if [[ $response =~ ^[Yy]$ ]]; then
          for branch in reports/v3.2 plans/v3.2-health prompts/phase2-execution docs/quick-start; do
            print_info "Merging $branch..."
            antigravity merge \
              --branch "$branch" \
              --target Master \
              --auto-delete
          done
          print_success "Phase 2 merged to Master"
        else
          print_warning "Merge cancelled"
        fi
      fi
      ;;

    cleanup)
      print_header "Archiving Phase 2 Branches"
      if [ "$USE_FALLBACK" = true ]; then
        fallback_cleanup
      else
        antigravity archive \
          --phase 2 \
          --prefix archived/phase2
        print_success "Phase 2 archived"
      fi
      ;;

    full)
      print_header "Complete Phase 2 Setup"

      if [ "$USE_FALLBACK" = true ]; then
        fallback_setup
        fallback_sync_all
        fallback_pr
      else
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
      fi

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

      if [ "$USE_FALLBACK" = true ]; then
        fallback_sync_all
        fallback_status
      else
        print_info "Syncing latest changes..."
        antigravity sync \
          --config "$ANTIGRAVITY_CONFIG" \
          --auto-commit

        print_info "Checking health..."
        antigravity health check --phase 2

        print_info "Showing status..."
        antigravity status --phase 2 --format compact
      fi

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
