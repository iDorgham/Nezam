---
skill_id: nezam-design-hub
name: "nezam-Design Hub"
tier: 3
description: Operate the NEZAM Design Hub to build the design contract (sitemap, tokens, theming) and export the outputs used by SDD.
category: design
version: 1.0.0
updated: 2026-05-22
changelog:
---

# Skill: NEZAM Design Hub

This skill allows agents to interact with the NEZAM Design Hub to manage sitemaps, design tokens, theming, and exports. Lock/wireframe server capabilities are being reconciled from the v1 legacy implementation.

## Commands
- `pnpm design-hub` — Start the Design Hub (from repo root).
- `pnpm wireframe:server` — Start the hub for wireframing/locking (same local port).

## Hub sections (v2)

| Section | Scope |
|---------|--------|
| Architecture | Apps → menus → pages; **Micro Services** rack (catalog-backed `service` instances, `wiredServiceIds`, integration guide in right rail) |
| Design | Tokens; layout presets from `src/lib/design/catalog.ts` |
| Theming | Light/dark semantic `app-*` tokens |
| Preview | Browser preview + Sections (Components moved to own tab) |
| Wireframes | Per-page sessions; lock → `wireframes_locked.json` |
| Components | Top-level shadcn registry + library |

## Onboarding

Blueprint **profiles** and **page packs** live in onboarding Architecture step (not Architecture left panel).

## Usage

Use this skill when you need to lock the design contract, modify the sitemap, or operate any Design Hub section. Invoke agent `design-hub-architecture` for IA/service rack work and `design-hub-components` for the Components tab.
