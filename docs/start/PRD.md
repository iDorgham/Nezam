# Product Requirements Document (PRD) - Nightclub Reservation & Guest List System

## 1. Product Overview
A comprehensive system for managing nightclub reservations, guest lists, and table layouts. It includes mobile applications for sales staff, managers, and security personnel, and a browser-based dashboard for owners, managers, and accountants to streamline operations from booking to financial reconciliation.

## 2. User Personas
- **Sales Rep (Sam):** Goal is to book as many high-value tables as possible, manage their guest list, and track their commission/standing on the leaderboard.
- **Nightclub Manager (Maria):** Goal is to oversee the entire club operation, ensure tables are filled, monitor sales team performance, and handle issues at the door or tables.
- **Security Guard (Steve):** Goal is to verify guests quickly and safely, prevent unauthorized entry, and keep the line moving.
- **VIP Guest (Gaby):** Goal is a seamless, frictionless entry experience without waiting in long lines.
- **Owner (Oliver):** Goal is to see high-level profitability, ROI on the sales team, and overall venue performance via a browser dashboard.
- **Accountant (Alice):** Goal is to reconcile payments, track commissions for sales reps, and manage financial data via a browser dashboard.

## 3. Core Problem Solved
Nightclubs face inefficiencies in managing VIP reservations, manual guest list tracking, and slow entry processes. This system automates reservations, provides visual table management, and speeds up entry with QR scanning, while centralizing financial and client data for management.

## 4. Feature Requirements by Role

### 4.1 Sales App (Mobile)
- **Reservation Management:** Create, edit, and cancel reservations.
- **Guest List:** Add guests to lists with specific tags (VIP, Comp, General).
- **QR Code Generation:** Automatically generate and share QR codes via WhatsApp/SMS/Email.
- **Table Booking:** Interface with the visual layout to assign guests to specific tables.
- **Personal Dashboard:** View personal sales stats and position on the leaderboard.

### 4.2 Manager App & Dashboard (Mobile + Web)
- **Visual Table Layout (Drag & Drop):** Create and modify the club's table layout dynamically.
- **Real-time Monitoring:** See live status of tables (Available, Reserved, Occupied).
- **Team Tracking:** Monitor sales reps' performance in real-time.
- **Arrival Tracking:** See live feed of who has arrived and which sales rep brought them.
- **Analytics:** Detailed reports on occupancy, revenue, and sales performance.

### 4.3 Security App (Mobile)
- **QR Scanner:** Fast scanning of guest QR codes.
- **Manual Lookup:** Search guest list by name if QR fails or is lost.
- **Offline Mode:** Local cache of the guest list for continuous operation during network drops.
- **Capacity Counter:** Track entries and exits to monitor club capacity.

### 4.4 Owner & Accountant Dashboard (Web/Browser)
- **High-Level Analytics (Owner):** Revenue, occupancy, and top-performing sales reps at a glance.
- **Commission Management (Accountant):** Calculate and approve commissions for sales reps based on validated arrivals.
- **Financial Reports:** Export revenue and commission data to CSV/Excel.

### 4.5 Client CRM & Contacts (Shared)
- **Contact Database:** Centralized list of clients with contact info (phone, email).
- **Visit History:** Track guest visits, preferred tables, and associated sales reps.
- **Guest Profiling:** Add notes on preferences or special statuses.

## 5. Non-Functional Requirements
- **Real-Time Sync:** Latency for table status updates across devices < 2 seconds.
- **Offline Capability:** Security app must work offline for at least 30 minutes with cached data.
- **Security:** QR codes must be tamper-proof and single-use. Role-based access control (RBAC) for financial data.
- **Scalability:** System must handle up to 5,000 concurrent guests per night per venue.

## 6. Out of Scope (V1)
- In-app payment processing (handle externally or at the door for now).
- Music/DJ management features.
- Automated marketing campaigns (SMS/Email blasts).

## 7. Success Metrics
- Average entry time per guest < 5 seconds.
- 100% of tables tracked digitally.
- Zero double-booked tables.
- Reduced time for accountant to calculate commissions (target: < 1 hour per week).

## 8. Risks & Mitigations
- **Network Failure at Door:** Mitigated by offline mode and local caching in the security app.
- **Double Booking:** Mitigated by strict real-time locking mechanisms in the database for table selection.
- **Data Privacy:** Client contact data must be protected. Mitigated by strict Role-Based Access Control (RBAC).
