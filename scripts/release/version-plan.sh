#!/usr/bin/env bash
set -euo pipefail

echo "Semantic version planning checklist"
echo "1. Ensure CHANGELOG snippet exists for unreleased entries"
echo "2. Decide MAJOR.MINOR.PATCH bump meaning per .nezam/workspace/VERSIONING.md"
echo "3. Confirm CI green on release branch"
echo "4. Annotated tag:"
echo "   git tag -a \"vX.Y.Z\" -m \"Release vX.Y.Z — <summary>\""
echo "5. Push tag:"
echo "   git push origin \"vX.Y.Z\""
echo "6. Preferred automation:"
echo "   Trigger GitHub workflow: .github/workflows/release.yml"
echo "   Inputs: version=X.Y.Z target=main prerelease=false"
