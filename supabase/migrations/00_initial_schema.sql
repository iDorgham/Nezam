-- Initial Schema for Nightclub System

-- 1. Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    layout_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tables Table
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'available', -- available, reserved, occupied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Clients Table (CRM)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    visit_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    sales_rep_id UUID, -- Links to auth.users if needed
    guest_name TEXT NOT NULL,
    guest_contact TEXT,
    status TEXT DEFAULT 'pending', -- pending, confirmed, arrived, cancelled
    qr_code_hash TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
