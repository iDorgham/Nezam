# Project Scaffold — Nightclub System

> **Product Type:** Web Dashboard (Next.js) + Mobile Apps (Flutter)

## 1. Directory Tree

```text
/
├── src/                                [Web Dashboard - Next.js]
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                [Landing Page]
│   │   │   └── book/[club-slug]/page.tsx [Table Booking Page]
│   │   ├── admin/
│   │   │   ├── owner/page.tsx          [Owner Dashboard]
│   │   │   ├── manager/page.tsx        [Manager Dashboard]
│   │   │   ├── accountant/page.tsx     [Accountant Dashboard]
│   │   │   └── tables/page.tsx         [Floor Plan Editor]
│   │   └── layout.tsx                  [Root Layout]
│   ├── components/
│   │   ├── ui/                         [Base UI Components]
│   │   └── features/                   [Feature Components]
│   └── lib/
│       ├── supabase/                   [Supabase Client]
│       └── utils/                      [Helper Functions]
├── mobile/                             [Mobile Apps - Flutter]
│   ├── lib/
│   │   ├── sales/
│   │   │   ├── dashboard.dart          [Sales Dashboard]
│   │   │   └── reservations.dart       [Reservations List]
│   │   ├── security/
│   │   │   ├── scanner.dart            [QR Scanner]
│   │   │   └── list.dart               [Guest List]
│   │   └── main.dart                   [Entry Point]
│   └── pubspec.yaml                    [Flutter Config]
├── docs/
│   ├── plan/                           [Planning Docs]
│   └── start/                          [PRD]
└── scripts/
    └── scaffold.sh                     [Scaffold Script]
```

## 2. Config File Inventory
- `src/package.json` (Next.js dependencies)
- `mobile/pubspec.yaml` (Flutter dependencies)
- `.gitignore`
- `README.md`

## 3. Database Schema
- Managed via Supabase (PostgreSQL). Migrations will be placed in `supabase/migrations/` if local development is used.
