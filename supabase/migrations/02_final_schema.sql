-- Tropical Holidays Secure Ledger: Supabase Final Schema
-- This script matches the current application logic in voucher-actions.ts and login/page.tsx

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Table
-- Maps Supabase Auth users to their specific roles (admin or employee)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'employee')) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ledgers Table (Folders/Sheets for vouchers)
CREATE TABLE IF NOT EXISTS public.ledgers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vouchers Table (Main Data)
CREATE TABLE IF NOT EXISTS public.vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_number INTEGER NOT NULL,
    voucher_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recipient TEXT NOT NULL,
    amount NUMERIC(15, 3) NOT NULL DEFAULT 0, -- Combined RO and Baisa (e.g., 123.450)
    payment_method TEXT NOT NULL,
    bank_name TEXT,
    ref_no TEXT,
    purpose TEXT NOT NULL,
    ledger_id UUID REFERENCES public.ledgers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'void')),
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
-- Enabling RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Matching Firebase: request.auth != null)
-- Allow all authenticated users (including anonymous) to perform CRUD operations
-- The application handles role-based logic internally in voucher-actions.ts

CREATE POLICY "Allow authenticated users full access to user_roles" 
ON public.user_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to ledgers" 
ON public.ledgers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to vouchers" 
ON public.vouchers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to activity_logs" 
ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Functions & Triggers for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_vouchers_updated_at
BEFORE UPDATE ON vouchers
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_user_roles_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
