# Feature Spec — F-002: UI CSS Sync Status Indicators

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-002 |
| Feature Name | UI CSS Sync Status Indicators |
| Priority | P0 |
| Personas affected | Amina |
| PRD section | Section 4, Row 2 |
| Status | approved |
| Last updated | 2026-05-18 |

---

## 1. User Story

**As a** senior frontend engineer,
**I want to** see a persistent sync status indicator in the header,
**so that** I always know whether my token edits have been compiled to CSS or are pending.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given the app loads, when tokens are current with disk state, then a "CSS Synchronized" green pill appears in the header within 500ms of load.
- [ ] **AC-002:** Given the user edits any token value, when the change is made, then the pill transitions to "Syncing…" (amber) within 16ms.
- [ ] **AC-003:** Given the sync completes successfully, when the API returns 200, then the pill transitions to "CSS Synchronized" (green) within the latency bound (< 50ms compile).
- [ ] **AC-004:** Given a disk write error, when the API returns 5xx, then the pill shows "Sync Failed" (red) with a retry icon. Clicking retry re-triggers the sync.
- [ ] **AC-005:** Given `prefers-reduced-motion: reduce`, when the pill transitions, then the color change is instant (no fade animation).

### 2.1 Out of Scope

- ❌ Live WebSocket push for multi-user sync — v2

---

## 3. UI Specification

### 3.1 SyncStatusPill Component

```
╔══════════════════════╗
║ ● CSS Synchronized   ║   ← green (#22C55E) text + border
╚══════════════════════╝

╔══════════════════════╗
║ ◌ Syncing...        ║   ← amber (#F59E0B), spinning dot
╚══════════════════════╝

╔══════════════════════╗
║ ✕ Sync Failed  ↺    ║   ← red (#EF4444), retry icon clickable
╚══════════════════════╝
```

- Border-radius: `var(--ds-radius-full)` (pill shape)
- Padding: `var(--ds-space-1) var(--ds-space-3)` (4px 12px)
- Font-size: `var(--ds-text-xs)`, weight: `var(--ds-weight-medium)`
- Transition: `color 200ms ease, border-color 200ms ease` (disabled when reduced-motion)

### 3.2 Placement

Top navigation bar, inline-end side, before user avatar.

---

## 4. State Machine

```
idle → syncing → synchronized
                → error → [retry] → syncing
```

Managed in `useTokensStore` via `syncStatus: 'idle' | 'syncing' | 'synchronized' | 'error'`.

---

## 5. Edge Cases

- Token edit triggers rapid successive changes → debounce sync call by 200ms
- Multiple simultaneous saves → queue; show last result
- App opens offline → pill shows "Offline" (muted) — no sync attempt

---

## 6. Definition of Done

- [ ] `SyncStatusPill` component renders in `TopNav`
- [ ] Status cycles correctly through all 4 states
- [ ] Retry button re-triggers POST /api/presets/sync-to-disk
- [ ] Reduced-motion fallback: no CSS transitions
- [ ] Unit tests: state transitions + retry logic
- [ ] Contrast ratio ≥ 4.5:1 verified for all 3 color states
