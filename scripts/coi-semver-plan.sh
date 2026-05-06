#!/usr/bin/env bash
set -euo pipefail

# Lightweight helper — prints reminder checklist (does not mutate git).
echo "Semantic version planning checklist"
echo "1. Ensure CHANGELOG snippet exists for unreleased entries"
echo "2. Decide MAJOR.MINOR.PATCH bump meaning per docs/specs/sdd/VERSIONING.md"
echo "3. Confirm CI green on release branch"
echo "4. Annotated tag:"
echo "   git tag -a \"vX.Y.Z\" -m \"Release vX.Y.Z — <summary>\""
echo "5. Push tag:"
echo "   git push origin \"vX.Y.Z\""
