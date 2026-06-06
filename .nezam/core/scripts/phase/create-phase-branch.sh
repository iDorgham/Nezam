#!/bin/bash

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VALID_PHASES=("planning" "seo-aeo" "ia" "content" "design" "development" "release")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

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
  echo -e "${BLUE}ℹ️  $1${NC}"
}

validate_phase() {
  local phase=$1
  for valid_phase in "${VALID_PHASES[@]}"; do
    if [[ "$phase" == "$valid_phase" ]]; then
      return 0
    fi
  done
  return 1
}

# Main
main() {
  cd "$PROJECT_ROOT"

  print_header "NEZAM SDD Phase Branch Creator"

  # Get git configurations safely to prevent crash if not configured
  GIT_USER=$(git config user.name || echo "Developer")
  GIT_EMAIL=$(git config user.email || echo "developer@nezam.dev")
  REMOTE_URL=$(git config --get remote.origin.url || echo "https://github.com/iDorgham/Nezam")
  REPO_PATH=$(echo "$REMOTE_URL" | sed 's/.*://;s/.git$//' || echo "iDorgham/Nezam")

  # Get phase input
  if [ $# -lt 1 ]; then
    echo "Usage: $0 <phase>"
    echo ""
    echo "Valid phases:"
    for phase in "${VALID_PHASES[@]}"; do
      echo "  - $phase"
    done
    exit 1
  fi

  PHASE=$1

  # Validate phase
  if ! validate_phase "$PHASE"; then
    print_error "Invalid phase: $PHASE"
    echo ""
    echo "Valid phases:"
    for phase in "${VALID_PHASES[@]}"; do
      echo "  - $phase"
    done
    exit 1
  fi

  print_success "Phase validation passed: $PHASE"
  echo ""

  # Check git status
  if ! git diff-index --quiet HEAD --; then
    print_warning "Working directory has uncommitted changes"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      print_error "Aborted"
      exit 1
    fi
  fi

  # Create branch name
  BRANCH_NAME="phase/$PHASE/$(date +%Y-%m-%d)"
  print_info "Branch name: $BRANCH_NAME"

  # Check if branch exists
  if git rev-parse --verify "origin/$BRANCH_NAME" &>/dev/null; then
    print_warning "Branch already exists on remote: $BRANCH_NAME"
    read -p "Push new commits to existing branch? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      print_error "Aborted"
      exit 1
    fi
    git checkout "$BRANCH_NAME"
  else
    # Create new branch
    print_info "Creating new branch..."
    git checkout -b "$BRANCH_NAME"
    print_success "Branch created: $BRANCH_NAME"
  fi

  # Create phase state directory
  STATE_DIR=".cursor/state"
  mkdir -p "$STATE_DIR"

  # Create phase state file
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  cat > "$STATE_DIR/phase-${PHASE}.yaml" <<EOF
phase: $PHASE
status: in_progress
created_at: $TIMESTAMP
branch: $BRANCH_NAME
created_by: "$GIT_USER"
email: "$GIT_EMAIL"

requirements_checklist:
  - item: "Define phase requirements"
    status: pending
  - item: "Document specifications"
    status: pending
  - item: "Update team"
    status: pending
  - item: "Request reviews"
    status: pending

git_info:
  branch: $BRANCH_NAME
  commit_hash: "$(git rev-parse HEAD || echo 'uncommitted')"
  remote_url: "$REMOTE_URL"
EOF

  print_success "Created phase state file: $STATE_DIR/phase-${PHASE}.yaml"

  # Create phase progress directory
  PHASE_DIR=".nezam/core/plans/$PHASE"
  mkdir -p "$PHASE_DIR"

  # Create progress file
  cat > "$PHASE_DIR/progress.md" <<EOF
# $PHASE Phase Progress

**Started**: $TIMESTAMP
**Branch**: $BRANCH_NAME
**Created by**: $GIT_USER

## Objectives

- [ ] Define phase requirements
- [ ] Document scope and deliverables
- [ ] Assign resources
- [ ] Setup timeline
- [ ] Plan quality gates

## Deliverables

- [ ] Phase specification document
- [ ] Design/code review (if applicable)
- [ ] Updated documentation
- [ ] Quality assurance results
- [ ] Team sign-off

## Status Checklist

- [ ] Phase started
- [ ] Work in progress
- [ ] Ready for review
- [ ] Approved
- [ ] Merged to Master

## Timeline

| Activity | Planned | Actual | Status |
|----------|---------|--------|--------|
| Requirements | TBD | TBD | ⏳ |
| Development | TBD | TBD | ⏳ |
| Review | TBD | TBD | ⏳ |
| Merge | TBD | TBD | ⏳ |

## Team Members

- Product Owner: _Name_
- Tech Lead: _Name_
- Designer: _Name_ (if applicable)
- QA: _Name_

## Dependencies

### Prerequisites (from previous phases)
- [ ] Previous phases completed
- [ ] Required artifacts available
- [ ] Team ready to proceed

### Blockers & Risks
- _Add any blockers or risks here_

## Notes & Updates

_Add notes and progress updates here._

---

**Last Updated**: $TIMESTAMP
**Created by**: $GIT_USER
EOF

  print_success "Created phase progress file: $PHASE_DIR/progress.md"

  # Stage and commit
  echo ""
  print_info "Staging phase files..."
  git add "$STATE_DIR/phase-${PHASE}.yaml"
  git add "$PHASE_DIR/progress.md"

  print_info "Committing phase initialization..."
  git commit -m "ci: Initialize $PHASE phase

- Create phase state file
- Setup progress tracking
- Configure branch: $BRANCH_NAME
- Phase status: in_progress

Phase: $PHASE
Branch: $BRANCH_NAME
Created: $TIMESTAMP"

  print_success "Committed phase files"

  # Push
  echo ""
  print_info "Pushing branch to remote..."
  if git push -u origin "$BRANCH_NAME"; then
    print_success "Pushed branch: origin/$BRANCH_NAME"
  else
    print_warning "Failed to push branch to remote (network may be offline)."
    print_info "Please run manually when online:"
    echo "  git push -u origin $BRANCH_NAME"
  fi

  # Summary
  echo ""
  print_header "Phase Branch Created Successfully"
  echo ""
  echo -e "${GREEN}Phase Setup Complete${NC}"
  echo ""
  echo "Branch Details:"
  echo "  Name: $BRANCH_NAME"
  echo "  Remote: origin/$BRANCH_NAME"
  echo ""
  echo "Files Created:"
  echo "  State: .cursor/state/phase-${PHASE}.yaml"
  echo "  Progress: .nezam/core/plans/${PHASE}/progress.md"
  echo ""
  echo "Next Steps:"
  echo "  1. Create a Pull Request on GitHub"
  echo "  2. Add phase requirements to progress file"
  echo "  3. Request reviews from team members"
  echo "  4. Update checklist as you complete items"
  echo "  5. Merge when phase is complete"
  echo ""
  echo "GitHub PR Command:"
  echo "  Visit: https://github.com/$REPO_PATH/compare/Master...$BRANCH_NAME"
  echo ""
  echo "Or use GitHub CLI:"
  echo "  gh pr create --base Master --head $BRANCH_NAME --title '🚀 [$PHASE] Initialize Phase' --body 'Phase: $PHASE'"
  echo ""
  echo "────────────────────────────────────────"
}

# Run
main "$@"
