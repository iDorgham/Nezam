# Wireframes — Nightclub System

> **Selections:** Based on user choices during /plan design.

## 1. Web Dashboard Navigation (Option C - Collapsible Sidebar)

```text
┌─────────────────────────────────────────────────────────────┐
│  SCREEN: Web Dashboard Shell    ID: WB_NAV_01               │
│  Journey: Post-Login Main View  Type: Dashboard Shell       │
│  Breakpoint: Desktop 1440px                                 │
└─────────────────────────────────────────────────────────────┘

┌───┬─────────────────────────────────────────────────────────┐
│[L]│  Search...                                  [🔔] [Avatar]│
├───┼─────────────────────────────────────────────────────────┤
│   │                                                         │
│[🏠]│                                                         │
│   │                                                         │
│[🪑]│                                                         │
│   │               [MAIN CONTENT AREA]                        │
│[👥]│                                                         │
│   │                                                         │
│[💰]│                                                         │
│   │                                                         │
│[📱]│                                                         │
│   │                                                         │
├───┤                                                         │
│[⚙️]│                                                         │
└───┴─────────────────────────────────────────────────────────┘
```

## 2. Floor Plan Editor (Option B - Full Screen Canvas)

```text
┌─────────────────────────────────────────────────────────────┐
│  SCREEN: Floor Plan Editor      ID: WB_FLOOR_01             │
│  Journey: Admin > Floor Plan    Type: Visual Canvas         │
│  Breakpoint: Desktop 1440px                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Floor Plan Editor                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────┐                       │
│  │ CANVAS (Drag & Drop Area)        │                       │
│  │                                  │  ┌────────────┐       │
│  │     ┌───┐                        │  │ TOOLBOX    │       │
│  │     │T1 │                        │  │ [O] Circle │       │
│  │     └───┘                        │  │ [[] Rect   │       │
│  │            ┌───────┐            │  │ [L] Lounge │       │
│  │            │T2     │            │  │            │       │
│  │            └───────┘            │  │ [🗑️] Delete│       │
│  └──────────────────────────────────┘  └────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 3. Sales App Main Screen (Option A - Dashboard First)

```text
┌─────────────────────────────────────────┐
│  SCREEN: Sales Dashboard  ID: ML_SALE_01│
│  Journey: App Home        Type: Mobile  │
│  Breakpoint: Mobile 390px               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Nezam Sales                [🔔] [Avatar]│
├─────────────────────────────────────────┤
│  Your Standing: #3 on Leaderboard       │
│  ┌───────────────────────────────────┐  │
│  │ Today's Sales: $1,200             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Quick Actions:                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ [+] New Book │  │ [🪑] View Map│    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  Recent Reservations:                   │
│  ┌───────────────────────────────────┐  │
│  │ Ahmed - Table 4 (VIP)             │  │
│  │ Status: Confirmed  [Send QR]      │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  [🏠] Home    [📅] Books    [👥] CRM  │
└─────────────────────────────────────────┘
```

## 4. Security App Scanner (Option B - Split Screen)

```text
┌─────────────────────────────────────────┐
│  SCREEN: QR Scanner       ID: ML_SEC_01 │
│  Journey: Door Check      Type: Mobile  │
│  Breakpoint: Mobile 390px               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Nezam Security                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │        [ CAMERA VIEW ]            │  │
│  │        ┌───────────┐              │  │
│  │        │  [SCAN]   │              │  │
│  │        └───────────┘              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Venue Capacity: 450/500                │
│                                         │
│  Last Scans:                            │
│  ✅ Ahmed (VIP) - Table 4               │
│  ✅ Sara - Table 12                     │
│  ❌ Ali - Expired Code                  │
│                                         │
├─────────────────────────────────────────┤
│  [📷] Scan    [👥] List    [📊] Stats  │
└─────────────────────────────────────────┘
```
