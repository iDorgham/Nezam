# Information Architecture & URL Map — Nightclub System (Egypt Focus)

> **Focus:** Multi-role routing (Mobile + Web) with support for regional seasonality (Cairo & Sahel).

## 1. URL Map & Routes

### 1.1 Guest Facing (Web/Mobile Web)
| Path | Description | Access |
|---|---|---|
| `/` | Landing page / Club discovery | Public |
| `/cairo` | Clubs and events in Cairo | Public |
| `/sahel` | Seasonal clubs and events in the North Coast | Public |
| `/book/[club-slug]` | Interactive table booking (Visual Layout) | Public |
| `/qr/[pass-id]` | Digital pass with QR code for entry | Guest (via link) |

### 1.2 Sales Mobile App
| Path | Description | Role |
|---|---|---|
| `/sales/dashboard` | Personal stats & leaderboard standing | Sales Rep |
| `/sales/reservations` | Create and manage bookings | Sales Rep |
| `/sales/clients` | Client CRM & contact list | Sales Rep |

### 1.3 Security Mobile App
| Path | Description | Role |
|---|---|---|
| `/security/scan` | QR code scanner interface | Security |
| `/security/list` | Manual guest list lookup | Security |
| `/security/capacity` | Live venue capacity tracker | Security |

### 1.4 Web Dashboard (Admin/Backoffice)
| Path | Description | Role |
|---|---|---|
| `/admin/owner` | High-level revenue & ROI analytics | Owner |
| `/admin/manager` | Real-time table monitoring & team live feed | Manager |
| `/admin/accountant` | Commission calculations & exports | Accountant |
| `/admin/tables/edit` | Drag-and-drop table layout builder | Manager / Owner |
| `/admin/crm` | Centralized client database | Manager / Owner |

## 2. Navigation Hierarchy

### 2.1 Sales App (Bottom Nav)
- **Dashboard:** Leaderboard position, today's sales.
- **Bookings:** Active reservations, add new.
- **Clients:** Contact list, history.

### 2.2 Security App (Bottom Nav)
- **Scanner:** Quick scan camera view.
- **Guest List:** Searchable list of expected arrivals.
- **Stats:** Current count inside vs capacity.

### 2.3 Web Dashboard (Sidebar)
- **Overview:** Role-specific summary (Owner/Manager).
- **Floor Plan:** Live table status & drag-and-drop editor.
- **Team:** Sales leaderboard and activity feed.
- **Finance:** Commissions and data exports (Accountant).
- **CRM:** Full client list and visit history.
