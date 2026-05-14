#!/bin/bash
# Idempotent scaffold script for Nightclub System

echo "🏗️ Creating directory structure..."

# Web Dashboard (Next.js)
mkdir -p src/app/\(public\)/book/\[club-slug\]
mkdir -p src/app/admin/owner
mkdir -p src/app/admin/manager
mkdir -p src/app/admin/accountant
mkdir -p src/app/admin/tables
mkdir -p src/components/ui
mkdir -p src/components/features
mkdir -p src/lib/supabase
mkdir -p src/lib/utils

# Mobile App (Flutter)
mkdir -p mobile/lib/sales
mkdir -p mobile/lib/security

# Create empty stubs
echo "touching files..."

# Web
touch src/app/page.tsx
touch src/app/layout.tsx
touch src/app/\(public\)/book/\[club-slug\]/page.tsx
touch src/app/admin/owner/page.tsx
touch src/app/admin/manager/page.tsx
touch src/app/admin/accountant/page.tsx
touch src/app/admin/tables/page.tsx

# Mobile
touch mobile/lib/main.dart
touch mobile/lib/sales/dashboard.dart
touch mobile/lib/sales/reservations.dart
touch mobile/lib/security/scanner.dart
touch mobile/lib/security/list.dart
touch mobile/pubspec.yaml

echo "✅ Scaffold directories and files created!"
