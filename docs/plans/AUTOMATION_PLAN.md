# Automation Plan: WhatsApp & Email QR Code Delivery

This plan outlines the architecture and steps required to implement automatic QR code delivery to guests via WhatsApp and Email once a reservation is confirmed.

## Objective
Automatically send a styled QR code and reservation details to the guest's phone (WhatsApp) and email address upon reservation confirmation.

## Proposed Tech Stack
*   **Database:** Supabase (PostgreSQL)
*   **Triggers:** Supabase Edge Functions (Webhooks on `reservations` table insert/update)
*   **Email Service:** Resend or SendGrid (Node.js SDK)
*   **WhatsApp Service:** Twilio WhatsApp API or Meta Official WhatsApp Business API

## Workflow

### 1. Reservation Creation
*   A sales rep or client creates a reservation.
*   The system generates a unique `qr_code_hash` (e.g., a UUID or secure token) and stores it in the `reservations` table with status `pending` or `confirmed`.

### 2. Trigger (Supabase Edge Function)
*   A Supabase Webhook listens for changes on the `reservations` table.
*   When a reservation status changes to `confirmed`, the webhook triggers a Supabase Edge Function.

### 3. Execution (Edge Function)
*   The function receives the reservation data (Guest Name, Phone, Email, Table, QR Hash).
*   **Email Delivery:**
    *   The function calls the Resend/SendGrid API.
    *   Sends a beautiful HTML email with the QR code embedded (using a URL like `https://api.qrserver.com/v1/create-qr-code/?data=HASH`).
*   **WhatsApp Delivery:**
    *   The function calls the Twilio/WhatsApp API.
    *   Sends a message template: *"Hi [Name], your reservation for [Table] is confirmed! Here is your access QR code: [Link to QR]"*.

## Implementation Steps

### Phase 1: Database & API Setup
- [ ] Ensure `reservations` table has `email` and `phone` fields (Done).
- [ ] Sign up for Resend (Email) and Twilio (WhatsApp) and get API keys.
- [ ] Store API keys in Supabase Vault (Environment Variables).

### Phase 2: Edge Function Development
- [ ] Create a new Supabase Edge Function: `supabase functions new send-ticket`.
- [ ] Write the logic to fetch reservation details and call external APIs.
- [ ] Test the function locally using Supabase CLI.

### Phase 3: Webhook Configuration
- [ ] Create a Database Webhook in the Supabase Dashboard.
- [ ] Set it to trigger on `INSERT` or `UPDATE` (when status becomes 'confirmed') of the `reservations` table.
- [ ] Point it to the Edge Function URL.

---
*Note: This feature requires active external accounts (Twilio/Resend) and cannot be fully tested without them.*
