# System Architecture — Nightclub System

> **Focus:** Multi-platform architecture with real-time sync and offline capabilities.

## 1. System Overview
The system consists of three main components interacting with a centralized backend:
1.  **Web Dashboard:** For Owners, Managers, and Accountants (Browser-based).
2.  **Mobile Apps:** For Sales (Reservations) and Security (QR Scanning).
3.  **Backend & Database:** Handling business logic, real-time sync, and data storage.

## 2. Tech Stack Decisions

| Component | Technology | Rationale |
|---|---|---|
| **Web Dashboard** | Next.js (React) | Great for complex dashboards and potential public landing pages. |
| **Mobile Apps** | Flutter | Cross-platform (iOS/Android) with excellent performance and offline storage capabilities. |
| **Backend/DB** | Supabase (PostgreSQL) | Provides managed Postgres, built-in Auth, and Realtime sync out of the box. |
| **Real-time** | Supabase Realtime | Essential for live table status updates across all devices. |
| **Offline Mode** | Hive / SQLite (Flutter) | For local caching of the guest list in the security app. |

## 3. Data Model (Core Entities)

### 3.1 Users & Roles
- `id`, `email`, `role` (`owner` | `manager` | `accountant` | `sales` | `security`).

### 3.2 Venues & Tables
- **Venue:** `id`, `name`, `location`, `layout_config` (JSON for drag & drop layout).
- **Table:** `id`, `venue_id`, `table_number`, `capacity`, `min_spend`, `status` (`available` | `reserved` | `occupied`).

### 3.3 Reservations & Guests
- **Reservation:** `id`, `table_id`, `sales_rep_id`, `guest_name`, `guest_contact`, `qr_code_hash`, `status` (`pending` | `confirmed` | `arrived` | `cancelled`).
- **Client/CRM:** `id`, `name`, `phone`, `email`, `visit_count`, `notes`.

### 3.4 Financials
- **Leaderboard/Commissions:** Track completed reservations per `sales_rep_id` and calculate payouts.

## 4. Key Architectural Patterns
- **Database-Level Locks:** To prevent double-booking of tables during simultaneous requests.
- **Optimistic UI:** For the drag-and-drop table layout to feel instantaneous.
- **Event-Driven Arrival:** Scanning a QR code triggers a real-time event to update the manager's live feed and the sales rep's dashboard.
