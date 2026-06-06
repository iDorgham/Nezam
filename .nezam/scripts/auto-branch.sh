#!/bin/bash
# NEZAM Auto-Branch Creator
# Creates git branches with consistent naming from task IDs
#
# Usage:
#   ./auto-branch.sh "T-v3.2-P1-001 implement sync validation"
#   ./auto-branch.sh "T-v3.2-P2-015 fix phase numbering" "fix"
#   ./auto-branch.sh "T-v3.2-P3-022 update design system" "docs"

set -e

TASK_DESC="${1:-}"
BRANCH_TYPE="${2:-feature}"

# Validate inputs
if [ -z "$TASK_DESC" ]; then
    echo "❌ Usage: ./auto-branch.sh \"T-v3.2-PN-NNN task description\" [type]"
    echo ""
    echo "Types: feature (default), fix, docs, refactor, chore"
    exit 1
fi

# Extract task ID from description
TASK_ID=$(echo "$TASK_DESC" | grep -oE "T-v3\.2-P[0-9]+-[0-9]{3}" || true)

if [ -z "$TASK_ID" ]; then
    echo "❌ Task ID not found in description"
    echo "   Format required: T-v3.2-PN-NNN"
    echo "   Example: T-v3.2-P1-001 implement sync validation"
    exit 1
fi

# Validate branch type
case "$BRANCH_TYPE" in
    feature|fix|docs|refactor|chore)
        ;;
    *)
        echo "❌ Invalid branch type: $BRANCH_TYPE"
        echo "   Valid types: feature, fix, docs, refactor, chore"
        exit 1
        ;;
esac

# Extract description part (everything after task ID)
DESC_PART=$(echo "$TASK_DESC" | sed "s/$TASK_ID //g" | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g' | cut -c1-40)

# Build branch name
BRANCH_NAME="${BRANCH_TYPE}/${TASK_ID}-${DESC_PART}"

# Check if branch already exists
if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
    echo "⚠️  Branch already exists: $BRANCH_NAME"
    echo "   Checking it out..."
    git checkout "$BRANCH_NAME"
    exit 0
fi

# Create and checkout branch
echo "🌿 Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" main

# Set up branch configuration
git config branch."$BRANCH_NAME".description "$TASK_DESC"

echo "✓ Branch created and checked out"
echo ""
echo "Next steps:"
echo "  1. Make your changes"
echo "  2. Commit: git commit -m \"$TASK_ID: your message\""
echo "  3. Push: git push -u origin $BRANCH_NAME"
echo "  4. Create PR from GitHub"
echo ""
echo "Tip: Commit message is auto-formatted with task ID!"
