-- Tropical Holidays Secure Ledger: Supabase Migration Schema
-- This script initializes the database for the Software Factory transition.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Employees Table (Role-Based Access Control)
-- This table links to Supabase Auth users.
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ledgers Table (Folders for vouchers)
CREATE TABLE IF NOT EXISTS public.ledgers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vouchers Table (Main Data)
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_no TEXT NOT NULL, -- Use a sequence if global ordering is needed
    date DATE NOT NULL,
    recipient TEXT NOT NULL,
    amount_ro NUMERIC(15, 3) NOT NULL DEFAULT 0,
    amount_bz NUMERIC(15, 0) NOT NULL DEFAULT 0,
    sum_in_words TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    bank_name TEXT,
    ref_no TEXT,
    purpose TEXT NOT NULL,
    ledger_id UUID REFERENCES public.ledgers(id) ON DELETE CASCADE,
    is_void BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Activity Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    detail TEXT,
    uid UUID,
    role TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 7. Policies
-- Public/Authenticated read access for employees
CREATE POLICY "Authenticated users can view ledgers" ON public.ledgers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view vouchers" ON public.vouchers FOR SELECT TO authenticated USING (true);

-- Admin-only management for ledgers
CREATE POLICY "Admins can manage ledgers" ON public.ledgers FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid() AND role = 'admin')
);

-- Admin and Employee management for vouchers
CREATE POLICY "Authorized roles can manage vouchers" ON public.vouchers FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid() AND role IN ('admin', 'employee'))
);

-- Audit log: Read by admin, insert by anyone
CREATE POLICY "Anyone can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can view activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.employees WHERE id = auth.uid() AND role = 'admin')
);
